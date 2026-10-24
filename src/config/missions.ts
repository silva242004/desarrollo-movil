import type { MissionDefinition } from '../types';

// Todo lo configurable del parcial vive aqui, para cambiar umbrales, puntos
// o tiempos en un solo lugar y no andar buscando numeros regados.

// Las misiones van en orden: completar una desbloquea la siguiente.
export const MISSIONS: MissionDefinition[] = [
  {
    id: 1,
    title: 'Evidencia',
    description: 'Toma una foto con la camara y guardala en el dispositivo.',
    points: 20,
  },
  {
    id: 2,
    title: 'Movimiento real',
    description: 'Desplazate fisicamente mas alla de la distancia minima desde tu punto de inicio.',
    points: 30,
  },
  {
    id: 3,
    title: 'Permanencia activa',
    description: 'Deja el telefono quieto durante el tiempo indicado sin moverlo.',
    points: 50,
  },
];

export const TOTAL_POINTS = MISSIONS.reduce((sum, m) => sum + m.points, 0);

// --- Mision 2: movimiento ---
// El enunciado menciona 30 y 50 m; dejo 50 por defecto y se cambia aqui.
export const DISTANCE_THRESHOLD_M = 50;
// Descarto lecturas con precision peor a esto porque el GPS deriva aunque
// el telefono este quieto y daria distancias falsas.
export const MAX_ACCURACY_M = 20;

// --- Mision 3: permanencia ---
// Variacion maxima (m/s²) de la magnitud de la aceleracion dentro de la
// ventana para considerar el telefono quieto. Empiezo en 0.6 y lo ajusto
// probando en el telefono.
export const STILLNESS_THRESHOLD = 0.6;
// Cuantas lecturas del acelerometro guardo en la ventana movil.
export const STILLNESS_WINDOW_SIZE = 20;
// Segundos que el telefono debe quedarse quieto.
export const STILLNESS_DURATION_S = 10;
// Cada cuanto refresco la cuenta regresiva en pantalla.
export const COUNTDOWN_TICK_MS = 200;
// Duracion de la vibracion al completar la mision 3.
export const COMPLETE_VIBRATION_MS = 1000;

// --- Notificaciones ---
// Canal propio de Android. El canal "default" del plugin tiene importancia 3:
// la notificacion llega pero solo queda en el panel, sin aparecer en pantalla.
export const NOTIFICATION_CHANNEL_ID = 'misiones';

// --- Persistencia ---
// Prefijo de la clave en localStorage; se le agrega el uid del usuario.
export const LOCAL_STORAGE_PREFIX = 'parcial2:progress:';
// Coleccion propia en Firestore para no mezclar con los datos de los
// challenges, que viven en el mismo proyecto de Firebase.
export const FIRESTORE_COLLECTION = 'parcial2Users';
// Cuantos usuarios muestra el ranking.
export const RANKING_LIMIT = 5;
// Si Firestore no responde en este tiempo lo trato como fallo y dejo el
// cambio pendiente: offline, setDoc no rechaza, se queda esperando.
export const SYNC_TIMEOUT_MS = 10_000;
