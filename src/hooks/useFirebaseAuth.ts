import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Traduce los codigos de error de Firebase a mensajes para el usuario.
function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o password incorrectos';
    case 'auth/invalid-email':
      return 'El email no es valido';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese email';
    case 'auth/weak-password':
      return 'El password debe tener al menos 6 caracteres';
    case 'auth/network-request-failed':
      return 'Sin conexion. Revisa tu internet';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      return 'Firebase no esta configurado (revisa el archivo .env)';
    default:
      return 'Ocurrio un error. Intenta de nuevo';
  }
}

// Custom hook (Clase 05): toda la logica de Firebase Authentication vive
// aqui, no en los componentes. Quien lo use recibe el usuario actual y
// las funciones login / register / logout.
export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  // loading = true hasta que Firebase responde si ya habia una sesion
  // guardada. Sin esto se veria un parpadeo de la pantalla de login.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Cada funcion devuelve null si todo salio bien o el mensaje de error.
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      return friendlyError(error);
    }
  };

  const register = async (email: string, password: string): Promise<string | null> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      return friendlyError(error);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return { user, loading, login, register, logout };
}
