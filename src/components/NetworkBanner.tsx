import { IonChip, IonIcon, IonLabel } from '@ionic/react';
import { cloudOfflineOutline, wifiOutline } from 'ionicons/icons';

interface Props {
  connected: boolean;
  // true si la pagina deshabilita sus acciones cuando no hay red.
  gated?: boolean;
}

// Muestra el estado de la conexion y, en las paginas de Firebase, avisa que
// las acciones estan deshabilitadas mientras no haya internet.
function NetworkBanner({ connected, gated = true }: Props) {
  if (connected) {
    return (
      <IonChip color="success">
        <IonIcon icon={wifiOutline} />
        <IonLabel>Con conexion</IonLabel>
      </IonChip>
    );
  }
  return (
    <IonChip color="danger">
      <IonIcon icon={cloudOfflineOutline} />
      <IonLabel>
        {gated ? 'Sin conexion: acciones deshabilitadas' : 'Sin conexion: funciona igual (datos locales)'}
      </IonLabel>
    </IonChip>
  );
}

export default NetworkBanner;
