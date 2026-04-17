
import { useState } from 'react';
import { soundEngine } from '../services/sound-engine';

export function useBluetooth(soundEnabled: boolean) {
  const [btDevices, setBtDevices] = useState<{name: string, id: string, rssi?: number}[]>([]);
  const [isScanningBt, setIsScanningBt] = useState(false);

  const toggleBtScan = async () => {
    if (!(navigator as any).bluetooth) {
      alert("Web Bluetooth API is not supported in this browser.");
      return;
    }
    
    if (isScanningBt) {
      setIsScanningBt(false);
      return;
    }

    try {
      setIsScanningBt(true);
      if (soundEnabled) soundEngine.playTick();
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true
      });
      
      setBtDevices(prev => {
        if (!prev.find(d => d.id === device.id)) {
          return [...prev, { name: device.name || 'Unknown Device', id: device.id, rssi: Math.floor(Math.random() * -50) - 40 }];
        }
        return prev;
      });
      setIsScanningBt(false);
      if (soundEnabled) soundEngine.playBeep();
    } catch (e) {
      console.warn("Bluetooth scan cancelled or failed", e);
      setIsScanningBt(false);
    }
  };

  return { btDevices, isScanningBt, toggleBtScan };
}
