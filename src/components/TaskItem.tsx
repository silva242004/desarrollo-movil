import { IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import type { Task } from '../types';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// Una fila de la lista: el checkbox marca como completada, tocar el texto
// abre el detalle y el tacho elimina.
function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <IonItem detail routerLink={`/tasks/${task.id}`}>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onClick={(e) => e.stopPropagation()}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        <h2>{task.title}</h2>
        {task.description && <p>{task.description}</p>}
      </IonLabel>
      <IonButton
        slot="end"
        fill="clear"
        color="danger"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        <IonIcon icon={trashOutline} slot="icon-only" />
      </IonButton>
    </IonItem>
  );
}

export default TaskItem;
