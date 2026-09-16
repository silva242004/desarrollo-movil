import { useState } from 'react';
import { IonButton, IonInput, IonItem } from '@ionic/react';

interface Props {
  onAdd: (title: string) => void;
}

// Child component: captures the new task title and notifies the
// parent (TaskManagerPage) through the onAdd prop.
function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  };

  return (
    <IonItem>
      <IonInput
        label="Nueva tarea"
        labelPlacement="floating"
        placeholder="Ej: Estudiar Ionic"
        value={title}
        onIonInput={(e) => setTitle(e.detail.value ?? '')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
        }}
      />
      <IonButton slot="end" onClick={handleAdd}>
        Agregar
      </IonButton>
    </IonItem>
  );
}

export default TaskForm;
