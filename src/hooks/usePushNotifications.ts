import { useEffect, useState } from 'react';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { PushNotifications, type PushNotificationSchema } from '@capacitor/push-notifications';
import { errorMessage } from './errorMessage';

// @capacitor/push-notifications: notificaciones enviadas desde un servidor
// (por ejemplo desde la consola de Firebase Cloud Messaging).
// Flujo: pedir permiso -> register() -> el sistema entrega un token ->
// ese token es la "direccion" del telefono para enviarle mensajes.
export function usePushNotifications() {
  const supported = Capacitor.isNativePlatform();
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Los oyentes se registran al montar y se quitan al desmontar.
  useEffect(() => {
    if (!supported) return;
    let active = true;
    const handles: PluginListenerHandle[] = [];
    const keep = (p: Promise<PluginListenerHandle>) =>
      p.then((h) => {
        if (active) handles.push(h);
        else h.remove();
      });

    keep(PushNotifications.addListener('registration', (t) => setToken(t.value)));
    keep(PushNotifications.addListener('registrationError', (e) => setError(errorMessage(e.error))));
    keep(
      PushNotifications.addListener('pushNotificationReceived', (n) =>
        setNotifications((prev) => [n, ...prev]),
      ),
    );
    keep(
      PushNotifications.addListener('pushNotificationActionPerformed', (a) =>
        setNotifications((prev) => [a.notification, ...prev]),
      ),
    );

    return () => {
      active = false;
      handles.forEach((h) => h.remove());
    };
  }, [supported]);

  const register = async () => {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        setError('Permiso de notificaciones denegado');
        return;
      }
      await PushNotifications.register();
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return { supported, token, notifications, error, register };
}
