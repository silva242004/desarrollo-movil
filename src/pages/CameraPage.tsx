import { IonButton, IonImg, IonText } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useCamera } from '../hooks/useCamera';

function CameraPage() {
  const { photo, error, takePhoto, pickFromGallery } = useCamera();

  return (
    <SensorPage title="Camera" plugin="@capacitor/camera">
      <IonButton expand="block" className="ion-margin-top" onClick={takePhoto}>
        Tomar foto
      </IonButton>
      <IonButton expand="block" color="secondary" onClick={pickFromGallery}>
        Elegir de la galeria
      </IonButton>
      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}
      {photo ? (
        <IonImg src={photo} alt="Foto tomada" />
      ) : (
        <IonText color="medium">
          <p>Todavia no hay foto.</p>
        </IonText>
      )}
    </SensorPage>
  );
}

export default CameraPage;
