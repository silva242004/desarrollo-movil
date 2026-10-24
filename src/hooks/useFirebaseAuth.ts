import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createInitialProgress } from './useProgressSync';

// Traduce los codigos de error de Firebase a mensajes para el usuario.
function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos';
    case 'auth/invalid-email':
      return 'El email no es valido';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese email';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
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

// Hook de sesion (reutilizado del challenge 05).
// Que hace: envuelve Firebase Authentication para que las paginas no toquen
//   Firebase directamente.
// Que devuelve: { user, loading, login, register, logout }; login/register
//   devuelven null si todo salio bien o el mensaje de error para mostrar.
// Plugin: ninguno de Capacitor, usa el SDK web de Firebase (firebase/auth).
// Cambio frente al challenge 05: register recibe tambien el nombre, porque
// el ranking necesita mostrar un displayName y no el correo.
export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  // loading = true hasta que Firebase responde si ya habia una sesion
  // guardada. Sin esto se veria un parpadeo de la pantalla de login.
  const [loading, setLoading] = useState(true);
  // updateProfile cambia el objeto User por dentro (misma referencia), asi
  // que React no se entera del nombre nuevo. Subo este contador para forzar
  // un render despues de guardar el nombre.
  const [, setProfileVersion] = useState(0);

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

  const register = async (displayName: string, email: string, password: string): Promise<string | null> => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      setProfileVersion((v) => v + 1);
      // Documento inicial en Firestore con 0 puntos, para que aparezca en el
      // ranking desde el primer momento.
      await createInitialProgress(credential.user, displayName);
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
