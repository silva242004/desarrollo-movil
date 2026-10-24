import { IonContent, IonPage, IonText } from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

// Pestana vacia por ahora: aqui va la lista de misiones, los puntos y la barra de progreso (fase 2).
function Home() {
  const { user } = useAuth();
  return (
    <IonPage>
      <AppHeader title="Misiones" />
      <IonContent className="ion-padding">
        <IonText>
          <p>Hola, {user?.displayName ?? user?.email}.</p>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default Home;
