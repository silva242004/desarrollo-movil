import { createContext, useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { MISSIONS, TOTAL_POINTS } from '../config/missions';
import { useAuth } from '../hooks/useAuth';
import type { Mission } from '../types';
import {
  fromStoredProgress,
  loadLocalProgress,
  missionsWithStatus,
  normalizeCompleted,
  pointsFor,
  saveLocalProgress,
  toStoredProgress,
} from '../utils/progress';

// --- Reducer ---
// Guardo solo los ids completados; puntos, progreso y desbloqueo se
// calculan a partir de ahi. ownerUid me dice de quien es el estado cargado,
// para no guardar el progreso de un usuario en la clave de otro.
interface State {
  ownerUid: string | null;
  completedIds: number[];
}

type Action =
  | { type: 'HYDRATE'; uid: string | null; completedIds: number[] }
  | { type: 'COMPLETE_MISSION'; id: number }
  | { type: 'RESET' };

const initialState: State = { ownerUid: null, completedIds: [] };

function missionsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ownerUid: action.uid, completedIds: normalizeCompleted(action.completedIds) };
    case 'COMPLETE_MISSION': {
      // Solo se puede completar la mision pendiente: si ya estaba completada
      // o sigue bloqueada no cambio nada (asi los puntos no se suman dos veces).
      const pending = missionsWithStatus(state.completedIds).find((m) => m.status === 'pending');
      if (!pending || pending.id !== action.id) return state;
      return { ...state, completedIds: [...state.completedIds, action.id] };
    }
    case 'RESET':
      return { ...state, completedIds: [] };
    default:
      return state;
  }
}

// --- Contexto ---
export interface MissionsContextValue {
  missions: Mission[];
  points: number;
  totalPoints: number;
  completedCount: number;
  totalMissions: number;
  // De 0 a 1, para IonProgressBar.
  progress: number;
  isFinished: boolean;
  // false mientras cargo el progreso del usuario que acaba de entrar.
  ready: boolean;
  getMission: (id: number) => Mission | undefined;
  completeMission: (id: number) => void;
  reset: () => void;
}

export const MissionsContext = createContext<MissionsContextValue | null>(null);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, dispatch] = useReducer(missionsReducer, initialState);

  // Al cambiar de usuario (login, logout, otra cuenta) cargo su progreso
  // local. En la fase 4 aqui entra Firestore, que manda si hay conexion.
  useEffect(() => {
    const completedIds = uid ? fromStoredProgress(loadLocalProgress(uid)) : [];
    dispatch({ type: 'HYDRATE', uid, completedIds });
  }, [uid]);

  // Cada cambio se guarda primero en local. Espero a que el estado sea del
  // usuario actual: si no, al entrar con otra cuenta guardaria el progreso
  // anterior en su clave antes de que llegue el HYDRATE.
  useEffect(() => {
    if (!uid || state.ownerUid !== uid) return;
    saveLocalProgress(uid, toStoredProgress(state.completedIds));
  }, [uid, state]);

  const completeMission = useCallback((id: number) => dispatch({ type: 'COMPLETE_MISSION', id }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  // Todo lo derivado se calcula aqui una sola vez; las paginas solo leen.
  const value = useMemo<MissionsContextValue>(() => {
    const missions = missionsWithStatus(state.completedIds);
    const completedCount = state.completedIds.length;
    return {
      missions,
      points: pointsFor(state.completedIds),
      totalPoints: TOTAL_POINTS,
      completedCount,
      totalMissions: MISSIONS.length,
      progress: completedCount / MISSIONS.length,
      isFinished: completedCount === MISSIONS.length,
      ready: uid !== null && state.ownerUid === uid,
      getMission: (id: number) => missions.find((m) => m.id === id),
      completeMission,
      reset,
    };
  }, [state, uid, completeMission, reset]);

  return <MissionsContext.Provider value={value}>{children}</MissionsContext.Provider>;
}
