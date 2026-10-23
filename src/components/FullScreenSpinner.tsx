import { IonContent, IonPage, IonSpinner } from '@ionic/react';

// Se muestra mientras Firebase confirma si ya habia una sesion iniciada.
function FullScreenSpinner() {
  return (
    <IonPage>
      <IonContent className="ion-text-center ion-padding">
        <IonSpinner name="crescent" style={{ marginTop: '40vh' }} />
      </IonContent>
    </IonPage>
  );
}

export default FullScreenSpinner;
