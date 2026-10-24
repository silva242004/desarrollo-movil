import { useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
} from '@ionic/react';
import { refreshOutline, trophyOutline } from 'ionicons/icons';
import AppHeader from '../components/AppHeader';
import SyncStatusChip from '../components/SyncStatusChip';
import { useMissions } from '../hooks/useMissions';

// Resumen final: puntos, misiones completadas, estado general y reinicio.
// Como en Home, todo sale del contexto; aqui solo se pinta.
function Results() {
  const { missions, points, totalPoints, completedCount, totalMissions, isFinished, syncStatus, reset } =
    useMissions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const completed = missions.filter((m) => m.status === 'completed');

  return (
    <IonPage>
      <AppHeader title="Resultados" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Puntos totales</IonCardSubtitle>
            <IonCardTitle>
              {points} / {totalPoints}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonChip color={isFinished ? 'success' : 'warning'}>
              {isFinished && <IonIcon icon={trophyOutline} />}
              <IonLabel>{isFinished ? '¡Completado!' : 'En progreso'}</IonLabel>
            </IonChip>
            <p>
              {completedCount} / {totalMissions} misiones completadas
            </p>
            <SyncStatusChip status={syncStatus} />
          </IonCardContent>
        </IonCard>

        <IonList inset>
          <IonListHeader>
            <IonLabel>Misiones completadas</IonLabel>
          </IonListHeader>
          {completed.length === 0 ? (
            <IonItem>
              <IonLabel color="medium">Aun no completas ninguna mision.</IonLabel>
            </IonItem>
          ) : (
            completed.map((mission) => (
              <IonItem key={mission.id}>
                <IonLabel>
                  {mission.id}. {mission.title}
                </IonLabel>
                <IonNote slot="end">+{mission.points}</IonNote>
              </IonItem>
            ))
          )}
        </IonList>

        <IonButton expand="block" color="danger" fill="outline" onClick={() => setConfirmOpen(true)}>
          <IonIcon slot="start" icon={refreshOutline} />
          Reiniciar progreso
        </IonButton>

        {/* Pido confirmacion porque el reinicio tambien borra los puntos en
            Firebase (el contexto sube el estado vacio igual que cualquier cambio). */}
        <IonAlert
          isOpen={confirmOpen}
          onDidDismiss={() => setConfirmOpen(false)}
          header="Reiniciar progreso"
          message="Vas a perder tus puntos y las misiones volveran a empezar desde la 1. ¿Continuar?"
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Reiniciar', role: 'destructive', handler: reset },
          ]}
        />
      </IonContent>
    </IonPage>
  );
}

export default Results;
