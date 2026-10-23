import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
  type WhereFilterOp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Filtros como en la clase: [["uid", "==", "abc"], ["role", "==", "Admin"]]
export type Filter = [field: string, op: WhereFilterOp, value: unknown];

// Custom hook (Clase 06): CRUD basico para cualquier coleccion de Firestore.
//  - getAll: trae los documentos (con filtros opcionales)
//  - add / update / remove: escriben y luego refrescan la lista
// Firestore genera el id de cada documento; hay que usar ese id para
// update() y remove().
export function useCollection<T extends DocumentData>(name: string, filters: Filter[] = []) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Los filtros llegan como array nuevo en cada render: se comparan como
  // texto para no volver a consultar en bucle.
  const filtersKey = JSON.stringify(filters);

  const getAll = useCallback(
    async (extra?: Filter[]) => {
      const active = extra ?? (JSON.parse(filtersKey) as Filter[]);
      const q = query(collection(db, name), ...active.map(([f, op, v]) => where(f, op, v)));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
    },
    [name, filtersKey],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getAll());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar');
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (data: T) => {
    await addDoc(collection(db, name), data);
    await refresh();
  };

  const update = async (id: string, data: Partial<T>) => {
    await updateDoc(doc(db, name, id), data as DocumentData);
    await refresh();
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, name, id));
    await refresh();
  };

  return { items, loading, error, getAll, add, update, remove, refresh };
}
