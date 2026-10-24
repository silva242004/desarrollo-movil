import { useEffect } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonNote, IonProgressBar, IonText } from '@ionic/react';
import { phonePortraitOutline } from 'ionicons/icons';
import { STILLNESS_DURATION_S, STILLNESS_THRESHOLD } from '../../config/missions';
import { useStillness } from '../../hooks/useStillness';
import type { MissionProps } from './types';

// Mision 3: dejar el telefono quieto STILLNESS_DURATION_S segundos. La
// pagina solo pinta lo que le da useStillness; la logica vive en el hook.
function StillnessMission({ onComplete }: MissionProps) {
  const stillness = useStillness();
  const { done } = stillness;

  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  const seconds = Math.ceil(stillness.secondsLeft);
  const counting = stillness.active && stillness.secondsLeft < STILLNESS_DURATION_S;

  return (
    <>
      {!stillness.active && !done && (
        <IonButton expand="block" onClick={stillness.start}>
          <IonIcon slot="start" icon={phonePortraitOutline} />
          Iniciar
        </IonButton>
      )}

      {stillness.error && (
        <IonText color="danger">
          <p>{stillness.error}</p>
        </IonText>
      )}

      {stillness.active && (
        <>
          <div className="ion-text-center ion-padding">
            <h1 style={{ fontSize: '4rem', margin: 0 }}>{seconds}</h1>
            <IonNote>{counting ? 'No muevas el telefono...' : 'Deja el telefono quieto sobre una superficie'}</IonNote>
          </div>
          <IonProgressBar value={1 - stillness.secondsLeft / STILLNESS_DURATION_S} />
          <IonList>
            <IonItem>
              <IonLabel>Variacion</IonLabel>
              <IonNote
                slot="end"
                color={stillness.variation !== null && stillness.variation > STILLNESS_THRESHOLD ? 'danger' : 'success'}
              >
                {stillness.variation === null ? 'midiendo...' : `${stillness.variation.toFixed(2)} m/s²`} (max{' '}
                {STILLNESS_THRESHOLD})
              </IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Reinicios por movimiento</IonLabel>
              <IonNote slot="end">{stillness.resets}</IonNote>
            </IonItem>
          </IonList>
          <IonNote className="ion-padding-vertical" style={{ display: 'block' }}>
            La pantalla se mantiene encendida mientras dura la mision.
          </IonNote>
          <IonButton expand="block" fill="outline" onClick={stillness.stop}>
            Detener
          </IonButton>
        </>
      )}
    </>
  );
}

export default StillnessMission;
