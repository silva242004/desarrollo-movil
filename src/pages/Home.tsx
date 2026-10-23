import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  cameraOutline,
  folderOpenOutline,
  locationOutline,
  notificationsOutline,
  paperPlaneOutline,
  phonePortraitOutline,
  pulseOutline,
  speedometerOutline,
  wifiOutline,
} from 'ionicons/icons';

// Un boton (fila) por cada sensor. Cada uno abre su propia pagina.
const SENSORS = [
  { path: '/geolocation', title: 'Geolocation', text: 'GPS: posicion actual y seguimiento', icon: locationOutline },
  { path: '/camera', title: 'Camera', text: 'Tomar una foto o elegir de la galeria', icon: cameraOutline },
  { path: '/motion', title: 'Motion', text: 'Acelerometro y orientacion', icon: speedometerOutline },
  { path: '/device', title: 'Device', text: 'Modelo, sistema, id y bateria', icon: phonePortraitOutline },
  { path: '/haptics', title: 'Haptics', text: 'Vibracion y respuesta tactil', icon: pulseOutline },
  { path: '/filesystem', title: 'Filesystem', text: 'Escribir, leer y borrar archivos', icon: folderOpenOutline },
  { path: '/local-notifications', title: 'Local Notifications', text: 'Notificaciones programadas', icon: notificationsOutline },
  { path: '/push-notifications', title: 'Push Notifications', text: 'Token FCM y mensajes desde Firebase', icon: paperPlaneOutline },
  { path: '/network', title: 'Network', text: 'Estado de la conexion', icon: wifiOutline },
];

function Home() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sensores</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {SENSORS.map((s) => (
            <IonItem key={s.path} detail routerLink={s.path} routerDirection="forward">
              <IonIcon icon={s.icon} slot="start" />
              <IonLabel>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Home;
