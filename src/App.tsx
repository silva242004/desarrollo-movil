import { IonApp } from '@ionic/react';
import TaskManagerPage from './pages/TaskManagerPage';

// Challenge 03 - Task Manager en Ionic.
// Solo se usan componentes de Ionic (IonApp, IonPage, IonHeader,
// IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, etc).
function App() {
  return (
    <IonApp>
      <TaskManagerPage />
    </IonApp>
  );
}

export default App;
