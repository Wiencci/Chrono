import React from 'react';
import { toDecimalHour } from '../lib/decimalLogic';
import { Battery, BatteryCharging, Thermometer, WifiOff, Wifi, MapPin, Mic, MicOff, Sunrise, Sunset, Compass, Mountain, Footprints } from 'lucide-react';

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
  heading: number | null;
  altitude: number;
  steps: number;
  toggleMic?: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  themeColor, ui, battery, weather, network, hasGps, micEnabled, decibels, isDay, sunTimes, displayMode, heading, altitude, steps, toggleMic
}) => {
  const telemetryData = [
    { 
      id: 'bat', 
      icon: (battery?.charging) ? BatteryCharging : Battery, 
      value: battery !== null ? `${Math.round(battery.level * 100)}%` : '---', 
      active: battery !== null && (battery.level < 0.2 || battery.charging) 
    },
    { id: 'temp', icon: Thermometer, value: weather.temp !== null ? `${Math.round(weather.temp)}°D` : '---' },
    { id: 'sun', icon: isDay ? Sunset : Sunrise, value: displayMode === 'decimal' ? (isDay ? toDecimalHour(sunTimes.set) : toDecimalHour(sunTimes.rise)).toFixed(1) : `${Math.floor(isDay ? sunTimes.set : sunTimes.rise)}h` },
    { id: 'link', icon: network === 'offline' ? WifiOff : Wifi, value: network?.slice(0, 3).toUpperCase() || '---' },
    { id: 'gps', icon: MapPin, value: hasGps ? 'GPS' : 'OFF' },
    { id: 'heading', icon: Compass, value: heading !== null ? `${Math.round(heading)}°` : '---' },
    { id: 'alt', icon: Mountain, value: `${Math.round(altitude)}m` },
    { id: 'steps', icon: Footprints, value: steps > 999 ? `${(steps/1000).toFixed(1)}k` : `${steps}` },
    { id: 'audio', icon: micEnabled ? Mic : MicOff, value: decibels !== null ? `${decibels}dB` : 'OFF', active: micEnabled, onClick: toggleMic },
  ];

  return (
    <div className="absolute top-10 left-0 w-full flex flex-col items-center gap-3 z-[60] px-4 pointer-events-none">
      {/* System Status Header */}
      <div className="flex flex-col items-center pointer-events-none opacity-80 mt-2">
        <div className={`h-[1px] w-12 ${ui?.borderClock || 'bg-white/10'} mb-1 overflow-hidden rounded-full`}>
          <div className="h-full bg-current animate-[shimmer_3s_infinite]" style={{ backgroundColor: themeColor, width: '30%' }} />
        </div>
        <span className={`text-[6px] font-bold tracking-[0.4em] opacity-50 ${ui?.textMain || 'text-white'} uppercase`}>Status Nominal</span>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
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
    </div>
  );
};
