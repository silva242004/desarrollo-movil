import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// La configuracion viene de variables de entorno (archivo .env, ver
// .env.example) para no dejar las claves escritas en el codigo.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

// Si falta el .env la app igual abre (con un aviso en el login) en vez de
// quedarse en blanco: con un apiKey de relleno Firebase no lanza error al
// iniciar, solo falla cuando se intenta hacer login.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = initializeApp({
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey || 'sin-configurar',
});

export const auth = getAuth(app);
