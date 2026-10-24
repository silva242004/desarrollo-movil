import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import { MissionsProvider } from './context/MissionsContext';
import AppRoutes from './routes/AppRoutes';

// Parcial 2 - App de misiones. Reutilizo el AuthProvider del challenge 05.
// El orden importa: MissionsProvider usa useAuth (necesita el uid), asi que
// va dentro de AuthProvider.
function App() {
  return (
    <IonApp>
      <AuthProvider>
        <MissionsProvider>
          <IonReactRouter>
            <AppRoutes />
          </IonReactRouter>
        </MissionsProvider>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
