import { IonContent, IonPage, IonText } from '@ionic/react';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../hooks/useAuth';

// Pestana vacia por ahora: aqui va los puntos, las misiones completadas y el reinicio (fase 4).
function Results() {
  const { user } = useAuth();
  return (
    <IonPage>
      <AppHeader title="Resultados" />
      <IonContent className="ion-padding">
        <IonText>
          <p>Hola, {user?.displayName ?? user?.email}.</p>
        </IonText>
      </IonContent>
    </IonPage>
  );
}

export default Results;
