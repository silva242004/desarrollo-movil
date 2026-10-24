import { useCallback, useEffect, useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { errorMessage } from './errorMessage';
import { blobToBase64 } from './useCamera';

// Hook de archivos (reutilizado del challenge 07).
// Que hace: lee, escribe, lista y borra archivos en Directory.Data (la
//   carpeta privada de la app), que no necesita permisos de almacenamiento.
// Que devuelve: { files, error, writeFile, readFile, writeBase64,
//   readBase64, deleteFile, listFiles }.
// Plugin: @capacitor/filesystem.
// Cambio frente al challenge 07: agregue writeBase64 / readBase64. El hook
// original solo escribia texto UTF-8 y la foto de la mision 1 es binaria
// (jpeg): sin "encoding" el plugin interpreta data como base64.
export function useFilesystem() {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const listFiles = useCallback(async () => {
    try {
      const result = await Filesystem.readdir({ path: '', directory: Directory.Data });
      setFiles(result.files.map((f) => f.name).sort());
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    listFiles();
  }, [listFiles]);

  const writeFile = async (name: string, text: string) => {
    try {
      await Filesystem.writeFile({
        path: name,
        data: text,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      await listFiles();
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    }
  };

  const readFile = async (name: string): Promise<string | null> => {
    try {
      const result = await Filesystem.readFile({
        path: name,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      setError(null);
      return typeof result.data === 'string' ? result.data : await result.data.text();
    } catch (e) {
      setError(errorMessage(e));
      return null;
    }
  };

  // Devuelve la uri del archivo guardado, o null si fallo.
  const writeBase64 = async (name: string, base64: string): Promise<string | null> => {
    try {
      const result = await Filesystem.writeFile({ path: name, data: base64, directory: Directory.Data });
      await listFiles();
      setError(null);
      return result.uri;
    } catch (e) {
      setError(errorMessage(e));
      return null;
    }
  };

  const readBase64 = async (name: string): Promise<string | null> => {
    try {
      const result = await Filesystem.readFile({ path: name, directory: Directory.Data });
      setError(null);
      // En el telefono llega como string base64; en el navegador puede ser Blob.
      return typeof result.data === 'string' ? result.data : await blobToBase64(result.data);
    } catch (e) {
      setError(errorMessage(e));
      return null;
    }
  };

  const deleteFile = async (name: string) => {
    try {
      await Filesystem.deleteFile({ path: name, directory: Directory.Data });
      await listFiles();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return { files, error, writeFile, readFile, writeBase64, readBase64, deleteFile, listFiles };
}
