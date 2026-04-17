
import React from 'react';
import { 
  Clock, Timer, Bell, Gauge, Scan, Bluetooth, Orbit, Compass, Radio, Hash, Droplet, Bed,
  Wind, Layers, Footprints, Mountain
} from 'lucide-react';
import { AppMode } from '../types';

interface OuterRingProps {
  appMode: AppMode;
  themeColor: string;
  ui: any;
  switchAppMode: (mode: AppMode) => void;
  toggleBtScan: () => void;
  isScanningBt: boolean;
}

export const OuterRing: React.FC<OuterRingProps> = ({
  appMode,
  themeColor,
  ui,
  switchAppMode,
  toggleBtScan,
  isScanningBt
}) => {
  const modes = [
    { id: 'clock', icon: Clock, label: 'CHRONO' },
    { id: 'stopwatch', icon: Timer, label: 'SW' },
    { id: 'timer', icon: Bell, label: 'TIMER' },
    { id: 'speed', icon: Gauge, label: 'SPEED' },
    { id: 'scanner', icon: Scan, label: 'SCAN' },
    { id: 'radar', icon: Bluetooth, label: 'RADAR', onClick: toggleBtScan, active: isScanningBt },
    { id: 'orbit', icon: Orbit, label: 'ORBIT' },
    { id: 'nav', icon: Compass, label: 'NAV' },
    { id: 'sonar', icon: Radio, label: 'SONAR' },
    { id: 'decrypt', icon: Hash, label: 'DECRYPT' },
    { id: 'water', icon: Droplet, label: 'WATER' },
    { id: 'sleep', icon: Bed, label: 'SLEEP' },
    { id: 'zen', icon: Wind, label: 'ZEN' },
    { id: 'level', icon: Layers, label: 'LEVEL' },
    { id: 'steps', icon: Footprints, label: 'STEPS' },
    { id: 'altimeter', icon: Mountain, label: 'ALT' }
  ];

  const allItems = [
    ...modes.map(m => ({ ...m, type: 'mode', value: '' }))
  ];

  return (
    <>
      {/* Decorative Outer Ring Background */}
      <div 
        className="absolute inset-[-7%] rounded-full border border-current opacity-10 pointer-events-none"
        style={{ color: themeColor }}
      />
      <div 
        className="absolute inset-[-8%] rounded-full border border-dashed border-current opacity-5 animate-[spin_60s_linear_infinite] pointer-events-none"
        style={{ color: themeColor }}
      />

      {allItems.map((item, i) => {
        // Distribute all icons around the clock face
        const angle = (i / allItems.length) * (Math.PI * 2) - Math.PI / 2;
        const radius = 56; // Tighter radius to avoid screen overlap
        const top = 50 + radius * Math.sin(angle);
        const left = 50 + radius * Math.cos(angle);
        
        const isCurrentMode = appMode === item.id;
        const isActive = item.active || isCurrentMode;
        
        return (
          <div
            key={item.id}
            className="absolute z-50 flex flex-col items-center"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <button
              onClick={() => {
                if (item.onClick) item.onClick();
                if (item.type === 'mode') switchAppMode(item.id as AppMode);
              }}
              className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border transition-all duration-300 ${isActive ? 'bg-black/60 backdrop-blur-md' : `bg-black/20 ${ui.bgApp}`} ${isCurrentMode ? 'scale-125' : 'scale-100'}`}
              style={{
                borderColor: isActive ? themeColor : ui.tickMuted,
                color: isActive ? themeColor : ui.iconMuted,
                boxShadow: isActive ? `0 0 10px ${themeColor}40` : 'none'
              }}
            >
              <item.icon size={item.type === 'tele' ? 12 : 14} className={isActive ? 'animate-pulse' : ''} />
            </button>
            <div className="flex flex-col items-center mt-0.5 pointer-events-none">
               <span 
                className={`text-[6px] sm:text-[7px] font-bold tracking-tighter uppercase leading-none ${(isCurrentMode || item.active) ? '' : 'opacity-40'}`}
                style={{ color: (isCurrentMode || item.active) ? themeColor : ui.textVeryMuted }}
               >
                 {item.value || item.label}
               </span>
            </div>
          </div>
        )
      })}

    </>
  );
};
