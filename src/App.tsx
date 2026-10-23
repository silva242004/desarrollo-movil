import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Challenge 06 - App nueva con login real (Firebase Auth) y rutas:
//   Contactos -> Firestore, Tasks -> Realtime Database, Frutas -> Dexie,
//   y acciones de Contactos/Tasks deshabilitadas sin conexion (Network).
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
