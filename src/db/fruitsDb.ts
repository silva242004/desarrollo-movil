import Dexie, { type EntityTable } from 'dexie';

export interface Fruit {
  id: number;
  name: string;
  price: number;
}

// Dexie = IndexedDB con una API comoda (base de datos local del navegador,
// funciona sin internet). Clase 06:
//   ++id  -> llave primaria autoincremental
//   &name -> indice unico (no se repiten nombres de fruta)
//   price -> indice normal (permite buscar/ordenar por precio)
export const fruitsDb = new Dexie('FrutasDB') as Dexie & {
  fruits: EntityTable<Fruit, 'id'>;
};

// En cada version se pueden agregar/quitar indices: si cambias el esquema
// hay que subir el numero de version.
fruitsDb.version(1).stores({
  fruits: '++id, &name, price',
});
