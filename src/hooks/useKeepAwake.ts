import { useEffect, useRef } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import { KeepAwake } from '@capacitor-community/keep-awake';

// Hook para mantener la pantalla encendida.
// Que hace: enable() evita que la pantalla se apague (y se bloquee) y
//   disable() lo libera. Libero solo al salir de la pagina o al desmontar,
//   para no dejar la pantalla prendida si alguien se va a mitad de mision.
// Que devuelve: { enable, disable }.
// Plugin: @capacitor-community/keep-awake.
export function useKeepAwake() {
  const active = useRef(false);

  const enable = async () => {
    try {
      const { isSupported } = await KeepAwake.isSupported();
      if (!isSupported) return;
      await KeepAwake.keepAwake();
      active.current = true;
    } catch {
      // Si el navegador no lo soporta la mision igual funciona; solo puede
      // apagarse la pantalla.
    }
  };

  const disable = async () => {
    if (!active.current) return;
    active.current = false;
    try {
      await KeepAwake.allowSleep();
    } catch {
      // Nada que hacer: en el peor caso el sistema la libera al cerrar la app.
    }
  };

  useIonViewWillLeave(() => {
    disable();
  });
  useEffect(
    () => () => {
      if (active.current) KeepAwake.allowSleep().catch(() => undefined);
    },
    [],
  );

  return { enable, disable };
}
