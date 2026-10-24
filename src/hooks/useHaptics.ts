import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Hook de vibracion (reutilizado del challenge 07, sin cambios).
// Que hace: respuesta fisica (vibracion). En dispositivos sin motor de
//   vibracion las llamadas no hacen nada (no lanzan error).
// Que devuelve: { impact, notification, vibrate, selection }.
// Plugin: @capacitor/haptics.
export function useHaptics() {
  return {
    impact: (style: ImpactStyle) => Haptics.impact({ style }),
    notification: (type: NotificationType) => Haptics.notification({ type }),
    vibrate: (duration = 500) => Haptics.vibrate({ duration }),
    selection: async () => {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    },
  };
}
