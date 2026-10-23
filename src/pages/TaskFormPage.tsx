import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useTasks } from '../hooks/useTasks';

// Una sola pagina para "Agregar" (/tasks/new) y "Editar" (/tasks/:id/edit):
// si la ruta trae :id se cargan los datos de esa tarea.
function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const { getTask, addTask, updateTask } = useTasks();
  const router = useIonRouter();
  const editing = id ? getTask(id) : undefined;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [showError, setShowError] = useState(false);

  const isEdit = Boolean(id);

  const handleSave = () => {
    if (!title.trim()) {
      setShowError(true);
      return;
    }
    if (isEdit && id) updateTask(id, title.trim(), description.trim());
    else addTask(title.trim(), description.trim());
    router.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>{isEdit ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isEdit && !editing ? (
          <IonText color="medium">
            <p>Esta tarea ya no existe.</p>
          </IonText>
        ) : (
          <>
            <IonItem>
              <IonInput
                label="Titulo"
                labelPlacement="floating"
                value={title}
                onIonInput={(e) => {
                  setTitle(e.detail.value ?? '');
                  setShowError(false);
                }}
              />
            </IonItem>
            {showError && (
              <IonText color="danger">
                <p className="ion-padding-start">El titulo es obligatorio</p>
              </IonText>
            )}
            <IonItem>
              <IonTextarea
                label="Descripcion"
                labelPlacement="floating"
                rows={4}
                value={description}
                onIonInput={(e) => setDescription(e.detail.value ?? '')}
              />
            </IonItem>
            <IonButton expand="block" className="ion-margin-top" onClick={handleSave}>
              Guardar
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default TaskFormPage;
