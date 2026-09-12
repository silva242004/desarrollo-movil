import { IonBadge, IonItem, IonLabel, IonNote } from '@ionic/react'
import type { Visita } from '../data/mockData'
import { COLOR_ESTADO, ETIQUETA_ESTADO } from '../data/mockData'

interface Props {
  visita: Visita
  onClick: (id: string) => void
}

// Componente hijo: solo recibe la visita y avisa al padre (VisitasList) cuando
// el usuario la selecciona, tal como se vio en clase (padre -> hijo por props,
// hijo -> padre por callback).
const VisitaItem: React.FC<Props> = ({ visita, onClick }) => (
  <IonItem button onClick={() => onClick(visita.id)}>
    <IonLabel>
      <h2>{visita.paciente}</h2>
      <p>Hora: {visita.hora}</p>
    </IonLabel>
    <IonNote slot="end">
      <IonBadge color={COLOR_ESTADO[visita.estado]}>{ETIQUETA_ESTADO[visita.estado]}</IonBadge>
    </IonNote>
  </IonItem>
)

export default VisitaItem
