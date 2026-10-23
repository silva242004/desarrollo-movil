import { useEffect, useState } from 'react';
import {
  get,
  onValue,
  push,
  ref,
  remove as fbRemove,
  update as fbUpdate,
} from 'firebase/database';
import { rtdb } from '../firebase/config';

// Custom hook (Clase 06): CRUD para una ruta de Realtime Database.
// La diferencia con Firestore: aqui la lista se actualiza sola. onValue
// deja un "oyente" abierto y se vuelve a ejecutar cada vez que cambian los
// datos (incluso si los cambia otro dispositivo), por eso no hace falta
// llamar a getAll ni refrescar despues de escribir.
export function useRealTimeCollection<T extends object>(path: string | null) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    const unsubscribe = onValue(
      ref(rtdb, path),
      (snapshot) => {
        const value = snapshot.val() as Record<string, T> | null;
        setItems(value ? Object.entries(value).map(([id, data]) => ({ id, ...data })) : []);
        setError(null);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
    // onValue devuelve la funcion para cerrar el oyente: se llama al
    // desmontar el componente para no dejar conexiones abiertas.
    return unsubscribe;
  }, [path]);

  // getAll: una lectura puntual (snapshot actual), sin dejar oyente.
  const getAll = async () => {
    if (!path) return [];
    const snapshot = await get(ref(rtdb, path));
    const value = snapshot.val() as Record<string, T> | null;
    return value ? Object.entries(value).map(([id, data]) => ({ id, ...data })) : [];
  };

  const add = async (data: T) => {
    if (!path) return;
    await push(ref(rtdb, path), data);
  };

  const update = async (id: string, data: Partial<T>) => {
    if (!path) return;
    await fbUpdate(ref(rtdb, `${path}/${id}`), data);
  };

  const remove = async (id: string) => {
    if (!path) return;
    await fbRemove(ref(rtdb, `${path}/${id}`));
  };

  return { items, loading, error, getAll, add, update, remove };
}
