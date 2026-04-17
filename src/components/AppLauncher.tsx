
import React, { useState } from 'react';
import { 
  LayoutGrid, Scan, Bluetooth, Orbit, Compass, Radio, Hash, Wind, Layers, Footprints, Mountain, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppMode } from '../types';

interface AppLauncherProps {
  appMode: AppMode;
  themeColor: string;
  ui: any;
  switchAppMode: (mode: AppMode) => void;
  toggleBtScan: () => void;
  isScanningBt: boolean;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  appMode,
  themeColor,
  ui,
  switchAppMode,
  toggleBtScan,
  isScanningBt
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const modules = [
    { id: 'scanner', icon: Scan, label: 'SCANNER' },
    { id: 'radar', icon: Bluetooth, label: 'BT RADAR', onClick: toggleBtScan, active: isScanningBt },
    { id: 'nav', icon: Compass, label: 'WAYPOINT' },
    { id: 'sonar', icon: Radio, label: 'SONAR' },
    { id: 'decrypt', icon: Hash, label: 'DECRYPT' },
    { id: 'zen', icon: Wind, label: 'ZEN MODE' },
    { id: 'level', icon: Layers, label: 'LEVELER' },
    { id: 'steps', icon: Footprints, label: 'STEPS' },
    { id: 'altimeter', icon: Mountain, label: 'ALTIMETER' },
    { id: 'orbit', icon: Orbit, label: 'ORBIT' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`mb-4 w-72 p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl origin-bottom-left ${ui.bgClock}`}
            style={{ borderColor: `${themeColor}40`, boxShadow: `0 15px 50px -10px ${themeColor}60` }}
          >
            <div className="flex items-center justify-between mb-4 border-b pb-2" style={{ borderColor: `${themeColor}20` }}>
              <div className="flex items-center gap-2">
                <LayoutGrid size={14} style={{ color: themeColor }} />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: themeColor }}>
                  Tactical Apps
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: ui.textVeryMuted }}>
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {modules.map(mod => {
                const Icon = mod.icon;
                const isCurrentMode = appMode === mod.id;
                const isActive = mod.active || isCurrentMode;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      if (mod.onClick) mod.onClick();
                      switchAppMode(mod.id as AppMode);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group
                      ${isActive ? 'bg-black/40' : 'bg-black/10 hover:bg-black/20'}`}
                    style={{
                      borderColor: isActive ? themeColor : 'rgba(255,255,255,0.05)',
                      color: isActive ? themeColor : ui.textMain
                    }}
                  >
                    <div 
                      className={`mb-2 p-2 rounded-lg transition-colors ${isActive ? 'bg-current/10' : 'bg-white/5 group-hover:bg-white/10'}`}
                    >
                      <Icon size={18} className={isActive ? 'animate-pulse' : 'opacity-70 group-hover:opacity-100'} />
                    </div>
                    <span className="text-[9px] font-bold tracking-[0.1em] uppercase">
                      {mod.label}
                    </span>
                    {isActive && (
                      <div className="mt-1 w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 ${ui.btnBg} group`}
        style={{ borderColor: isOpen ? themeColor : `${themeColor}50`, color: themeColor }}
        title="Tactical Launcher"
      >
        <div className="relative">
             <LayoutGrid size={24} className={`transition-transform duration-500 ${isOpen ? 'rotate-90 scale-75' : 'group-hover:rotate-12'}`} />
             {appMode !== 'clock' && !['stopwatch', 'timer', 'speed', 'water', 'sleep'].includes(appMode) && (
                 <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black animate-pulse" style={{ backgroundColor: themeColor }}></div>
             )}
        </div>
      </button>
    </div>
  );
};
