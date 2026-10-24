import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, EncodingType } from '@capacitor/camera';
import { errorMessage } from './errorMessage';

// Hook de camara (basado en el del challenge 07).
// Que hace: pide permiso de camara y abre la camara para tomar una foto.
// Que devuelve: { error, takePhoto }; takePhoto devuelve la foto en base64
//   (jpeg) lista para guardarla con Filesystem, o null si se cancelo/fallo.
// Plugin: @capacitor/camera.
// Cambios frente al challenge 07:
//  - Quite la galeria: la mision 1 pide evidencia tomada en el momento.
//  - Cambie getPhoto (deprecado desde @capacitor/camera 8.1) por takePhoto,
//    que solo abre la camara.
//  - Devuelvo base64 en vez de guardar un DataUrl en el estado, porque la
//    mision necesita escribir el archivo en el dispositivo.
export function useCamera() {
  const [error, setError] = useState<string | null>(null);

  // En el telefono pido el permiso yo mismo para poder mostrar un mensaje
  // claro si lo niegan; en el navegador lo pide el propio navegador.
  const ensurePermission = async () => {
    if (!Capacitor.isNativePlatform()) return;
    const status = await Camera.requestPermissions({ permissions: ['camera'] });
    if (status.camera !== 'granted' && status.camera !== 'limited') {
      throw new Error('Permiso de camara denegado. Activalo en Ajustes > Apps > Misiones > Permisos.');
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      await ensurePermission();
      const result = await Camera.takePhoto({ quality: 80, encodingType: EncodingType.JPEG });
      if (!result.webPath) throw new Error('La camara no devolvio la foto');
      setError(null);
      return await webPathToBase64(result.webPath);
    } catch (e) {
      const message = errorMessage(e);
      // Cancelar la camara no es un error real.
      if (!/cancel/i.test(message)) setError(message);
      return null;
    }
  };

  return { error, takePhoto };
}

// webPath sirve igual en el telefono y en el navegador, asi que leo la foto
// desde ahi y la paso a base64 (sin el prefijo "data:image/jpeg;base64,").
async function webPathToBase64(webPath: string): Promise<string> {
  const blob = await (await fetch(webPath)).blob();
  return blobToBase64(blob);
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.readAsDataURL(blob);
  });
}
