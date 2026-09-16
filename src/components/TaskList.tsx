import { IonList, IonText } from '@ionic/react';
import TaskItem from './TaskItem';
import type { Task } from '../types';

interface Props {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Child component: renders the task array with map(), like the
// contacts list in previous classes.
function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <IonText color="medium">
        <p className="ion-padding-start">No hay tareas todavia.</p>
      </IonText>
    );
  }

  return (
    <IonList>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </IonList>
  );
}

export default TaskList;
