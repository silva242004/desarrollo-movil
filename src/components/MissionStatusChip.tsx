import { IonChip, IonIcon, IonLabel } from '@ionic/react';
import { checkmarkCircleOutline, lockClosedOutline, timeOutline } from 'ionicons/icons';
import type { MissionStatus } from '../types';

// Texto, color e icono de cada estado, en un solo lugar para que Home y
// Resultados se vean igual.
const STATUS_UI: Record<MissionStatus, { label: string; color: string; icon: string }> = {
  locked: { label: 'Bloqueada', color: 'medium', icon: lockClosedOutline },
  pending: { label: 'Pendiente', color: 'warning', icon: timeOutline },
  completed: { label: 'Completada', color: 'success', icon: checkmarkCircleOutline },
};

function MissionStatusChip({ status }: { status: MissionStatus }) {
  const ui = STATUS_UI[status];
  return (
    <IonChip color={ui.color}>
      <IonIcon icon={ui.icon} />
      <IonLabel>{ui.label}</IonLabel>
    </IonChip>
  );
}

export default MissionStatusChip;
