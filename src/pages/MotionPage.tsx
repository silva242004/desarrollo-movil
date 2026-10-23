import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import Result from '../components/Result';
import { useAccelerometer } from '../hooks/useAccelerometer';

const round = (n: number) => Math.round(n * 100) / 100;

function MotionPage() {
  const { accel, orientation, listening, error, start, stop } = useAccelerometer();

  return (
    <SensorPage title="Motion" plugin="@capacitor/motion">
      {listening ? (
        <IonButton expand="block" color="danger" className="ion-margin-top" onClick={stop}>
          Detener
        </IonButton>
      ) : (
        <IonButton expand="block" className="ion-margin-top" onClick={start}>
          Iniciar sensores
        </IonButton>
      )}
      <h3>Acelerometro (m/s2)</h3>
      <Result
        error={error}
        data={accel && { x: round(accel.x), y: round(accel.y), z: round(accel.z) }}
        emptyText="Mueve el telefono despues de iniciar"
      />
      <h3>Orientacion (grados)</h3>
      <Result
        data={
          orientation && {
            alpha: round(orientation.alpha),
            beta: round(orientation.beta),
            gamma: round(orientation.gamma),
          }
        }
        emptyText="Gira el telefono despues de iniciar"
      />
    </SensorPage>
  );
}

export default MotionPage;
