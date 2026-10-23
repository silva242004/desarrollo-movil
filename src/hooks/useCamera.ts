import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { errorMessage } from './errorMessage';

// @capacitor/camera: tomar una foto o elegirla de la galeria (getPhoto).
export function useCamera() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPhoto = async (source: CameraSource) => {
    try {
      const result = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });
      setPhoto(result.dataUrl ?? null);
      setError(null);
    } catch (e) {
      const message = errorMessage(e);
      // Cancelar el selector no es un error real.
      if (!/cancel/i.test(message)) setError(message);
    }
  };

  return {
    photo,
    error,
    takePhoto: () => getPhoto(CameraSource.Camera),
    pickFromGallery: () => getPhoto(CameraSource.Photos),
  };
}
