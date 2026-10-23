import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useAuth } from '../hooks/useAuth';
import SetupNotice from '../components/SetupNotice';

function Login() {
  const { login } = useAuth();
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Escribe tu email y password');
      return;
    }
    setBusy(true);
    const message = await login(email.trim(), password);
    setBusy(false);
    if (message) setError(message);
    else router.push('/home', 'root');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar sesion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <SetupNotice />
        <IonItem>
          <IonInput
            label="Email"
            labelPlacement="floating"
            type="email"
            value={email}
            onIonInput={(e) => {
              setEmail(e.detail.value ?? '');
              setError(null);
            }}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Password"
            labelPlacement="floating"
            type="password"
            value={password}
            onIonInput={(e) => {
              setPassword(e.detail.value ?? '');
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p className="ion-padding-start">{error}</p>
          </IonText>
        )}

        <IonButton expand="block" className="ion-margin-top" disabled={busy} onClick={handleLogin}>
          {busy ? <IonSpinner name="dots" /> : 'Entrar'}
        </IonButton>
        <IonButton expand="block" fill="clear" routerLink="/register" routerDirection="forward">
          No tengo cuenta: registrarme
        </IonButton>

      </IonContent>
    </IonPage>
  );
}

export default Login;
