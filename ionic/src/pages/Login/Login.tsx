import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react'

import { DOCTORES_FIJOS } from '../../data/mockData'
import { getSesion, guardarSesion } from '../../utils/storage'

// Login del médico. Usuarios fijos (ver src/data/mockData.ts), sin backend:
// la sesión se guarda en localStorage y se valida contra esa lista fija.
const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Si ya había una sesión guardada (recarga de página), pasamos directo a Visitas.
  useEffect(() => {
    if (getSesion()) {
      navigate('/tabs/visitas', { replace: true })
    }
  }, [navigate])

  const handleLogin = () => {
    const doctor = DOCTORES_FIJOS.find(
      (d) => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password,
    )

    if (!doctor) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    guardarSesion({ loggedIn: true, email: doctor.email, nombre: doctor.nombre })
    navigate('/tabs/visitas', { replace: true })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MediClinic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
          <img src="/icons/icon-192.png" alt="MediClinic" style={{ width: '80px', height: '80px' }} />
          <h2>Ingreso médico</h2>
          <IonText color="medium">
            <p>Consulta tus visitas del día</p>
          </IonText>
        </div>

        <IonItem>
          <IonInput
            label="Correo"
            labelPlacement="floating"
            type="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
            autocomplete="email"
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Contraseña"
            labelPlacement="floating"
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
            autocomplete="current-password"
          />
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleLogin}>
          Ingresar
        </IonButton>

        <IonToast
          isOpen={!!error}
          message={error}
          duration={2500}
          color="danger"
          position="top"
          onDidDismiss={() => setError('')}
        />
      </IonContent>
    </IonPage>
  )
}

export default Login
