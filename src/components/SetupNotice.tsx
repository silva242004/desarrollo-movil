import { IonNote } from '@ionic/react';
import { isFirebaseConfigured } from '../firebase/config';

// Aviso visible solo cuando falta el archivo .env con la config de Firebase.
function SetupNotice() {
  if (isFirebaseConfigured) return null;
  return (
    <IonNote color="warning" className="ion-padding-vertical" style={{ display: 'block' }}>
      Firebase no esta configurado: copia <b>.env.example</b> como <b>.env</b> y pega tus
      claves (ver README).
    </IonNote>
  );
}

export default SetupNotice;
