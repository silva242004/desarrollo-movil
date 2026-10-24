import { useEffect, useState } from 'react';
import { DISTANCE_THRESHOLD_M, MAX_ACCURACY_M } from '../config/missions';
import { haversineMeters, type LatLng } from '../utils/geo';
import { useGeolocation } from './useGeolocation';

// Hook de la mision 2 (construido sobre useGeolocation del challenge 07).
// Que hace: guarda la posicion de origen con getCurrentPosition (alta
//   precision), sigue al usuario con watchPosition y calcula la distancia
//   con Haversine. Descarta lecturas con precision peor a MAX_ACCURACY_M y
//   corta el seguimiento al pasar DISTANCE_THRESHOLD_M.
// Que devuelve: { origin, distance, accuracy, discarded, reached, starting,
//   notice, error, watching, start, stop }.
// Plugin: @capacitor/geolocation (a traves de useGeolocation, que tambien
//   limpia el watch al salir de la pagina).
export function useDistanceTracker() {
  const geo = useGeolocation();
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [distance, setDistance] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [discarded, setDiscarded] = useState(0);
  const [reached, setReached] = useState(false);
  const [starting, setStarting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Regla para cada lectura: si la precision es mala
  // la descarto; si no, calculo la distancia y reviso si ya paso el umbral.
  const evaluate = (from: LatLng, point: LatLng, pointAccuracy: number) => {
    setAccuracy(pointAccuracy);
    if (pointAccuracy > MAX_ACCURACY_M) {
      setDiscarded((n) => n + 1);
      return;
    }
    const meters = haversineMeters(from, point);
    setDistance(meters);
    if (meters > DISTANCE_THRESHOLD_M) {
      setReached(true);
      // Ya no necesito el GPS: lo apago para no gastar bateria.
      geo.stopWatching();
    }
  };

  // Cada lectura nueva del watch pasa por evaluate.
  useEffect(() => {
    if (!origin || reached || !geo.watching || !geo.position) return;
    const { latitude, longitude, accuracy: acc } = geo.position.coords;
    evaluate(origin, { lat: latitude, lng: longitude }, acc);
    // evaluate cambia en cada render; solo me interesa reaccionar a lecturas nuevas.
  }, [geo.position, geo.watching, origin, reached]);

  const start = async () => {
    setStarting(true);
    setNotice(null);
    setDistance(0);
    setDiscarded(0);
    setReached(false);
    const current = await geo.getCurrent();
    if (!current) {
      // El error (permiso denegado, GPS apagado...) ya queda en geo.error.
      setStarting(false);
      return;
    }
    const acc = current.coords.accuracy;
    setAccuracy(acc);
    // El origen tambien tiene que ser confiable: si la primera lectura es
    // mala, toda la distancia quedaria corrida.
    if (acc > MAX_ACCURACY_M) {
      setNotice(
        `La precision del GPS es de ${Math.round(acc)} m y necesito ${MAX_ACCURACY_M} m o menos. ` +
          'Sal a un lugar abierto, espera unos segundos e intenta de nuevo.',
      );
      setStarting(false);
      return;
    }
    setOrigin({ lat: current.coords.latitude, lng: current.coords.longitude });
    await geo.startWatching();
    setStarting(false);
  };

  const stop = async () => {
    await geo.stopWatching();
  };

  return {
    origin,
    distance,
    accuracy,
    discarded,
    reached,
    starting,
    notice,
    error: geo.error,
    watching: geo.watching,
    start,
    stop,
  };
}
