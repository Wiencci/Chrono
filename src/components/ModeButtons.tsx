
import React from 'react';
import { Clock, Timer, Bell, Gauge, Scan, Bluetooth, Orbit, Compass, Radio, Hash, Droplet, Bed } from 'lucide-react';
import { AppMode } from '../types';

interface ModeButtonsProps {
  appMode: AppMode;
  themeColor: string;
  isLightMode: boolean;
  arEnabled: boolean;
  ui: any;
  switchAppMode: (mode: AppMode) => void;
}

export const ModeButtons: React.FC<ModeButtonsProps> = ({
  appMode,
  themeColor,
  isLightMode,
  arEnabled,
  ui,
  switchAppMode
}) => {
  const modes = [
    { id: 'clock', icon: Clock, label: 'CHRONO' },
    { id: 'stopwatch', icon: Timer, label: 'SW' },
    { id: 'timer', icon: Bell, label: 'TIMER' },
    { id: 'speed', icon: Gauge, label: 'SPEED' },
    { id: 'scanner', icon: Scan, label: 'SCAN' },
    { id: 'radar', icon: Bluetooth, label: 'RADAR' },
    { id: 'orbit', icon: Orbit, label: 'ORBIT' },
    { id: 'nav', icon: Compass, label: 'NAV' },
    { id: 'sonar', icon: Radio, label: 'SONAR' },
    { id: 'decrypt', icon: Hash, label: 'DECRYPT' },
    { id: 'water', icon: Droplet, label: 'WATER' },
    { id: 'sleep', icon: Bed, label: 'SLEEP' }
  ];

  return (
    <>
      {modes.map((m, i, arr) => {
        const angle = -Math.PI / 2 + (i - (arr.length - 1) / 2) * (Math.PI / 12);
        const radius = 56;
        const top = 50 + radius * Math.sin(angle);
        const left = 50 + radius * Math.cos(angle);
        return (
          <button
            key={m.id}
            onClick={() => switchAppMode(m.id as AppMode)}
            className={`absolute z-50 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-transparent transition-all duration-300 ${appMode === m.id ? 'bg-black/80 backdrop-blur-md scale-110' : `hover:bg-black/40 ${ui.bgApp}`}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: 'translate(-50%, -50%)',
              ...(appMode === m.id ? { 
                borderColor: themeColor, 
                color: themeColor, 
                boxShadow: `0 0 15px ${themeColor}60` 
              } : {
                color: isLightMode && !arEnabled ? '#666' : '#999'
              })
            }}
            title={m.label}
          >
            <m.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )
      })}
    </>
  );
};
