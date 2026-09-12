import { Navigate, Route } from 'react-router-dom'
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { calendarOutline, peopleOutline, personCircleOutline } from 'ionicons/icons'

import VisitasList from './Visitas/VisitasList'
import VisitaDetalle from './Visitas/VisitaDetalle'
import Pacientes from './Pacientes/Pacientes'
import Perfil from './Perfil/Perfil'

// Layout con IonTabs: Visitas, Pacientes y Perfil, tal como pide el enunciado.
const TabsLayout: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/tabs/visitas" element={<VisitasList />} />
      <Route path="/tabs/visitas/:id" element={<VisitaDetalle />} />
      <Route path="/tabs/pacientes" element={<Pacientes />} />
      <Route path="/tabs/perfil" element={<Perfil />} />
      <Route path="/tabs" element={<Navigate to="/tabs/visitas" replace />} />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="visitas" href="/tabs/visitas">
        <IonIcon icon={calendarOutline} />
        <IonLabel>Visitas</IonLabel>
      </IonTabButton>
      <IonTabButton tab="pacientes" href="/tabs/pacientes">
        <IonIcon icon={peopleOutline} />
        <IonLabel>Pacientes</IonLabel>
      </IonTabButton>
      <IonTabButton tab="perfil" href="/tabs/perfil">
        <IonIcon icon={personCircleOutline} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
)

export default TabsLayout
