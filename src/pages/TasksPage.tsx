import { useMemo, useState } from 'react';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import PageShell from '../components/PageShell';
import NetworkBanner from '../components/NetworkBanner';
import { useAuth } from '../hooks/useAuth';
import { useNetwork } from '../hooks/useNetwork';
import { useRealTimeCollection } from '../hooks/useRealTimeCollection';
import type { Task } from '../types';

type TaskData = Omit<Task, 'id'>;

// Tasks en Firebase Realtime Database, en la ruta tasks/{uid}. La lista se
// actualiza sola gracias a onValue (ver useRealTimeCollection).
function TasksPage() {
  const { user } = useAuth();
  const { connected } = useNetwork();
  const { items, loading, error, add, update, remove } = useRealTimeCollection<TaskData>(
    user ? `tasks/${user.uid}` : null,
  );

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const tasks = useMemo(() => [...items].sort((a, b) => b.createdAt - a.createdAt), [items]);

  const run = async (action: () => Promise<void>) => {
    setMessage(null);
    try {
      await action();
    } catch {
      setMessage('No se pudo completar la accion. Revisa las reglas de Realtime Database.');
    }
  };

  const handleAdd = () => {
    if (!title.trim()) {
      setMessage('Escribe el titulo de la tarea');
      return;
    }
    run(async () => {
      await add({ title: title.trim(), completed: false, createdAt: Date.now() });
      setTitle('');
    });
  };

  return (
    <PageShell title="Tasks (Realtime DB)">
      <NetworkBanner connected={connected} />

      <IonItem>
        <IonInput
          label="Nueva tarea"
          labelPlacement="floating"
          value={title}
          disabled={!connected}
          onIonInput={(e) => setTitle(e.detail.value ?? '')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && connected) handleAdd();
          }}
        />
        <IonButton slot="end" disabled={!connected} onClick={handleAdd}>
          Agregar
        </IonButton>
      </IonItem>

      {message && (
        <IonText color="danger">
          <p>{message}</p>
        </IonText>
      )}
      {error && (
        <IonText color="warning">
          <p>No se pudieron cargar las tareas: {error}</p>
        </IonText>
      )}

      {loading ? (
        <div className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="ion-text-center">No hay tareas.</p>
      ) : (
        <IonList>
          {tasks.map((t) => (
            <IonItem key={t.id}>
              <IonCheckbox
                slot="start"
                checked={t.completed}
                disabled={!connected}
                onIonChange={() => run(() => update(t.id, { completed: !t.completed }))}
              />
              <IonLabel style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                {t.title}
              </IonLabel>
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                aria-label={`Eliminar ${t.title}`}
                disabled={!connected}
                onClick={() => run(() => remove(t.id))}
              >
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
    </PageShell>
  );
}

export default TasksPage;
