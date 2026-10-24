import {
  IonBadge,
  IonContent,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import AppHeader from '../components/AppHeader';
import NetworkBanner from '../components/NetworkBanner';
import { RANKING_LIMIT } from '../config/missions';
import { useAuth } from '../hooks/useAuth';
import { useNetwork } from '../hooks/useNetwork';
import { useRanking, type RankingEntry } from '../hooks/useRanking';

// Una fila del ranking. La mia va resaltada para encontrarla rapido.
function RankingRow({ entry, mine }: { entry: RankingEntry; mine: boolean }) {
  return (
    <IonItem color={mine ? 'primary' : undefined}>
      <IonBadge slot="start" color={mine ? 'light' : 'medium'}>
        {entry.position > 0 ? `#${entry.position}` : '...'}
      </IonBadge>
      <IonLabel>
        <h2>
          {entry.displayName}
          {mine && ' (tu)'}
        </h2>
      </IonLabel>
      <IonNote slot="end" color={mine ? 'light' : undefined}>
        {entry.points} pts
      </IonNote>
    </IonItem>
  );
}

// Top de usuarios desde Firestore, actualizado en tiempo real.
function Ranking() {
  const { user } = useAuth();
  const { connected } = useNetwork();
  const { top, me, inTop, loading, error } = useRanking(user?.uid ?? null);

  return (
    <IonPage>
      <AppHeader title="Ranking" />
      <IonContent className="ion-padding">
        <NetworkBanner connected={connected} gated={false} />

        {loading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
          </div>
        )}
        {error && (
          <IonText color="danger">
            <p>No se pudo cargar el ranking: {error}</p>
          </IonText>
        )}

        {!loading && (
          <IonList inset>
            <IonItemDivider>Top {RANKING_LIMIT}</IonItemDivider>
            {top.length === 0 && (
              <IonItem>
                <IonLabel>Aun no hay jugadores.</IonLabel>
              </IonItem>
            )}
            {top.map((entry) => (
              <RankingRow key={entry.uid} entry={entry} mine={entry.uid === user?.uid} />
            ))}

            {/* Si no estoy en el top me muestro aparte con mi posicion. */}
            {!inTop && me && (
              <>
                <IonItemDivider>Tu posicion</IonItemDivider>
                <RankingRow entry={me} mine />
              </>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Ranking;
