import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// @capacitor/haptics: respuesta fisica (vibracion). En dispositivos sin
// motor de vibracion las llamadas no hacen nada (no lanzan error).
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
