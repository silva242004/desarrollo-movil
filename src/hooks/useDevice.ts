import { useCallback, useEffect, useState } from 'react';
import { Device, type BatteryInfo, type DeviceId, type DeviceInfo } from '@capacitor/device';
import { errorMessage } from './errorMessage';

// @capacitor/device: modelo, sistema operativo, id unico, idioma y bateria.
export function useDevice() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [id, setId] = useState<DeviceId | null>(null);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [deviceInfo, deviceId, batteryInfo, lang] = await Promise.all([
        Device.getInfo(),
        Device.getId(),
        Device.getBatteryInfo(),
        Device.getLanguageCode(),
      ]);
      setInfo(deviceInfo);
      setId(deviceId);
      setBattery(batteryInfo);
      setLanguage(lang.value);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { info, id, battery, language, error, refresh };
}
