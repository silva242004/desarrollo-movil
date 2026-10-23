import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import Result from '../components/Result';
import { useDevice } from '../hooks/useDevice';

function DevicePage() {
  const { info, id, battery, language, error, refresh } = useDevice();

  return (
    <SensorPage title="Device" plugin="@capacitor/device">
      <IonButton expand="block" className="ion-margin-top" onClick={refresh}>
        Actualizar
      </IonButton>
      <Result
        error={error}
        data={
          info && {
            model: info.model,
            platform: info.platform,
            operatingSystem: info.operatingSystem,
            osVersion: info.osVersion,
            manufacturer: info.manufacturer,
            isVirtual: info.isVirtual,
            deviceId: id?.identifier,
            language,
            batteryLevel: battery?.batteryLevel !== undefined ? `${Math.round(battery.batteryLevel * 100)}%` : 'n/d',
            isCharging: battery?.isCharging,
          }
        }
        emptyText="Cargando..."
      />
    </SensorPage>
  );
}

export default DevicePage;
