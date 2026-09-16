import { IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import type { Task } from '../types';

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Child component: shows one task and asks its parent to toggle or
// delete it (child -> parent communication via props/callbacks).
function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </IonLabel>
      <IonButton slot="end" fill="clear" color="danger" onClick={() => onDelete(task.id)}>
        <IonIcon icon={trashOutline} slot="icon-only" />
      </IonButton>
    </IonItem>
  );
}

export default TaskItem;
