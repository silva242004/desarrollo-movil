import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import AppRoutes from './routes/AppRoutes';

// Challenge 05 - Tasks con Firebase (login/registro/logout), dos
// contextos (Auth y Tasks) y custom hooks.
// El orden importa: TasksProvider usa useAuth, asi que va dentro de
// AuthProvider.
function App() {
  return (
    <IonApp>
      <AuthProvider>
        <TasksProvider>
          <IonReactRouter>
            <AppRoutes />
          </IonReactRouter>
        </TasksProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
