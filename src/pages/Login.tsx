import { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { setLoggedIn } from '../utils/auth';

const VALID_EMAIL = 'user@mail.com';
const VALID_PASSWORD = '123';

function Login() {
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = () => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setLoggedIn();
      router.push('/list', 'forward');
    } else {
      setShowError(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Email"
            labelPlacement="floating"
            type="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Password"
            labelPlacement="floating"
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
          />
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleLogin}>
          Login
        </IonButton>

        <IonToast
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          message="Email o password incorrectos"
          duration={2000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
}

export default Login;
