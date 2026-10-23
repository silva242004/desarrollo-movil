import { useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useTasks } from '../hooks/useTasks';

// Dynamic routing (Clase 04): /tasks/:id -> se lee el id con useParams y
// la tarea se busca en el TasksContext.
function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { getTask, toggleTask, deleteTask } = useTasks();
  const router = useIonRouter();
  const task = id ? getTask(id) : undefined;

  const header = (title: string) => (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tasks" />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );

  if (!task) {
    return (
      <IonPage>
        {header('Tarea')}
        <IonContent className="ion-padding">
          <IonText color="medium">
            <p>Esta tarea ya no existe.</p>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  const handleDelete = () => {
    deleteTask(task.id);
    router.goBack();
  };

  return (
    <IonPage>
      {header('Detalle')}
      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonLabel className="ion-text-wrap">
            <h1>{task.title}</h1>
            <p>{task.description || 'Sin descripcion'}</p>
            <IonNote>Creada: {new Date(task.createdAt).toLocaleString()}</IonNote>
          </IonLabel>
          <IonBadge slot="end" color={task.completed ? 'success' : 'warning'}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </IonBadge>
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={() => toggleTask(task.id)}>
          {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        </IonButton>
        <IonButton expand="block" fill="outline" routerLink={`/tasks/${task.id}/edit`} routerDirection="forward">
          Editar
        </IonButton>
        <IonButton expand="block" color="danger" fill="outline" onClick={handleDelete}>
          Eliminar
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default TaskDetail;
