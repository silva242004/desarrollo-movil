import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { flashOutline, logOutOutline, peopleOutline, serverOutline } from 'ionicons/icons';
import { useAuth } from '../hooks/useAuth';
import { useNetwork } from '../hooks/useNetwork';
import NetworkBanner from '../components/NetworkBanner';

function Home() {
  const { user, logout } = useAuth();
  const { connected, connectionType } = useNetwork();
  const router = useIonRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonNote>Sesion: {user?.email}</IonNote>
        <div>
          <NetworkBanner connected={connected} gated={false} />
          <IonNote>Red: {connectionType}</IonNote>
        </div>

        <IonList>
          <IonItem detail routerLink="/contacts" routerDirection="forward">
            <IonIcon icon={peopleOutline} slot="start" />
            <IonLabel>
              <h2>Contactos</h2>
              <p>Firebase Firestore (requiere conexion)</p>
            </IonLabel>
          </IonItem>
          <IonItem detail routerLink="/tasks" routerDirection="forward">
            <IonIcon icon={flashOutline} slot="start" />
            <IonLabel>
              <h2>Tasks</h2>
              <p>Firebase Realtime Database (requiere conexion)</p>
            </IonLabel>
          </IonItem>
          <IonItem detail routerLink="/fruits" routerDirection="forward">
            <IonIcon icon={serverOutline} slot="start" />
            <IonLabel>
              <h2>Frutas</h2>
              <p>Dexie / IndexedDB (funciona sin conexion)</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Home;
