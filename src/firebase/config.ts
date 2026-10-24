import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Saco la configuracion del .env (el mismo proyecto de Firebase de los
// challenges 05 y 06) para no dejar las claves escritas en el codigo.
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

// Si falta el .env la app igual abre (con un aviso en el login) en vez de
// quedarse en blanco: uso valores de relleno para que Firebase no lance
// error al iniciar; solo falla cuando se intenta usar un servicio.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = initializeApp({
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey || 'sin-configurar',
  projectId: firebaseConfig.projectId || 'sin-configurar',
});

// Del challenge 06 quite Realtime Database: en el parcial solo uso Auth
// (login) y Firestore (progreso y ranking).
export const auth = getAuth(app);
export const db = getFirestore(app);
