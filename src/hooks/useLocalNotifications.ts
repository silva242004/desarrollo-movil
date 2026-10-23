import { useCallback, useEffect, useState } from 'react';
import { LocalNotifications, type PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { errorMessage } from './errorMessage';

// @capacitor/local-notifications: notificaciones programadas en el propio
// telefono, sin servidor (a diferencia de las push).
export function useLocalNotifications() {
  const [pending, setPending] = useState<PendingLocalNotificationSchema[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshPending = useCallback(async () => {
    try {
      // Copia del arreglo: en web el plugin devuelve siempre la MISMA
      // referencia (la muta por dentro) y React no re-renderiza si recibe el
      // mismo arreglo, asi que la lista se quedaba en "Pendientes (0)".
      setPending([...(await LocalNotifications.getPending()).notifications]);
    } catch {
      setPending([]);
    }
  }, []);

  useEffect(() => {
    refreshPending();
    // Cuando una notificacion se dispara deja de estar pendiente.
    const sub = LocalNotifications.addListener('localNotificationReceived', () => {
      refreshPending();
    });
    return () => {
      sub.then((h) => h.remove());
    };
  }, [refreshPending]);

  // Devuelve true si el usuario dio permiso.
  const ensurePermission = async () => {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;
    const requested = await LocalNotifications.requestPermissions();
    return requested.display === 'granted';
  };

  const schedule = async (title: string, body: string, secondsFromNow: number) => {
    try {
      if (!(await ensurePermission())) {
        setError('Permiso de notificaciones denegado');
        return;
      }
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 1_000_000),
            title,
            body,
            schedule: { at: new Date(Date.now() + secondsFromNow * 1000) },
          },
        ],
      });
      setError(null);
      await refreshPending();
      // Respaldo por si el evento localNotificationReceived no llega (por
      // ejemplo, con la app en segundo plano): refrescar al vencer el tiempo.
      setTimeout(refreshPending, secondsFromNow * 1000 + 1000);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const cancelAll = async () => {
    try {
      const { notifications } = await LocalNotifications.getPending();
      if (notifications.length > 0) await LocalNotifications.cancel({ notifications });
      await refreshPending();
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return { pending, error, schedule, cancelAll, refreshPending };
}
