import { useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonIcon, IonImg, IonNote, IonSpinner, IonText } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { useAuth } from '../../hooks/useAuth';
import { useCamera } from '../../hooks/useCamera';
import { useFilesystem } from '../../hooks/useFilesystem';
import type { MissionProps } from './types';

// Mision 1: tomar una foto y guardarla en el dispositivo. Se completa justo
// despues de guardar el archivo, no al tomar la foto.
function EvidenceMission({ onComplete }: MissionProps) {
  const { user } = useAuth();
  const camera = useCamera();
  const fs = useFilesystem();
  const [busy, setBusy] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    setBusy(true);
    const base64 = await camera.takePhoto();
    if (!base64) {
      setBusy(false);
      return;
    }
    const name = `mision1_${user?.uid ?? 'anonimo'}_${Date.now()}.jpeg`;
    const uri = await fs.writeBase64(name, base64);
    if (!uri) {
      setBusy(false);
      return;
    }
    // La miniatura la leo de vuelta desde el archivo guardado (no de la
    // memoria) para que se vea que la foto si quedo en el dispositivo.
    const saved = await fs.readBase64(name);
    setThumbnail(`data:image/jpeg;base64,${saved ?? base64}`);
    setFileName(name);
    setBusy(false);
    onComplete();
  };

  const error = camera.error ?? fs.error;

  return (
    <>
      {!fileName && (
        <IonButton expand="block" disabled={busy} onClick={handleTakePhoto}>
          {busy ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={cameraOutline} />
              Tomar foto
            </>
          )}
        </IonButton>
      )}

      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}

      {thumbnail && (
        <IonCard>
          {/* Alto fijo y no maxHeight: el img interno de IonImg toma el 100%
              del alto del host, y con maxHeight se desbordaba encima del texto. */}
          <IonImg src={thumbnail} alt="Foto de evidencia" style={{ height: 240, objectFit: 'cover' }} />
          <IonCardContent>
            <IonNote style={{ wordBreak: 'break-all' }}>Guardada como {fileName}</IonNote>
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
}

export default EvidenceMission;
