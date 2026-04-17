
import React from 'react';
import { 
  Clock, Timer, Bell, Gauge, Scan, Bluetooth, Orbit, Compass, Radio, Hash, Droplet, Bed,
  Battery, Zap, WifiOff, Wifi, Sunset, Sunrise, Thermometer, Mic, MicOff, MapPin,
  Eye, Sun, Moon, Volume2, VolumeX, RefreshCw, MessageSquare, Wind, Layers, Footprints, Mountain, Brain, ShieldAlert
} from 'lucide-react';
import { AppMode, Theme, THEMES } from '../types';

interface OuterRingProps {
  appMode: AppMode;
  themeColor: string;
  isLightMode: boolean;
  arEnabled: boolean;
  ui: any;
  switchAppMode: (mode: AppMode) => void;
  toggleMode: () => void;
  // Telemetry Props
  battery: { level: number; charging: boolean } | null;
  network: string | null;
  isDay: boolean;
  sunTimes: { rise: number; set: number };
  displayMode: 'decimal' | 'standard';
  weather: { temp: number | null };
  micEnabled: boolean;
  decibels: number | null;
  hasGps: boolean;
  toggleMic: () => void;
  // Theme/AR Props
  soundEnabled: boolean;
  activeTheme: Theme;
  toggleAR: () => void;
  toggleLightMode: () => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  toggleAiEnabled: () => void;
  toggleStealthMode: () => void;
  changeTheme: (theme: Theme) => void;
  toggleBtScan: () => void;
  isScanningBt: boolean;
  voiceEnabled: boolean;
  aiEnabled: boolean;
  stealthMode: boolean;
}

export const OuterRing: React.FC<OuterRingProps> = ({
  appMode,
  themeColor,
  isLightMode,
  arEnabled,
  ui,
  switchAppMode,
  battery,
  network,
  isDay,
  sunTimes,
  displayMode,
  weather,
  micEnabled,
  decibels,
  hasGps,
  toggleMic,
  soundEnabled,
  activeTheme,
  toggleAR,
  toggleLightMode,
  toggleSound,
  changeTheme,
  toggleBtScan,
  isScanningBt,
  toggleMode,
  toggleVoice,
  toggleAiEnabled,
  toggleStealthMode,
  voiceEnabled,
  aiEnabled,
  stealthMode
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

  const telemetry = [
    { id: 'power', icon: battery?.charging ? Zap : Battery, value: battery ? `${Math.round(battery.level * 100)}%` : '---', label: 'PWR', active: battery?.charging },
    { id: 'temp', icon: Thermometer, value: weather.temp !== null ? `${Math.round(weather.temp)}°` : '---', label: 'TMP', active: weather.temp !== null },
    { id: 'link', icon: network === 'offline' ? WifiOff : Wifi, value: network?.slice(0, 3).toUpperCase() || '---', label: 'NET', active: network !== 'offline' },
    { id: 'audio', icon: micEnabled ? Mic : MicOff, value: decibels !== null ? `${decibels}dB` : 'OFF', label: 'MIC', active: micEnabled, onClick: toggleMic },
    { id: 'sun', icon: isDay ? Sunset : Sunrise, value: displayMode === 'decimal' ? (isDay ? sunTimes.set / 2.4 : sunTimes.rise / 2.4).toFixed(1) : `${Math.floor(isDay ? sunTimes.set : sunTimes.rise)}h`, label: isDay ? 'SET' : 'RISE', active: true },
    { id: 'gps', icon: MapPin, value: hasGps ? 'GPS' : 'OFF', label: 'LOC', active: hasGps }
  ];

  const tools = [
    { id: 'ar', icon: Eye, value: '', label: 'AR', onClick: toggleAR, active: arEnabled },
    { id: 'light', icon: isLightMode ? Sun : Moon, value: '', label: 'LGT', onClick: toggleLightMode, active: isLightMode },
    { id: 'sound', icon: soundEnabled ? Volume2 : VolumeX, value: '', label: 'SND', onClick: toggleSound, active: soundEnabled },
    { id: 'ai', icon: Brain, value: '', label: 'AI', onClick: toggleAiEnabled, active: aiEnabled },
    { id: 'voice', icon: MessageSquare, value: '', label: 'VOX', onClick: toggleVoice, active: voiceEnabled },
    { id: 'mode', icon: RefreshCw, value: displayMode === 'decimal' ? 'DCM' : 'STD', label: 'MODE', onClick: toggleMode, active: displayMode === 'decimal' },
    { id: 'stealth', icon: ShieldAlert, value: '', label: 'STL', onClick: toggleStealthMode, active: stealthMode }
  ];

  const allItems = [
    ...modes.map(m => ({ ...m, type: 'mode', value: '' })),
    ...telemetry.map(t => ({ ...t, type: 'tele' })),
    ...tools.map(t => ({ ...t, type: 'tool' }))
  ];

  return (
    <>
      {/* Decorative Outer Ring Background */}
      <div 
        className="absolute inset-[-15%] rounded-full border border-current opacity-10 pointer-events-none"
        style={{ color: themeColor }}
      />
      <div 
        className="absolute inset-[-16%] rounded-full border border-dashed border-current opacity-5 animate-[spin_60s_linear_infinite] pointer-events-none"
        style={{ color: themeColor }}
      />

      {allItems.map((item, i) => {
        // Distribute all icons around the clock face
        const angle = (i / allItems.length) * (Math.PI * 2) - Math.PI / 2;
        const radius = 62; // Further out than before
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

      {/* Theme Selectors (also in the ring) */}
      <div className="absolute top-[10%] right-[10%] flex flex-col gap-2 z-[60]">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => changeTheme(theme)}
            className={`w-3 h-3 rounded-full border-2 transition-all ${activeTheme.id === theme.id ? 'scale-125 border-white' : 'border-transparent opacity-40'}`}
            style={{ backgroundColor: theme.hex, boxShadow: activeTheme.id === theme.id ? `0 0 10px ${theme.hex}` : 'none' }}
          />
        ))}
      </div>
    </>
  );
};
