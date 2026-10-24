export type MissionStatus = 'locked' | 'pending' | 'completed';

// Lo fijo de cada mision (vive en config/missions.ts).
export interface MissionDefinition {
  id: number;
  title: string;
  description: string;
  points: number;
}

// La mision tal como la ve la UI: definicion + estado calculado.
export interface Mission extends MissionDefinition {
  status: MissionStatus;
}

// Forma del progreso que guardo en localStorage y en Firestore (la misma
// del enunciado). Firestore le agrega displayName, email y updatedAt.
export interface StoredProgress {
  points: number;
  missions: { id: number; completed: boolean }[];
}
