import { IonButton } from '@ionic/react';
import { ImpactStyle, NotificationType } from '@capacitor/haptics';
import SensorPage from '../components/SensorPage';
import { useHaptics } from '../hooks/useHaptics';

function HapticsPage() {
  const haptics = useHaptics();

  return (
    <SensorPage title="Haptics" plugin="@capacitor/haptics">
      <h3>Impacto</h3>
      <IonButton onClick={() => haptics.impact(ImpactStyle.Light)}>Ligero</IonButton>
      <IonButton onClick={() => haptics.impact(ImpactStyle.Medium)}>Medio</IonButton>
      <IonButton onClick={() => haptics.impact(ImpactStyle.Heavy)}>Fuerte</IonButton>

      <h3>Notificacion</h3>
      <IonButton color="success" onClick={() => haptics.notification(NotificationType.Success)}>
        Exito
      </IonButton>
      <IonButton color="warning" onClick={() => haptics.notification(NotificationType.Warning)}>
        Aviso
      </IonButton>
      <IonButton color="danger" onClick={() => haptics.notification(NotificationType.Error)}>
        Error
      </IonButton>

      <h3>Otros</h3>
      <IonButton color="secondary" onClick={() => haptics.vibrate(800)}>
        Vibrar 800 ms
      </IonButton>
      <IonButton color="secondary" onClick={haptics.selection}>
        Seleccion
      </IonButton>
    </SensorPage>
  );
}

export default HapticsPage;
