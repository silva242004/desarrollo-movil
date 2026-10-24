import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useAuth } from '../hooks/useAuth';

interface Props {
  title: string;
}

// Header comun de las pestanas. Pongo el logout aqui para no repetir el
// boton en cada pagina.
function AppHeader({ title }: Props) {
  const { logout } = useAuth();
  const router = useIonRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root');
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={handleLogout} aria-label="Cerrar sesion">
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}

export default AppHeader;
