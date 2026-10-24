import { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
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

function Register() {
  const { register } = useAuth();
  const router = useIonRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setBusy(true);
    const message = await register(name.trim(), email.trim(), password);
    setBusy(false);
    // Al crear la cuenta Firebase inicia sesion solo: paso directo a las misiones.
    if (message) setError(message);
    else router.push('/tabs/missions', 'root');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Crear cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <SetupNotice />
        {/* Pido el nombre porque es lo que se ve en el ranking (no el correo). */}
        <IonItem>
          <IonInput
            label="Nombre"
            labelPlacement="floating"
            value={name}
            onIonInput={(e) => {
              setName(e.detail.value ?? '');
              setError(null);
            }}
          />
        </IonItem>
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
            label="Contraseña (mín. 6)"
            labelPlacement="floating"
            type="password"
            value={password}
            onIonInput={(e) => {
              setPassword(e.detail.value ?? '');
              setError(null);
            }}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Repite la contraseña"
            labelPlacement="floating"
            type="password"
            value={confirm}
            onIonInput={(e) => {
              setConfirm(e.detail.value ?? '');
              setError(null);
            }}
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p className="ion-padding-start">{error}</p>
          </IonText>
        )}

        <IonButton expand="block" className="ion-margin-top" disabled={busy} onClick={handleRegister}>
          {busy ? <IonSpinner name="dots" /> : 'Registrarme'}
        </IonButton>

      </IonContent>
    </IonPage>
  );
}

export default Register;
