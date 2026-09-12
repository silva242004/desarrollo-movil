import { useNavigate } from 'react-router-dom'
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { logOutOutline, personCircleOutline } from 'ionicons/icons'

import { cerrarSesion, getSesion } from '../../utils/storage'

// Tab "Perfil": datos fijos del médico que inició sesión + cerrar sesión.
const Perfil: React.FC = () => {
  const navigate = useNavigate()
  const sesion = getSesion()

  const handleLogout = () => {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <IonAvatar style={{ margin: '0 auto', width: '96px', height: '96px' }}>
            <IonIcon icon={personCircleOutline} style={{ width: '100%', height: '100%' }} />
          </IonAvatar>
        </div>

        <IonList inset>
          <IonItem>
            <IonLabel>Nombre</IonLabel>
            <IonLabel slot="end">{sesion?.nombre ?? '—'}</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Correo</IonLabel>
            <IonLabel slot="end">{sesion?.email ?? '—'}</IonLabel>
          </IonItem>
        </IonList>

        <IonButton expand="block" color="danger" className="ion-margin-top" onClick={handleLogout}>
          <IonIcon slot="start" icon={logOutOutline} />
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Perfil
