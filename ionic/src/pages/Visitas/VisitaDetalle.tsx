import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'

import type { Visita } from '../../data/mockData'
import { COLOR_ESTADO, ETIQUETA_ESTADO, SIGUIENTE_ESTADO } from '../../data/mockData'
import { getVisitas, guardarVisitas } from '../../utils/storage'

// Detalle de una visita: permite avanzar el estado
// pendiente -> en_camino -> finalizada, persistiendo el cambio en localStorage.
const VisitaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [visita, setVisita] = useState<Visita | undefined>(undefined)

  useIonViewWillEnter(() => {
    const encontrada = getVisitas().find((v) => v.id === id)
    setVisita(encontrada)
  })

  const avanzarEstado = () => {
    if (!visita) return
    const siguiente = SIGUIENTE_ESTADO[visita.estado]
    if (!siguiente) return

    const visitas = getVisitas().map((v) => (v.id === visita.id ? { ...v, estado: siguiente } : v))
    guardarVisitas(visitas)
    setVisita({ ...visita, estado: siguiente })
  }

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/visitas" />
            </IonButtons>
            <IonTitle>Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>No se encontró la visita.</p>
        </IonContent>
      </IonPage>
    )
  }

  const siguiente = SIGUIENTE_ESTADO[visita.estado]

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/visitas" />
          </IonButtons>
          <IonTitle>Detalle de visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonLabel>Paciente</IonLabel>
            <IonLabel slot="end">{visita.paciente}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Hora</IonLabel>
            <IonLabel slot="end">{visita.hora}</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Estado</IonLabel>
            <IonBadge slot="end" color={COLOR_ESTADO[visita.estado]}>
              {ETIQUETA_ESTADO[visita.estado]}
            </IonBadge>
          </IonItem>
        </IonList>

        {siguiente ? (
          <IonButton expand="block" className="ion-margin-top" onClick={avanzarEstado}>
            Cambiar a "{ETIQUETA_ESTADO[siguiente]}"
          </IonButton>
        ) : (
          <IonButton expand="block" className="ion-margin-top" disabled>
            Visita finalizada
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  )
}

export default VisitaDetalle
