import { useIonRouter } from '@ionic/react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logout } from '../utils/auth';

// Pagina protegida a la que se llega solo si "logged" existe en
// localStorage (ver App.tsx / PrivateRoute).
const ITEMS = ['Elemento 1', 'Elemento 2', 'Elemento 3'];

function ListPage() {
  const router = useIonRouter();

  const handleLogout = () => {
    logout();
    // navigateRoot limpia el historial: al cerrar sesion no se puede
    // volver atras con el boton "back" hacia la pagina protegida.
    router.navigateRoot('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {ITEMS.map((item) => (
            <IonItem key={item}>
              <IonLabel>{item}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default ListPage;
