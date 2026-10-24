import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '../firebase/config';
import { FIRESTORE_COLLECTION, SYNC_TIMEOUT_MS } from '../config/missions';
import { fromStoredProgress, hasPendingSync, setPendingSync, toStoredProgress } from '../utils/progress';
import { useNetwork } from './useNetwork';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'pending' | 'error';

interface Params {
  user: User | null;
  completedIds: number[];
  // true cuando el estado del contexto ya es del usuario actual (HYDRATE local hecho).
  ready: boolean;
  // Lo llamo cuando Firestore trae un progreso que debe reemplazar al local.
  onRemoteProgress: (completedIds: number[]) => void;
}

// Escribe el documento del usuario en parcial2Users. Uso merge para no
// borrar campos que no mando, y solo mando displayName si lo tengo: si no,
// un null pisaria el nombre que guardo el registro.
async function writeProgress(user: User, completedIds: number[], displayName?: string | null) {
  const name = displayName ?? user.displayName;
  await withTimeout(
    setDoc(
      doc(db, FIRESTORE_COLLECTION, user.uid),
      {
        ...toStoredProgress(completedIds),
        email: user.email,
        ...(name ? { displayName: name } : {}),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
  );
}

// Documento inicial con 0 puntos al registrarse. Lo llama useFirebaseAuth;
// si falla (sin red) no rompo el registro: el contexto lo crea al sincronizar.
export async function createInitialProgress(user: User, displayName: string) {
  try {
    await writeProgress(user, [], displayName);
  } catch {
    // Se reintenta solo desde useProgressSync.
  }
}

// Offline, setDoc no falla: se queda esperando a que vuelva la red. Le pongo
// un tiempo maximo para poder marcar el cambio como pendiente.
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firestore no respondio')), SYNC_TIMEOUT_MS)),
  ]);
}

// Hook de sincronizacion con Firebase (la seccion "API" del enunciado).
// Que hace: observa el progreso del MissionsContext y lo sube a Firestore.
//  - Al iniciar sesion lee el documento del usuario: si existe y no hay
//    cambios locales pendientes, Firebase manda (llama onRemoteProgress).
//    Si no existe, o si hay cambios hechos sin red, subo lo local.
//  - Cada cambio del progreso se sube (el contexto ya lo guardo en local).
//  - Sin red o si Firestore falla, marco el cambio como pendiente y lo
//    reintento cuando useNetwork (challenge 06) avisa que volvio la conexion.
// Que devuelve: { status } para mostrar si esta sincronizado.
// Plugin: @capacitor/network (via useNetwork); Firestore es el SDK web.
export function useProgressSync({ user, completedIds, ready, onRemoteProgress }: Params) {
  const { connected } = useNetwork();
  const [status, setStatus] = useState<SyncStatus>('idle');
  // Usuario para el que ya termine la lectura inicial. Hasta entonces no
  // subo nada, para no pisar Firebase con el progreso local viejo.
  const [pulledUid, setPulledUid] = useState<string | null>(null);
  // Ultimo progreso que se que esta en Firestore, para no reescribir lo mismo.
  const lastSynced = useRef<string | null>(null);
  const pulling = useRef(false);
  // Los efectos asincronos leen el progreso actual desde aqui.
  const latestIds = useRef(completedIds);
  latestIds.current = completedIds;
  const onRemoteRef = useRef(onRemoteProgress);
  onRemoteRef.current = onRemoteProgress;

  const uid = user?.uid ?? null;
  const uidRef = useRef(uid);
  uidRef.current = uid;

  // Al cerrar sesion o cambiar de cuenta empiezo de cero.
  useEffect(() => {
    setPulledUid(null);
    lastSynced.current = null;
    setStatus('idle');
  }, [uid]);

  const push = async (target: User, ids: number[]) => {
    const key = JSON.stringify(ids);
    setStatus('syncing');
    try {
      await writeProgress(target, ids);
      lastSynced.current = key;
      setPendingSync(target.uid, false);
      setStatus('synced');
    } catch {
      setPendingSync(target.uid, true);
      setStatus('error');
    }
  };

  // 1) Lectura inicial (y reintento cuando vuelve la red).
  useEffect(() => {
    if (!user || !ready || pulledUid === user.uid || pulling.current) return;
    if (!connected) {
      setStatus('pending');
      return;
    }
    pulling.current = true;
    // Si en medio de la lectura cambia la cuenta, descarto el resultado. No
    // lo cancelo por otros cambios (por ejemplo la red parpadea), porque el
    // efecto no se volveria a disparar y la lectura quedaria perdida.
    const stillSameUser = () => uidRef.current === user.uid;
    (async () => {
      setStatus('syncing');
      try {
        const snapshot = await withTimeout(getDoc(doc(db, FIRESTORE_COLLECTION, user.uid)));
        if (!stillSameUser()) return;
        if (snapshot.exists() && !hasPendingSync(user.uid)) {
          const remoteIds = fromStoredProgress(snapshot.data());
          lastSynced.current = JSON.stringify(remoteIds);
          onRemoteRef.current(remoteIds);
          setStatus('synced');
        } else {
          await push(user, latestIds.current);
        }
        if (stillSameUser()) setPulledUid(user.uid);
      } catch {
        // Si falla la lectura sigo con lo local; se reintenta al reconectar.
        if (stillSameUser()) setStatus('error');
      } finally {
        pulling.current = false;
      }
    })();
    // push y onRemote los leo por referencia; solo reacciono a estos cambios.
  }, [user, ready, connected, pulledUid]);

  // 2) Cada cambio del progreso (completar o reiniciar) se sube.
  useEffect(() => {
    if (!user || !ready || pulledUid !== user.uid) return;
    if (JSON.stringify(completedIds) === lastSynced.current) return;
    if (!connected) {
      setPendingSync(user.uid, true);
      setStatus('pending');
      return;
    }
    push(user, completedIds);
  }, [user, ready, pulledUid, completedIds, connected]);

  return { status };
}
