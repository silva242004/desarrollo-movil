import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Parcial 2 - App de misiones. Reutilizo el AuthProvider del challenge 05;
// en la fase 2 entra el MissionsProvider dentro de el (porque necesita el uid).
function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}

export default App;
