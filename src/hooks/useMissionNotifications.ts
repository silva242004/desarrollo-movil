import { useEffect, useRef } from 'react';
import { MISSIONS, TOTAL_POINTS } from '../config/missions';
import { useLocalNotifications } from './useLocalNotifications';

export interface CompletionEvent {
  id: number;
  // Contador que sube con cada mision completada, para que dos eventos
  // seguidos nunca se vean iguales.
  seq: number;
}

interface Params {
  uid: string | null;
  // Ultima mision completada con COMPLETE_MISSION (null tras HYDRATE/RESET).
  lastCompletion: CompletionEvent | null;
  completedCount: number;
}

// Hook de notificaciones de las misiones (sobre useLocalNotifications).
// Que hace: pide el permiso de notificaciones al iniciar sesion y observa el
//   estado del contexto. Cuando el usuario completa una mision avisa "Has
//   completado una mision", y si con eso queda exactamente 1 pendiente,
//   avisa "Te falta 1 mision para completar".
//   Solo reacciono a COMPLETE_MISSION: un HYDRATE (cargar progreso de
//   Firebase o de local) no debe disparar avisos de misiones viejas.
// Que devuelve: { permission } ('granted' | 'denied' | null) para mostrar un
//   aviso si el usuario nego las notificaciones.
// Plugin: @capacitor/local-notifications.
export function useMissionNotifications({ uid, lastCompletion, completedCount }: Params) {
  const { permission, ensurePermission, notify } = useLocalNotifications();
  const notifiedSeq = useRef<number | null>(null);

  // Pido el permiso apenas hay sesion (Android 13+ muestra el dialogo).
  useEffect(() => {
    if (uid) ensurePermission();
  }, [uid, ensurePermission]);

  useEffect(() => {
    // Tras un RESET o HYDRATE el contador vuelve a empezar en 1; olvido el
    // ultimo seq avisado para no saltarme la siguiente mision.
    if (!lastCompletion) {
      notifiedSeq.current = null;
      return;
    }
    if (notifiedSeq.current === lastCompletion.seq) return;
    notifiedSeq.current = lastCompletion.seq;
    const mission = MISSIONS.find((m) => m.id === lastCompletion.id);
    // Los textos de los avisos van tal cual los pide el enunciado.
    notify('Has completado una misión', mission ? `${mission.title}: +${mission.points} puntos` : '');
    if (MISSIONS.length - completedCount === 1) {
      notify('Te falta 1 misión para completar', `Complétala para llegar a los ${TOTAL_POINTS} puntos.`);
    }
  }, [lastCompletion, completedCount, notify]);

  return { permission };
}
