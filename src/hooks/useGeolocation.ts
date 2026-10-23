import { useEffect, useRef, useState } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { errorMessage } from './errorMessage';

// @capacitor/geolocation: GPS del telefono.
//  - getCurrent: una lectura (getCurrentPosition)
//  - startWatching / stopWatching: seguimiento continuo (watchPosition)
export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const watchId = useRef<string | null>(null);

  // En el telefono hay que pedir el permiso de ubicacion; en el navegador
  // lo pide el propio navegador.
  const ensurePermission = async () => {
    if (!Capacitor.isNativePlatform()) return;
    const status = await Geolocation.requestPermissions();
    if (status.location !== 'granted') throw new Error('Permiso de ubicacion denegado');
  };

  const getCurrent = async () => {
    try {
      await ensurePermission();
      setPosition(await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 }));
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const startWatching = async () => {
    if (watchId.current) return;
    try {
      await ensurePermission();
      watchId.current = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
        if (err) setError(errorMessage(err));
        else if (pos) {
          setPosition(pos);
          setError(null);
        }
      });
      setWatching(true);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const stopWatching = async () => {
    if (!watchId.current) return;
    await Geolocation.clearWatch({ id: watchId.current });
    watchId.current = null;
    setWatching(false);
  };

  // Al salir de la pagina se cierra el seguimiento (si no, sigue gastando GPS).
  // Ionic deja montada la pagina oculta al volver atras, asi que el
  // desmontaje llega tarde: se detiene tambien en useIonViewWillLeave.
  useIonViewWillLeave(() => {
    stopWatching();
  });
  useEffect(
    () => () => {
      if (watchId.current) Geolocation.clearWatch({ id: watchId.current });
    },
    [],
  );

  return { position, error, watching, getCurrent, startWatching, stopWatching };
}
