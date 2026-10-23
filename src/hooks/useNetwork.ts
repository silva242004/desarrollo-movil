import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';

// @capacitor/network: estado actual de la conexion + aviso cuando cambia.
export function useNetwork() {
  const [connected, setConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    let active = true;
    let handle: PluginListenerHandle | undefined;

    Network.getStatus().then((s) => {
      if (!active) return;
      setConnected(s.connected);
      setConnectionType(s.connectionType);
    });
    Network.addListener('networkStatusChange', (s) => {
      setConnected(s.connected);
      setConnectionType(s.connectionType);
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
