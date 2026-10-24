import { useEffect, useRef, useState } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';
import { errorMessage } from './errorMessage';

export interface Xyz {
  x: number;
  y: number;
  z: number;
}
export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

// Hook de movimiento (reutilizado del challenge 07, sin cambios).
// Que hace: escucha el acelerometro ("accel") y la orientacion; addListener
//   devuelve un handle y lo quito al salir de la pagina o al desmontar.
// Que devuelve: { accel, orientation, listening, error, start, stop };
//   accel es accelerationIncludingGravity (m/s²).
// Plugin: @capacitor/motion.
export function useAccelerometer() {
  const [accel, setAccel] = useState<Xyz | null>(null);
  const [orientation, setOrientation] = useState<Orientation | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handles = useRef<PluginListenerHandle[]>([]);

  const stop = async () => {
    await Promise.all(handles.current.map((h) => h.remove()));
    handles.current = [];
    setListening(false);
  };

  const start = async () => {
    if (handles.current.length > 0) return;
    try {
      const accelHandle = await Motion.addListener('accel', (event) => {
        const a = event.accelerationIncludingGravity;
        setAccel({ x: a.x, y: a.y, z: a.z });
      });
      const orientationHandle = await Motion.addListener('orientation', (event) => {
        setOrientation({ alpha: event.alpha, beta: event.beta, gamma: event.gamma });
      });
      handles.current = [accelHandle, orientationHandle];
      setListening(true);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  // Ionic deja montada la pagina oculta al volver atras: se detiene al salir.
  useIonViewWillLeave(() => {
    stop();
  });
  useEffect(
    () => () => {
      handles.current.forEach((h) => h.remove());
      handles.current = [];
    },
    [],
  );

  return { accel, orientation, listening, error, start, stop };
}
