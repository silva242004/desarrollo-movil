import { IonChip, IonIcon, IonLabel, IonSpinner } from '@ionic/react';
import { cloudDoneOutline, cloudOfflineOutline, warningOutline } from 'ionicons/icons';
import type { SyncStatus } from '../hooks/useProgressSync';

// Muestra si el progreso ya esta en Firebase o solo en el telefono.
function SyncStatusChip({ status }: { status: SyncStatus }) {
  switch (status) {
    case 'syncing':
      return (
        <IonChip>
          <IonSpinner name="dots" />
          <IonLabel>Sincronizando...</IonLabel>
        </IonChip>
      );
    case 'synced':
      return (
        <IonChip color="success">
          <IonIcon icon={cloudDoneOutline} />
          <IonLabel>Guardado en Firebase</IonLabel>
        </IonChip>
      );
    case 'pending':
      return (
        <IonChip color="warning">
          <IonIcon icon={cloudOfflineOutline} />
          <IonLabel>Sin conexion: guardado en el telefono</IonLabel>
        </IonChip>
      );
    case 'error':
      return (
        <IonChip color="danger">
          <IonIcon icon={warningOutline} />
          <IonLabel>No se pudo sincronizar: guardado en el telefono</IonLabel>
        </IonChip>
      );
    default:
      return null;
  }
}

export default SyncStatusChip;
