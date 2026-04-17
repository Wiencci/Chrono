
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
    { id: 'water', icon: Droplet, label: 'WATER' },
    { id: 'sleep', icon: Bed, label: 'SLEEP' }
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
        const angle = (i / allItems.length) * (Math.PI * 2) - Math.PI / 2;
        const radius = 56;
        const top = 50 + radius * Math.sin(angle);
        const left = 50 + radius * Math.cos(angle);
        
        const isCurrentMode = appMode === item.id;
        const isActive = isCurrentMode;
        
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
                switchAppMode(item.id as AppMode);
              }}
              className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border transition-all duration-300 ${isActive ? 'bg-black/60 backdrop-blur-md' : `bg-black/20 ${ui.bgApp}`} ${isCurrentMode ? 'scale-125' : 'scale-100'}`}
              style={{
                borderColor: isActive ? themeColor : ui.tickMuted,
                color: isActive ? themeColor : ui.iconMuted,
                boxShadow: isActive ? `0 0 10px ${themeColor}40` : 'none'
              }}
            >
              <item.icon size={14} className={isActive ? 'animate-pulse' : ''} />
            </button>
            <div className="flex flex-col items-center mt-0.5 pointer-events-none">
               <span 
                className={`text-[6px] sm:text-[7px] font-bold tracking-tighter uppercase leading-none ${isCurrentMode ? '' : 'opacity-40'}`}
                style={{ color: isCurrentMode ? themeColor : ui.textVeryMuted }}
               >
                 {item.label}
               </span>
            </div>
          </div>
        )
      })}

    </>
  );
};
