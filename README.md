# Challenge 07 - App de sensores (Capacitor)

> Create a new Empty App. Use a Home Page to create buttons (one for each
> sensor). Create one new page for each sensor to implement each one of them.

Requisitos y donde quedaron resueltos:

- **App nueva vacia** -> proyecto propio con Ionic + React + Capacitor
  (`capacitor.config.ts`, appId `co.edu.uao.sensores`).
- **Home con un boton por sensor** -> `src/pages/Home.tsx`: una fila por sensor
  (9 en total), cada una navega a su pagina.
- **Una pagina nueva por sensor**, cada una con su custom hook (Clase 07):

  | Sensor | Pagina | Hook | Plugin |
  |---|---|---|---|
  | Geolocation | `GeolocationPage.tsx` | `useGeolocation` (getCurrentPosition, watchPosition) | `@capacitor/geolocation` |
  | Camera | `CameraPage.tsx` | `useCamera` (getPhoto: camara o galeria) | `@capacitor/camera` |
  | Motion | `MotionPage.tsx` | `useAccelerometer` (accel + orientation) | `@capacitor/motion` |
  | Device | `DevicePage.tsx` | `useDevice` (info, id, bateria, idioma) | `@capacitor/device` |
  | Haptics | `HapticsPage.tsx` | `useHaptics` (impact, notification, vibrate, selection) | `@capacitor/haptics` |
  | Filesystem | `FilesystemPage.tsx` | `useFilesystem` (write, read, readdir, delete) | `@capacitor/filesystem` |
  | Local Notifications | `LocalNotificationsPage.tsx` | `useLocalNotifications` (schedule, getPending, cancel) | `@capacitor/local-notifications` |
  | Push Notifications | `PushNotificationsPage.tsx` | `usePushNotifications` (register + listeners) | `@capacitor/push-notifications` |
  | Network | `NetworkPage.tsx` | `useNetwork` (getStatus + networkStatusChange) | `@capacitor/network` |

  Los hooks estan en `src/hooks/`. Los oyentes (`watchPosition`,
  `Motion.addListener`, push, network) se cierran al salir de la pagina.

Nota: Network no esta en la Clase 07 (viene de la Clase 06), pero es un
sensor mas y ya tenia su hook, asi que se agrego como novena pagina.

## Como correrlo en el navegador

```bash
npm install
npm run dev
```

En el navegador funcionan Geolocation, Camera (visor de `@ionic/pwa-elements`),
Motion (si el equipo tiene sensor), Device, Haptics (vibra si el navegador lo
permite), Filesystem (usa IndexedDB), Local Notifications (pide permiso al
navegador) y Network. **Push Notifications solo funciona en el telefono.**

## Como correrlo en el telefono (Android)

Requisitos: Android Studio, JDK 21 (Capacitor 8 lo exige; el JBR que trae Android Studio sirve), depuracion USB activada.

```bash
npm install
npm run build
npx cap add android      # solo la primera vez: crea la carpeta android/
ionic cap run android    # o: npm run android
```

### Permisos de Android

Despues de `npx cap add android`, abre `android/app/src/main/AndroidManifest.xml`
y agrega dentro de `<manifest>` (junto al permiso de INTERNET que ya esta):

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

Los demas (VIBRATE, POST_NOTIFICATIONS, ACCESS_NETWORK_STATE...) los trae cada
plugin. Si vuelves a instalar plugins o cambias algo en la web, repite
`npm run build` y `npx cap sync android`.

### Configurar las Push Notifications (Firebase Cloud Messaging)

1. En https://console.firebase.google.com/ crea o abre tu proyecto.
2. **Configuracion del proyecto > General > Tus apps > Android**: registra la
   app con el nombre de paquete **co.edu.uao.sensores** (el `appId` de
   `capacitor.config.ts`).
3. Descarga `google-services.json` y copialo en `android/app/`.
4. `npx cap sync android` y vuelve a correr la app.
5. En la pagina Push Notifications toca **Registrar dispositivo**: aparece el
   token.
6. Firebase Console > **Messaging** (Engage) > **Crear campana / Enviar mensaje de
   prueba**: pega el token y envia. Con la app abierta el mensaje aparece en la
   lista; con la app cerrada llega como notificacion del sistema.

En Android 13 o superior el sistema pide permiso para mostrar notificaciones:
hay que aceptarlo.

## Netlify

Este challenge es para el telefono; no hace falta desplegarlo. Si quieres ver
la parte web, `npm run build` y subir `dist` (`public/_redirects` ya esta).
