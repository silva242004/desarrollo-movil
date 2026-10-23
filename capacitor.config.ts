import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.edu.uao.sensores',
  appName: 'Sensores',
  webDir: 'dist',
  plugins: {
    // iOS: mostrar la notificacion push aunque la app este abierta.
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
