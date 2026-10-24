import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getCountFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FIRESTORE_COLLECTION, RANKING_LIMIT } from '../config/missions';
import { errorMessage } from './errorMessage';

export interface RankingEntry {
  uid: string;
  displayName: string;
  points: number;
  position: number;
}

// Nombre que muestro si el documento no lo tiene (cuentas de prueba viejas).
const nameOf = (data: { displayName?: string; email?: string }) =>
  data.displayName || data.email?.split('@')[0] || 'Sin nombre';

// Hook del ranking.
// Que hace: escucha en tiempo real (onSnapshot) el top de parcial2Users
//   ordenado por puntos (orderBy('points', 'desc'), limit(RANKING_LIMIT)) y
//   tambien mi propio documento. Si no estoy en el top, calculo mi posicion
//   contando cuantos usuarios tienen mas puntos que yo.
// Que devuelve: { top, me, loading, error }; me trae mi fila con posicion
//   (null si aun no tengo documento).
// Plugin: ninguno de Capacitor; usa el SDK web de Firestore.
export function useRanking(uid: string | null) {
  const [top, setTop] = useState<RankingEntry[]>([]);
  const [myData, setMyData] = useState<{ displayName: string; points: number } | null>(null);
  const [outsidePosition, setOutsidePosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Top N en tiempo real: cuando alguien suma puntos la lista se actualiza sola.
  useEffect(() => {
    const topQuery = query(collection(db, FIRESTORE_COLLECTION), orderBy('points', 'desc'), limit(RANKING_LIMIT));
    return onSnapshot(
      topQuery,
      (snapshot) => {
        setTop(
          snapshot.docs.map((d, index) => ({
            uid: d.id,
            displayName: nameOf(d.data()),
            points: Number(d.data().points) || 0,
            position: index + 1,
          })),
        );
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(errorMessage(e));
        setLoading(false);
      },
    );
  }, []);

  // Mi documento, tambien en tiempo real, para saber mis puntos aunque no
  // salga en el top.
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, FIRESTORE_COLLECTION, uid),
      (snapshot) => {
        const data = snapshot.data();
        setMyData(data ? { displayName: nameOf(data), points: Number(data.points) || 0 } : null);
      },
      (e) => setError(errorMessage(e)),
    );
  }, [uid]);

  const inTop = top.some((entry) => entry.uid === uid);

  // Mi posicion fuera del top = usuarios con mas puntos que yo + 1. La
  // recalculo cada vez que cambia el top o mis puntos. Es un conteo en el
  // servidor (no descarga los documentos).
  useEffect(() => {
    if (!uid || !myData || inTop) {
      setOutsidePosition(null);
      return;
    }
    let active = true;
    const higher = query(collection(db, FIRESTORE_COLLECTION), where('points', '>', myData.points));
    getCountFromServer(higher)
      .then((result) => {
        if (active) setOutsidePosition(result.data().count + 1);
      })
      .catch(() => {
        if (active) setOutsidePosition(null);
      });
    return () => {
      active = false;
    };
  }, [uid, myData, inTop, top]);

  const me: RankingEntry | null = inTop
    ? (top.find((entry) => entry.uid === uid) ?? null)
    : myData && uid
      ? { uid, displayName: myData.displayName, points: myData.points, position: outsidePosition ?? 0 }
      : null;

  return { top, me, inTop, loading, error };
}
