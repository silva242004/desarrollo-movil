import { IonCard, IonCardContent, IonText } from '@ionic/react';

interface Props {
  data?: unknown;
  error?: string | null;
  emptyText?: string;
}

// Muestra el resultado de un sensor como JSON, o el error si lo hay.
function Result({ data, error, emptyText = 'Sin datos todavia' }: Props) {
  return (
    <>
      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}
      <IonCard>
        <IonCardContent>
          {data === null || data === undefined ? (
            <IonText color="medium">{emptyText}</IonText>
          ) : (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
}

export default Result;
