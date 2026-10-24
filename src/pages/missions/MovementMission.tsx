import { useEffect } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonProgressBar,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { navigateOutline } from 'ionicons/icons';
import { DISTANCE_THRESHOLD_M, MAX_ACCURACY_M } from '../../config/missions';
import { useDistanceTracker } from '../../hooks/useDistanceTracker';
import type { MissionProps } from './types';

// Mision 2: alejarse mas de DISTANCE_THRESHOLD_M metros del punto de inicio.
function MovementMission({ onComplete }: MissionProps) {
  const tracker = useDistanceTracker();
  const { reached } = tracker;

  // La completo una sola vez, cuando el hook avisa que paso el umbral.
  useEffect(() => {
    if (reached) onComplete();
  }, [reached, onComplete]);

  const accuracyOk = tracker.accuracy !== null && tracker.accuracy <= MAX_ACCURACY_M;

  return (
    <>
      {!tracker.watching && !reached && (
        <IonButton expand="block" disabled={tracker.starting} onClick={tracker.start}>
          {tracker.starting ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={navigateOutline} />
              {tracker.origin ? 'Reiniciar desde aqui' : 'Iniciar'}
            </>
          )}
        </IonButton>
      )}

      {tracker.notice && (
        <IonText color="warning">
          <p>{tracker.notice}</p>
        </IonText>
      )}
      {tracker.error && (
        <IonText color="danger">
          <p>{tracker.error}</p>
        </IonText>
      )}

      {tracker.origin && (
        <>
          <IonProgressBar
            className="ion-margin-vertical"
            value={Math.min(tracker.distance / DISTANCE_THRESHOLD_M, 1)}
            color={reached ? 'success' : 'primary'}
          />
          <IonList>
            <IonItem>
              <IonLabel>Distancia</IonLabel>
              <IonNote slot="end">
                {tracker.distance.toFixed(1)} / {DISTANCE_THRESHOLD_M} m
              </IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Precision</IonLabel>
              <IonNote slot="end" color={accuracyOk ? 'success' : 'warning'}>
                {tracker.accuracy === null ? '-' : `${tracker.accuracy.toFixed(1)} m`}
              </IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Lecturas descartadas (&gt; {MAX_ACCURACY_M} m)</IonLabel>
              <IonNote slot="end">{tracker.discarded}</IonNote>
            </IonItem>
          </IonList>
        </>
      )}

      {tracker.watching && !reached && (
        <>
          <p>Camina hasta superar los {DISTANCE_THRESHOLD_M} m. No cierres esta pantalla.</p>
          <IonButton expand="block" fill="outline" onClick={tracker.stop}>
            Detener
          </IonButton>
        </>
      )}
    </>
  );
}

export default MovementMission;
