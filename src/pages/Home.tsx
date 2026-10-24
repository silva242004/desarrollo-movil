import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonProgressBar,
  IonSpinner,
} from '@ionic/react';
import AppHeader from '../components/AppHeader';
import MissionStatusChip from '../components/MissionStatusChip';
import SyncStatusChip from '../components/SyncStatusChip';
import { useAuth } from '../hooks/useAuth';
import { useMissions } from '../hooks/useMissions';

// Pantalla principal: resumen de puntos, barra de progreso y la lista de
// misiones. No calculo nada aqui: todo viene del MissionsContext.
function Home() {
  const { user } = useAuth();
  const { missions, points, totalPoints, completedCount, totalMissions, progress, ready, syncStatus } =
    useMissions();

  return (
    <IonPage>
      <AppHeader title="Misiones" />
      <IonContent className="ion-padding">
        {!ready ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Hola, {user?.displayName ?? user?.email}</IonCardSubtitle>
                <IonCardTitle>
                  {points} / {totalPoints} puntos
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonProgressBar value={progress} color={progress === 1 ? 'success' : 'primary'} />
                <p className="ion-padding-top">
                  {completedCount} / {totalMissions} misiones ({Math.round(progress * 100)}%)
                </p>
                <SyncStatusChip status={syncStatus} />
              </IonCardContent>
            </IonCard>

            <IonList inset>
              <IonListHeader>
                <IonLabel>Tus misiones</IonLabel>
              </IonListHeader>
              {missions.map((mission) => {
                // Solo la pendiente abre su pagina; las bloqueadas y las ya
                // completadas se ven pero no se pueden tocar.
                const canOpen = mission.status === 'pending';
                return (
                  <IonItem
                    key={mission.id}
                    button={canOpen}
                    detail={canOpen}
                    disabled={mission.status === 'locked'}
                    routerLink={canOpen ? `/mission/${mission.id}` : undefined}
                  >
                    <IonLabel>
                      <h2>
                        {mission.id}. {mission.title}
                      </h2>
                      <p>{mission.description}</p>
                      <IonNote>{mission.points} puntos</IonNote>
                    </IonLabel>
                    <MissionStatusChip status={mission.status} />
                  </IonItem>
                );
              })}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Home;
