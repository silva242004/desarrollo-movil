import { LOCAL_STORAGE_PREFIX, MISSIONS } from '../config/missions';
import type { Mission, StoredProgress } from '../types';

// Funciones puras sobre el progreso. Las separo del contexto para poder
// usarlas igual desde el reducer y desde la sincronizacion con Firestore.

// Me quedo solo con las misiones completadas en orden (1, 1-2, 1-2-3). Asi,
// aunque llegue algo raro de localStorage o de Firebase (por ejemplo la 3
// sin la 2), nunca queda una mision "completada" saltandose el orden.
export function normalizeCompleted(ids: number[]): number[] {
  const done = new Set(ids);
  const result: number[] = [];
  for (const mission of MISSIONS) {
    if (!done.has(mission.id)) break;
    result.push(mission.id);
  }
  return result;
}

// Los puntos salen de las misiones completadas, no de un contador que se
// vaya sumando: asi es imposible sumar dos veces la misma mision.
export function pointsFor(completedIds: number[]): number {
  return MISSIONS.filter((m) => completedIds.includes(m.id)).reduce((sum, m) => sum + m.points, 0);
}

// Estado de cada mision: completada, la siguiente en la fila queda
// pendiente y el resto bloqueadas.
export function missionsWithStatus(completedIds: number[]): Mission[] {
  let nextFound = false;
  return MISSIONS.map((m): Mission => {
    if (completedIds.includes(m.id)) return { ...m, status: 'completed' };
    if (!nextFound) {
      nextFound = true;
      return { ...m, status: 'pending' };
    }
    return { ...m, status: 'locked' };
  });
}

export function toStoredProgress(completedIds: number[]): StoredProgress {
  return {
    points: pointsFor(completedIds),
    missions: MISSIONS.map((m) => ({ id: m.id, completed: completedIds.includes(m.id) })),
  };
}

export function fromStoredProgress(progress: Partial<StoredProgress> | null | undefined): number[] {
  if (!progress || !Array.isArray(progress.missions)) return [];
  return normalizeCompleted(progress.missions.filter((m) => m?.completed).map((m) => m.id));
}

// --- localStorage ---
// Una clave por usuario para que dos cuentas en el mismo telefono no se
// pisen el progreso.
const localKey = (uid: string) => `${LOCAL_STORAGE_PREFIX}${uid}`;

export function loadLocalProgress(uid: string): StoredProgress | null {
  try {
    const raw = localStorage.getItem(localKey(uid));
    return raw ? (JSON.parse(raw) as StoredProgress) : null;
  } catch {
    // JSON danado o storage bloqueado: arranco como si no hubiera nada.
    return null;
  }
}

// Marca de "hay cambios locales que no llegaron a Firestore" (por ejemplo,
// misiones completadas sin red). Mientras exista, al reconectar subo lo local
// en vez de dejar que Firebase lo pise.
const pendingKey = (uid: string) => `${localKey(uid)}:pending`;

export function hasPendingSync(uid: string): boolean {
  try {
    return localStorage.getItem(pendingKey(uid)) === '1';
  } catch {
    return false;
  }
}

export function setPendingSync(uid: string, pending: boolean) {
  try {
    if (pending) localStorage.setItem(pendingKey(uid), '1');
    else localStorage.removeItem(pendingKey(uid));
  } catch {
    // Sin storage no puedo recordar la marca; en el peor caso Firebase manda.
  }
}

export function saveLocalProgress(uid: string, progress: StoredProgress) {
  try {
    localStorage.setItem(localKey(uid), JSON.stringify(progress));
  } catch {
    // Si el storage esta lleno o bloqueado no rompo la app; Firebase queda
    // como respaldo (fase 4).
  }
}
