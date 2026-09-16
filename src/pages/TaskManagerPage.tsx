import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import type { Task } from '../types';

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Repasar componentes de Ionic', completed: false },
  { id: 2, title: 'Terminar el Challenge 03', completed: false },
  { id: 3, title: 'Revisar routing para la Practice 02', completed: true },
];

// Parent component: owns the tasks state and effects, and passes
// callbacks down to TaskForm / TaskList / TaskItem.
function TaskManagerPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(INITIAL_TASKS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const addTask = (title: string) => {
    setTasks((prev) => [...prev, { id: Date.now(), title, completed: false }]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <TaskForm onAdd={addTask} />
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="dots" />
          </div>
        ) : (
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        )}
      </IonContent>
    </IonPage>
  );
}

export default TaskManagerPage;
