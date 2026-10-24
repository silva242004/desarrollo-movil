import { IonContent, IonPage, IonText } from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

// Pestana vacia por ahora: aqui va el top 5 en tiempo real desde Firestore (fase 4).
function Ranking() {
  const { user } = useAuth();
  return (
    <IonPage>
      <AppHeader title="Ranking" />
      <IonContent className="ion-padding">
        <IonText>
          <p>Hola, {user?.displayName ?? user?.email}.</p>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default Ranking;
