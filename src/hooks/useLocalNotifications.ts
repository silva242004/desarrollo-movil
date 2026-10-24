import { useCallback, useEffect, useState } from 'react';
import { LocalNotifications, type PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { NOTIFICATION_CHANNEL_ID } from '../config/missions';
import { errorMessage } from './errorMessage';

// Creo el canal una sola vez por arranque de la app. Importancia 5 (alta) es
// la que hace que Android muestre la notificacion flotando arriba de la
// pantalla; con la 3 del canal "default" solo quedaba en el panel. En web no
// existen los canales, por eso solo lo hago en el telefono.
let channelReady: Promise<void> | null = null;
function ensureChannel() {
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  channelReady ??= LocalNotifications.createChannel({
    id: NOTIFICATION_CHANNEL_ID,
    name: 'Misiones',
    description: 'Avisos al completar misiones',
    importance: 5,
    visibility: 1,
    vibration: true,
  }).catch(() => {
    // Si falla, la notificacion igual sale por el canal por defecto.
    channelReady = null;
  });
  return channelReady;
}

// Hook de notificaciones locales (reutilizado del challenge 07).
// Que hace: muestra notificaciones en el propio telefono, sin servidor (a
//   diferencia de las push), y maneja el permiso (Android 13+ pide
//   POST_NOTIFICATIONS en tiempo de ejecucion).
// Que devuelve: { pending, error, permission, ensurePermission, notify,
//   schedule, cancelAll, refreshPending }.
// Plugin: @capacitor/local-notifications.
// Cambios frente al challenge 07: agregue notify (mostrar ya, sin programar),
// el estado permission, para que la app avise si el usuario las nego, y un
// canal propio de importancia alta para que se vean en pantalla.
export function useLocalNotifications() {
  const [pending, setPending] = useState<PendingLocalNotificationSchema[]>([]);
  const [error, setError] = useState<string | null>(null);
  // null = aun no lo he consultado.
  const [permission, setPermission] = useState<'granted' | 'denied' | null>(null);

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

  // Devuelve true si el usuario dio permiso. Solo muestra el dialogo del
  // sistema si todavia no se ha decidido; si lo nego, Android no lo vuelve a
  // mostrar y hay que activarlo en Ajustes.
  const ensurePermission = useCallback(async () => {
    try {
      const current = await LocalNotifications.checkPermissions();
      const granted =
        current.display === 'granted' ||
        (current.display !== 'denied' && (await LocalNotifications.requestPermissions()).display === 'granted');
      setPermission(granted ? 'granted' : 'denied');
      return granted;
    } catch {
      setPermission('denied');
      return false;
    }
  }, []);

  // Muestra la notificacion de inmediato (sin "schedule", el plugin la
  // dispara en el momento). Si no hay permiso no hago nada: el aviso en
  // pantalla ya lo explica y la app sigue funcionando.
  const notify = useCallback(
    async (title: string, body: string) => {
      try {
        if (!(await ensurePermission())) return;
        await ensureChannel();
        await LocalNotifications.schedule({
          notifications: [
            { id: Math.floor(Math.random() * 1_000_000), title, body, channelId: NOTIFICATION_CHANNEL_ID },
          ],
        });
        setError(null);
      } catch (e) {
        setError(errorMessage(e));
      }
    },
    [ensurePermission],
  );

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

  return { pending, error, permission, ensurePermission, notify, schedule, cancelAll, refreshPending };
}
