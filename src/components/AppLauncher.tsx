
import React, { useState } from 'react';
import { 
  LayoutGrid, Scan, Bluetooth, Orbit, Compass, Radio, Hash, Wind, Layers, Footprints, Mountain, X,
  Zap, Activity, Sun, Flame, Nfc, Calendar, Timer, Bell, Gauge, Droplet, Bed, Clock, Satellite, Watch
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

  const chronos = [
    { id: 'clock', icon: Clock, label: 'MAIN CHRONO' },
    { id: 'analog', icon: Watch, label: 'ANALOG CHRONO' },
    { id: 'stopwatch', icon: Timer, label: 'STOPWATCH' },
    { id: 'timer', icon: Bell, label: 'COUNTDOWN' },
    { id: 'speed', icon: Gauge, label: 'VELOCITY' },
    { id: 'water', icon: Droplet, label: 'HYDRATION' },
    { id: 'sleep', icon: Bed, label: 'CHRONO SLEEP' },
  ];

  const sensors = [
    { id: 'scanner', icon: Scan, label: 'SCANNER' },
    { id: 'radar', icon: Bluetooth, label: 'BT RADAR', onClick: toggleBtScan, active: isScanningBt },
    { id: 'nav', icon: Compass, label: 'WAYPOINT' },
    { id: 'sonar', icon: Radio, label: 'SONAR' },
    { id: 'decrypt', icon: Hash, label: 'DECRYPT' },
    { id: 'zen', icon: Wind, label: 'ZEN MODE' },
    { id: 'level', icon: Layers, label: 'LEVELER' },
    { id: 'steps', icon: Footprints, label: 'STEP COUNT' },
    { id: 'altimeter', icon: Mountain, label: 'ALTIMETER' },
    { id: 'orbit', icon: Orbit, label: 'ORBIT' },
    { id: 'astro', icon: Satellite, label: 'NEO RADAR' },
    { id: 'emf', icon: Zap, label: 'EMF' },
    { id: 'seismo', icon: Activity, label: 'SEISMO' },
    { id: 'lumen', icon: Sun, label: 'LUMEN' },
    { id: 'thermal', icon: Flame, label: 'THERMAL' },
    { id: 'nfc', icon: Nfc, label: 'NFC' },
    { id: 'calendar', icon: Calendar, label: 'CALENDAR' },
  ];

  const categories = [
    { title: 'Chronometrics', items: chronos },
    { title: 'Tactical Sensors', items: sensors }
  ];

  return (
    <div className="absolute bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: -10 }}
            className={`mb-4 w-[360px] p-4 rounded-2xl border backdrop-blur-3xl shadow-2xl origin-bottom-left max-h-[70vh] overflow-y-auto ${ui.bgClock} scrollbar-hide`}
            style={{ 
              borderColor: `${themeColor}40`, 
              boxShadow: `0 20px 60px -10px ${themeColor}40, inset 0 0 20px ${themeColor}10` 
            }}
          >
            <div className="flex items-center justify-between mb-6 border-b pb-4" style={{ borderColor: `${themeColor}20` }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-current/10" style={{ color: themeColor }}>
                  <LayoutGrid size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em]" style={{ color: themeColor }}>
                    DECIMALCHRONO
                  </span>
                  <span className="text-[7px] uppercase opacity-40 font-bold tracking-widest text-white">System Command Launcher</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: ui.textVeryMuted }} className="hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {categories.map((cat, idx) => (
              <div key={cat.title} className={idx > 0 ? 'mt-8' : ''}>
                <h3 className="text-[8px] uppercase font-bold tracking-[0.2em] mb-3 opacity-40 px-1" style={{ color: themeColor }}>
                  {cat.title}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {cat.items.map(mod => {
                    const Icon = mod.icon;
                    const isCurrentMode = appMode === mod.id;
                    const isActive = (mod as any).active || isCurrentMode;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          if ((mod as any).onClick) (mod as any).onClick();
                          switchAppMode(mod.id as AppMode);
                          setIsOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group relative
                          ${isActive ? 'bg-white/10' : 'bg-white/[0.02] hover:bg-white/[0.08]'}`}
                        style={{
                          borderColor: isActive ? themeColor : 'rgba(255,255,255,0.05)',
                          color: isActive ? themeColor : ui.textMain
                        }}
                      >
                        <div 
                          className={`mb-2 p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-current/20 scale-110 shadow-[0_0_15px_rgba(0,0,0,0.3)]' : 'bg-white/5 group-hover:bg-white/10'}`}
                        >
                          <Icon size={18} className={isActive ? 'animate-pulse' : 'opacity-60 group-hover:opacity-100'} />
                        </div>
                        <span className="text-[7px] leading-tight font-black tracking-wider uppercase text-center h-4 flex items-center">
                          {mod.label}
                        </span>
                        {isActive && (
                          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
             {appMode !== 'clock' && appMode !== 'analog' && !['stopwatch', 'timer', 'speed', 'water', 'sleep'].includes(appMode) && (
                 <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black animate-pulse" style={{ backgroundColor: themeColor }}></div>
             )}
        </div>
      </button>
    </div>
  );
};
