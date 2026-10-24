import { useEffect, useRef, useState } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import {
  COMPLETE_VIBRATION_MS,
  COUNTDOWN_TICK_MS,
  STILLNESS_DURATION_S,
  STILLNESS_THRESHOLD,
  STILLNESS_WINDOW_SIZE,
} from '../config/missions';
import { useAccelerometer } from './useAccelerometer';
import { useHaptics } from './useHaptics';
import { useKeepAwake } from './useKeepAwake';

// Hook de la mision 3 (construido sobre useAccelerometer y useHaptics del
// challenge 07, mas useKeepAwake).
// Que hace: detecta que el telefono esta quieto con una ventana movil de
//   lecturas de accelerationIncludingGravity. Si la variacion de la magnitud
//   dentro de la ventana supera STILLNESS_THRESHOLD, la cuenta se reinicia.
//   Tras STILLNESS_DURATION_S quieto vibra y marca done. Mientras corre
//   mantiene la pantalla encendida.
// Que devuelve: { active, done, secondsLeft, variation, resets, error,
//   start, stop }.
// Plugins: @capacitor/motion, @capacitor/haptics y
//   @capacitor-community/keep-awake.
export function useStillness() {
  const motion = useAccelerometer();
  const haptics = useHaptics();
  const keepAwake = useKeepAwake();

  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(STILLNESS_DURATION_S);
  const [variation, setVariation] = useState<number | null>(null);
  const [resets, setResets] = useState(0);

  // Uso refs para la ventana y el inicio de la quietud: cambian con cada
  // lectura (decenas por segundo) y no necesitan redibujar la pantalla.
  const windowRef = useRef<number[]>([]);
  const stillSinceRef = useRef<number | null>(null);

  // Cada lectura del acelerometro entra a la ventana movil.
  useEffect(() => {
    if (!active || done || !motion.accel) return;
    const { x, y, z } = motion.accel;
    const readings = windowRef.current;
    readings.push(Math.sqrt(x * x + y * y + z * z));
    if (readings.length > STILLNESS_WINDOW_SIZE) readings.shift();
    // Hasta llenar la ventana no tengo datos suficientes para decidir; asi
    // tampoco cuenta si el sensor no manda nada (por ejemplo en un PC).
    if (readings.length < STILLNESS_WINDOW_SIZE) return;

    const spread = Math.max(...readings) - Math.min(...readings);
    setVariation(spread);
    if (spread > STILLNESS_THRESHOLD) {
      if (stillSinceRef.current !== null) setResets((n) => n + 1);
      stillSinceRef.current = null;
    } else if (stillSinceRef.current === null) {
      stillSinceRef.current = Date.now();
    }
  }, [motion.accel, active, done]);

  // La cuenta regresiva vive aqui con setInterval y no en la pagina, asi la
  // UI solo pinta secondsLeft. El cleanup limpia el intervalo al terminar,
  // detener o salir.
  useEffect(() => {
    if (!active || done) return;
    const id = window.setInterval(() => {
      const since = stillSinceRef.current;
      if (since === null) {
        setSecondsLeft(STILLNESS_DURATION_S);
        return;
      }
      const left = STILLNESS_DURATION_S - (Date.now() - since) / 1000;
      if (left <= 0) setDone(true);
      else setSecondsLeft(left);
    }, COUNTDOWN_TICK_MS);
    return () => window.clearInterval(id);
  }, [active, done]);

  // Al completar: vibro, apago el sensor y dejo que la pantalla se apague.
  useEffect(() => {
    if (!done) return;
    setActive(false);
    setSecondsLeft(0);
    motion.stop();
    keepAwake.disable();
    haptics.vibrate(COMPLETE_VIBRATION_MS);
    // Solo debe correr una vez, cuando done pasa a true.
  }, [done]);

  const start = async () => {
    windowRef.current = [];
    stillSinceRef.current = null;
    setDone(false);
    setResets(0);
    setVariation(null);
    setSecondsLeft(STILLNESS_DURATION_S);
    await motion.start();
    await keepAwake.enable();
    setActive(true);
  };

  const stop = async () => {
    setActive(false);
    stillSinceRef.current = null;
    setSecondsLeft(STILLNESS_DURATION_S);
    await motion.stop();
    await keepAwake.disable();
  };

  // useAccelerometer y useKeepAwake ya se limpian al salir; aqui solo
  // detengo la cuenta.
  useIonViewWillLeave(() => {
    setActive(false);
    stillSinceRef.current = null;
  });

  return { active, done, secondsLeft, variation, resets, error: motion.error, start, stop };
}
