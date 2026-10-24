import { useCallback, useState, type ComponentType } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useMissions } from '../hooks/useMissions';
import EvidenceMission from './missions/EvidenceMission';
import type { MissionProps } from './missions/types';

// Que componente juega cada mision.
const MISSION_COMPONENTS: Partial<Record<number, ComponentType<MissionProps>>> = {
  1: EvidenceMission,
};

// Contenido de una mision. Va aparte con key={id} para que el estado (foto,
// GPS, cuenta) arranque de cero si se cambia de una mision a otra.
function MissionBody({ id }: { id: number }) {
  const router = useIonRouter();
  const { getMission, completeMission } = useMissions();
  const mission = getMission(id);
  // Recuerdo si la complete en esta visita para seguir mostrando el
  // resultado (miniatura, distancia...) aunque el estado ya diga completada.
  const [completedHere, setCompletedHere] = useState(false);

  const handleComplete = useCallback(() => {
    setCompletedHere(true);
    completeMission(id);
  }, [completeMission, id]);

  if (!mission) {
    return (
      <IonText color="danger">
        <p>Esta mision no existe.</p>
      </IonText>
    );
  }
  // Si alguien llega por URL a una bloqueada o ya completada, no la dejo jugar.
  if (mission.status === 'locked' || (mission.status === 'completed' && !completedHere)) {
    return (
      <IonText color="medium">
        <p>{mission.status === 'locked' ? 'Esta mision sigue bloqueada.' : 'Ya completaste esta mision.'}</p>
      </IonText>
    );
  }

  const Game = MISSION_COMPONENTS[id];
  if (!Game) {
    return (
      <IonText color="medium">
        <p>Esta mision todavia no esta disponible.</p>
      </IonText>
    );
  }
  return (
    <>
      <p>{mission.description}</p>
      <IonNote>{mission.points} puntos</IonNote>
      <div className="ion-margin-top">
        <Game onComplete={handleComplete} />
      </div>
      {completedHere && (
        <IonCard color="success">
          <IonCardHeader>
            <IonCardTitle>Mision completada: +{mission.points} puntos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" color="light" onClick={() => router.push('/tabs/missions', 'back')}>
              Volver a las misiones
            </IonButton>
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
}

function MissionPage() {
  const { id } = useParams();
  const { getMission } = useMissions();
  const missionId = Number(id);
  const mission = getMission(missionId);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/missions" />
          </IonButtons>
          <IonTitle>{mission ? `${mission.id}. ${mission.title}` : 'Mision'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <MissionBody key={missionId} id={missionId} />
      </IonContent>
    </IonPage>
  );
}

export default MissionPage;
