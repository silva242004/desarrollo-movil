import { IonButton, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useLocalNotifications } from '../hooks/useLocalNotifications';

function LocalNotificationsPage() {
  const { pending, error, schedule, cancelAll } = useLocalNotifications();

  return (
    <SensorPage title="Local Notifications" plugin="@capacitor/local-notifications">
      <IonButton
        expand="block"
        className="ion-margin-top"
        onClick={() => schedule('Recordatorio', 'Notificacion en 5 segundos', 5)}
      >
        Programar en 5 segundos
      </IonButton>
      <IonButton
        expand="block"
        color="secondary"
        onClick={() => schedule('Recordatorio', 'Notificacion en 30 segundos', 30)}
      >
        Programar en 30 segundos
      </IonButton>
      <IonButton expand="block" color="danger" fill="outline" onClick={cancelAll}>
        Cancelar pendientes
      </IonButton>
      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}

      <h3>Pendientes ({pending.length})</h3>
      <IonList>
        {pending.map((n) => (
          <IonItem key={n.id}>
            <IonLabel>
              <h2>{n.title}</h2>
              <p>{n.body}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </SensorPage>
  );
}

export default LocalNotificationsPage;
