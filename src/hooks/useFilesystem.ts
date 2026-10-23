import { useCallback, useEffect, useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { errorMessage } from './errorMessage';

// @capacitor/filesystem: leer y escribir archivos del telefono, con una API
// parecida a la de NodeJS. Se usa Directory.Data (la carpeta privada de la
// app) porque no necesita permisos de almacenamiento en Android.
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

  const deleteFile = async (name: string) => {
    try {
      await Filesystem.deleteFile({ path: name, directory: Directory.Data });
      await listFiles();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return { files, error, writeFile, readFile, deleteFile, listFiles };
}
