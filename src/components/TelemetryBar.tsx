import React from 'react';
import { Battery, BatteryCharging, Thermometer, WifiOff, Wifi, MapPin, Mic, MicOff, Sunrise, Sunset } from 'lucide-react';

interface TelemetryBarProps {
  themeColor: string;
  ui: any;
  battery: { level: number; charging: boolean } | null;
  weather: { temp: number | null, desc: string };
  network: string;
  hasGps: boolean;
  micEnabled: boolean;
  decibels: number | null;
  isDay: boolean;
  sunTimes: { rise: number; set: number };
  displayMode: 'standard' | 'decimal';
  toggleMic?: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  themeColor, ui, battery, weather, network, hasGps, micEnabled, decibels, isDay, sunTimes, displayMode, toggleMic
}) => {
  const telemetryData = [
    { 
      id: 'bat', 
      icon: (battery?.charging) ? BatteryCharging : Battery, 
      value: battery !== null ? `${Math.round(battery.level * 100)}%` : '---', 
      active: battery !== null && (battery.level < 0.2 || battery.charging) 
    },
    { id: 'temp', icon: Thermometer, value: weather.temp !== null ? `${Math.round(weather.temp)}°D` : '---' },
    { id: 'link', icon: network === 'offline' ? WifiOff : Wifi, value: network?.slice(0, 3).toUpperCase() || '---' },
    { id: 'gps', icon: MapPin, value: hasGps ? 'GPS' : 'OFF' },
    { id: 'audio', icon: micEnabled ? Mic : MicOff, value: decibels !== null ? `${decibels}dB` : 'OFF', active: micEnabled, onClick: toggleMic },
    { id: 'sun', icon: isDay ? Sunset : Sunrise, value: displayMode === 'decimal' ? (isDay ? sunTimes.set / 2.4 : sunTimes.rise / 2.4).toFixed(1) : `${Math.floor(isDay ? sunTimes.set : sunTimes.rise)}h` }
  ];

  return (
    <div className="absolute top-16 left-0 w-full flex justify-center gap-2 z-[60] px-4 pointer-events-none">
      {telemetryData.map(item => {
        const Icon = item.icon;
        return (
          <div 
            key={item.id} 
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center p-1.5 w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-md rounded-xl border pointer-events-auto transition-all duration-300 ${ui.bgClock} ${item.onClick ? 'cursor-pointer hover:bg-black/10 active:scale-95' : ''}`} 
            style={{ borderColor: `${themeColor}20`, color: item.active ? themeColor : ui.iconMuted }}
          >
            <Icon size={14} className={item.active ? 'animate-pulse' : ''} />
            <span className="text-[7px] font-bold mt-1 tracking-wider" style={{ color: item.active ? themeColor : ui.textMain }}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
