import { useState } from 'react'
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react'

import type { Paciente } from '../../data/mockData'
import { getPacientes } from '../../utils/storage'

// Tab "Pacientes": directorio fijo de pacientes de la clínica.
// Es independiente de la lista de visitas del día (y de la PWA del
// ejercicio 1: las dos apps no comparten información de pacientes).
const Pacientes: React.FC = () => {
  const [pacientes] = useState<Paciente[]>(() => getPacientes())

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pacientes.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>
                <h2>
                  {p.nombre} {p.apellido}
                </h2>
                <p>CC: {p.cc}</p>
              </IonLabel>
              <IonNote slot="end">{p.telefono}</IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Pacientes
