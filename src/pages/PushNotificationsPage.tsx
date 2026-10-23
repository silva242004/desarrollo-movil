import { IonButton, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import Result from '../components/Result';
import { usePushNotifications } from '../hooks/usePushNotifications';

function PushNotificationsPage() {
  const { supported, token, notifications, error, register } = usePushNotifications();

  return (
    <SensorPage title="Push Notifications" plugin="@capacitor/push-notifications">
      {!supported ? (
        <IonText color="warning">
          <p>
            Las notificaciones push solo funcionan en el telefono (app instalada con
            <b> ionic cap run android</b> y el archivo google-services.json). En el navegador
            no estan disponibles.
          </p>
        </IonText>
      ) : (
        <IonButton expand="block" className="ion-margin-top" onClick={register}>
          Registrar dispositivo
        </IonButton>
      )}

      <h3>Token FCM</h3>
      <Result error={error} data={token} emptyText="Aun sin token" />
      <p>Copia el token y usalo en Firebase Console &gt; Messaging &gt; Enviar mensaje de prueba.</p>

      <h3>Mensajes recibidos ({notifications.length})</h3>
      <IonList>
        {notifications.map((n, i) => (
          <IonItem key={`${n.id}-${i}`}>
            <IonLabel className="ion-text-wrap">
              <h2>{n.title ?? '(sin titulo)'}</h2>
              <p>{n.body}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </SensorPage>
  );
}

export default PushNotificationsPage;
