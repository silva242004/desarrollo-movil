import { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import Result from '../components/Result';
import { useFilesystem } from '../hooks/useFilesystem';

function FilesystemPage() {
  const { files, error, writeFile, readFile, deleteFile } = useFilesystem();
  const [name, setName] = useState('nota.txt');
  const [text, setText] = useState('');
  const [content, setContent] = useState<{ archivo: string; contenido: string } | null>(null);

  const handleWrite = async () => {
    if (!name.trim()) return;
    if (await writeFile(name.trim(), text)) setText('');
  };

  const handleRead = async (file: string) => {
    const data = await readFile(file);
    if (data !== null) setContent({ archivo: file, contenido: data });
  };

  return (
    <SensorPage title="Filesystem" plugin="@capacitor/filesystem">
      <IonItem>
        <IonInput
          label="Nombre del archivo"
          labelPlacement="floating"
          value={name}
          onIonInput={(e) => setName(e.detail.value ?? '')}
        />
      </IonItem>
      <IonItem>
        <IonTextarea
          label="Contenido"
          labelPlacement="floating"
          rows={3}
          value={text}
          onIonInput={(e) => setText(e.detail.value ?? '')}
        />
      </IonItem>
      <IonButton expand="block" className="ion-margin-top" onClick={handleWrite}>
        Guardar archivo
      </IonButton>

      <h3>Archivos</h3>
      {files.length === 0 ? (
        <p>No hay archivos.</p>
      ) : (
        <IonList>
          {files.map((f) => (
            <IonItem key={f} button detail={false} onClick={() => handleRead(f)}>
              <IonLabel>{f}</IonLabel>
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                aria-label={`Eliminar ${f}`}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(f);
                  if (content?.archivo === f) setContent(null);
                }}
              >
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}

      <Result error={error} data={content} emptyText="Toca un archivo para leerlo" />
    </SensorPage>
  );
}

export default FilesystemPage;
