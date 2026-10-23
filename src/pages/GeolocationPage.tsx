import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import Result from '../components/Result';
import { useGeolocation } from '../hooks/useGeolocation';

function GeolocationPage() {
  const { position, error, watching, getCurrent, startWatching, stopWatching } = useGeolocation();

  return (
    <SensorPage title="Geolocation" plugin="@capacitor/geolocation">
      <IonButton expand="block" className="ion-margin-top" onClick={getCurrent}>
        Obtener posicion actual
      </IonButton>
      {watching ? (
        <IonButton expand="block" color="danger" onClick={stopWatching}>
          Detener seguimiento
        </IonButton>
      ) : (
        <IonButton expand="block" color="secondary" onClick={startWatching}>
          Iniciar seguimiento
        </IonButton>
      )}
      <Result
        error={error}
        data={
          position && {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: new Date(position.timestamp).toLocaleTimeString(),
          }
        }
      />
    </SensorPage>
  );
}

export default GeolocationPage;
