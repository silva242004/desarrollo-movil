import { useLiveQuery } from 'dexie-react-hooks';
import { fruitsDb, type Fruit } from '../db/fruitsDb';

// Custom hook (Clase 06): CRUD sobre la tabla de frutas en Dexie.
// useLiveQuery es la "nueva funcion" de esta clase: ejecuta la consulta y
// la vuelve a ejecutar sola cada vez que cambia la tabla (mismo efecto
// "tiempo real" que onValue de Firebase, pero 100% local y sin internet).
// Error propio para "ya existe esa fruta" (indice unico &name).
export class DuplicateFruitError extends Error {}

export function useDexie() {
  const fruits = useLiveQuery(() => fruitsDb.fruits.orderBy('name').toArray(), []);

  // Se revisa el nombre ANTES de escribir. Si se deja que el indice unico
  // (&name) falle, Dexie 4 + useLiveQuery lanzan un TypeError interno
  // ("Cannot read properties of null") que tumba la pantalla.
  const add = async (name: string, price: number) => {
    const exists = await fruitsDb.fruits.where('name').equals(name).count();
    if (exists > 0) throw new DuplicateFruitError();
    return fruitsDb.fruits.add({ name, price } as Fruit);
  };
  const update = (id: number, changes: Partial<Omit<Fruit, 'id'>>) =>
    fruitsDb.fruits.update(id, changes);
  const remove = (id: number) => fruitsDb.fruits.delete(id);

  return { fruits: fruits ?? [], loading: fruits === undefined, add, update, remove };
}
