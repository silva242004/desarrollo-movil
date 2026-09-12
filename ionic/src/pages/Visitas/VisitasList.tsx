import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react'

import VisitaItem from '../../components/VisitaItem'
import type { Visita } from '../../data/mockData'
import { getVisitas } from '../../utils/storage'

// Tab "Visitas": muestra las visitas del día tomadas de localStorage.
const VisitasList: React.FC = () => {
  const navigate = useNavigate()
  const [visitas, setVisitas] = useState<Visita[]>([])

  // Como IonRouterOutlet mantiene la página montada, recargamos los datos
  // cada vez que se vuelve a entrar a esta pestaña (por ejemplo, al volver
  // del detalle después de cambiar un estado).
  useIonViewWillEnter(() => {
    setVisitas(getVisitas())
  })

  const irADetalle = (id: string) => {
    navigate(`/tabs/visitas/${id}`)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {visitas.map((visita) => (
            <VisitaItem key={visita.id} visita={visita} onClick={irADetalle} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default VisitasList
