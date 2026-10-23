import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { addOutline, logOutOutline } from 'ionicons/icons';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';

function TasksList() {
  const { user, logout } = useAuth();
  const { tasks, toggleTask, deleteTask } = useTasks();
  const router = useIonRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis tareas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonNote>Sesion: {user?.email}</IonNote>
        {tasks.length === 0 ? (
          <p className="ion-text-center ion-padding">No tienes tareas. Toca + para crear una.</p>
        ) : (
          <IonList>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </IonList>
        )}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/tasks/new" routerDirection="forward">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default TasksList;
