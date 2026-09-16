import type { ReactElement } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import ListPage from './pages/ListPage';
import { isLoggedIn } from './utils/auth';

// Ruta protegida: si no hay token "logged" en localStorage, redirige a
// /login en vez de mostrar la pagina.
function PrivateRoute({ children }: { children: ReactElement }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// Challenge 04 - Login demo en Ionic.
// Si ya hay un token "logged" guardado en localStorage, no hace falta
// volver a loguearse (se salta directo a /list).
function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" element={<Login />} />
          <Route
            path="/list"
            element={
              <PrivateRoute>
                <ListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={isLoggedIn() ? '/list' : '/login'} replace />}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
