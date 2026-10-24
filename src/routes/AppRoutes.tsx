import { useEffect, useRef, type ReactElement } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import FullScreenSpinner from '../components/FullScreenSpinner';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TabsLayout from '../pages/TabsLayout';

// Redirige UNA sola vez al montarse. No se usa <Navigate> porque
// IonRouterOutlet deja montadas las paginas anteriores y <Navigate> se
// vuelve a disparar cada vez que cambia la ruta, devolviendo al usuario
// a la pantalla anterior (por ejemplo, tocar "Registrarme" y rebotar al
// login).
function RedirectOnce({ to }: { to: string }) {
  const navigate = useNavigate();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    navigate(to, { replace: true });
  }, [navigate, to]);
  return null;
}

// Solo entra quien tiene sesion; los demas van al login.
function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? children : <RedirectOnce to="/login" />;
}

// Login y registro: si ya hay sesion, salto directo a las misiones.
function PublicRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <RedirectOnce to="/tabs/missions" /> : children;
}

function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      {/* Todo lo que cuelga de /tabs (Misiones, Ranking, Resultados) exige sesion. */}
      <Route path="/tabs/*" element={<PrivateRoute><TabsLayout /></PrivateRoute>} />
      <Route path="/" element={<RedirectOnce to="/tabs/missions" />} />
    </IonRouterOutlet>
  );
}

export default AppRoutes;
