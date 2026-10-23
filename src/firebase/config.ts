import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// La configuracion viene de variables de entorno (archivo .env, ver
// .env.example) para no dejar las claves escritas en el codigo.
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL as string | undefined,
};

// Si falta el .env la app igual abre (con un aviso en el login) en vez de
// quedarse en blanco: se usan valores de relleno para que Firebase no lance
// error al iniciar; solo falla cuando se intenta usar un servicio.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const projectId = firebaseConfig.projectId || 'sin-configurar';
const app = initializeApp({
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey || 'sin-configurar',
  projectId,
  databaseURL: firebaseConfig.databaseURL || `https://${projectId}-default-rtdb.firebaseio.com`,
});

export const auth = getAuth(app);
// Firestore (Contactos) y Realtime Database (Tasks): dos bases de datos
// distintas de Firebase, con la misma app.
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
