import { createContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (displayName: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

// Contexto de sesion (reutilizado del challenge 05): login, registro y logout.
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
