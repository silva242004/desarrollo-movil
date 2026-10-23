import { useEffect, useRef, type ReactElement } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import FullScreenSpinner from '../components/FullScreenSpinner';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import ContactsPage from '../pages/ContactsPage';
import TasksPage from '../pages/TasksPage';
import FruitsPage from '../pages/FruitsPage';

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

// Login y registro: si ya hay sesion, se salta directo a la lista.
function PublicRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <RedirectOnce to="/home" /> : children;
}

function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/contacts" element={<PrivateRoute><ContactsPage /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
      <Route path="/fruits" element={<PrivateRoute><FruitsPage /></PrivateRoute>} />
      <Route path="/" element={<RedirectOnce to="/home" />} />
    </IonRouterOutlet>
  );
}

export default AppRoutes;
