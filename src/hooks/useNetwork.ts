import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';

// Custom hook (Clase 06): estado de la conexion con @capacitor/network.
// Network.getStatus() da el estado actual y el evento
// "networkStatusChange" avisa cuando cambia (wifi <-> sin conexion).
export function useNetwork() {
  const [connected, setConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    let active = true;
    let handle: PluginListenerHandle | undefined;

    Network.getStatus().then((status) => {
      if (!active) return;
      setConnected(status.connected);
      setConnectionType(status.connectionType);
    });

    Network.addListener('networkStatusChange', (status) => {
      setConnected(status.connected);
      setConnectionType(status.connectionType);
    }).then((h) => {
      if (active) handle = h;
      else h.remove();
    });

    return () => {
      active = false;
      handle?.remove();
    };
  }, []);

  return { connected, connectionType };
}
