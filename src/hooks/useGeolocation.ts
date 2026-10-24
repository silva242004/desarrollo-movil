import { useEffect, useRef, useState } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { errorMessage } from './errorMessage';

// Hook de GPS (reutilizado del challenge 07).
// Que hace: una lectura puntual (getCurrent) o seguimiento continuo
//   (startWatching / stopWatching), pidiendo permiso en el telefono.
// Que devuelve: { position, error, watching, getCurrent, startWatching,
//   stopWatching }.
// Plugin: @capacitor/geolocation.
// Cambio frente al challenge 07: getCurrent ahora tambien devuelve la
// posicion (antes solo la dejaba en el estado), porque la mision 2 necesita
// guardarla como punto de origen en el momento.
export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const watchId = useRef<string | null>(null);

  // En el telefono hay que pedir el permiso de ubicacion; en el navegador
  // lo pide el propio navegador.
  const ensurePermission = async () => {
    if (!Capacitor.isNativePlatform()) return;
    // Con el GPS apagado Android lanza "Location services are not enabled"
    // antes de llegar al permiso; lo traduzco a algo que el usuario entienda.
    let status;
    try {
      status = await Geolocation.requestPermissions();
    } catch (e) {
      if (/not enabled|disabled/i.test(errorMessage(e))) {
        throw new Error('La ubicacion del telefono esta apagada. Activala desde el panel rapido e intenta de nuevo.');
      }
      throw e;
    }
    if (status.location !== 'granted') {
      throw new Error('Permiso de ubicacion denegado. Activalo en Ajustes > Apps > Misiones > Permisos.');
    }
  };

  const getCurrent = async (): Promise<Position | null> => {
    try {
      await ensurePermission();
      const current = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
      setPosition(current);
      setError(null);
      return current;
    } catch (e) {
      setError(errorMessage(e));
      return null;
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
