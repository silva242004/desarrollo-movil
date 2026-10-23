import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import GeolocationPage from './pages/GeolocationPage';
import CameraPage from './pages/CameraPage';
import MotionPage from './pages/MotionPage';
import DevicePage from './pages/DevicePage';
import HapticsPage from './pages/HapticsPage';
import FilesystemPage from './pages/FilesystemPage';
import LocalNotificationsPage from './pages/LocalNotificationsPage';
import PushNotificationsPage from './pages/PushNotificationsPage';
import NetworkPage from './pages/NetworkPage';

// Challenge 07 - app vacia con un Home de botones (uno por sensor) y una
// pagina nueva por cada sensor.
function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<Home />} />
          <Route path="/geolocation" element={<GeolocationPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/motion" element={<MotionPage />} />
          <Route path="/device" element={<DevicePage />} />
          <Route path="/haptics" element={<HapticsPage />} />
          <Route path="/filesystem" element={<FilesystemPage />} />
          <Route path="/local-notifications" element={<LocalNotificationsPage />} />
          <Route path="/push-notifications" element={<PushNotificationsPage />} />
          <Route path="/network" element={<NetworkPage />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
