import { Navigate, Route } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { podiumOutline, ribbonOutline, rocketOutline } from 'ionicons/icons';
import Home from './Home';
import Ranking from './Ranking';
import Results from './Results';

// Las tres pestanas que pide el enunciado. Uso el mismo patron de IonTabs
// con IonRouterOutlet anidado que use en el parcial 1.
function TabsLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/missions" element={<Home />} />
        <Route path="/tabs/ranking" element={<Ranking />} />
        <Route path="/tabs/results" element={<Results />} />
        <Route path="/tabs" element={<Navigate to="/tabs/missions" replace />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="missions" href="/tabs/missions">
          <IonIcon icon={rocketOutline} />
          <IonLabel>Misiones</IonLabel>
        </IonTabButton>
        <IonTabButton tab="ranking" href="/tabs/ranking">
          <IonIcon icon={podiumOutline} />
          <IonLabel>Ranking</IonLabel>
        </IonTabButton>
        <IonTabButton tab="results" href="/tabs/results">
          <IonIcon icon={ribbonOutline} />
          <IonLabel>Resultados</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default TabsLayout;
