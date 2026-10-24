import { useContext } from 'react';
import { MissionsContext } from '../context/MissionsContext';

// Hook para leer el MissionsContext (mismo patron que useAuth).
// Que hace: da acceso a las misiones y a las acciones sin repetir
//   useContext + la validacion en cada pagina.
// Que devuelve: missions, points, progress, completeMission, reset, etc.
// Plugin: ninguno de Capacitor.
export function useMissions() {
  const ctx = useContext(MissionsContext);
  if (!ctx) throw new Error('useMissions debe usarse dentro de <MissionsProvider>');
  return ctx;
}
