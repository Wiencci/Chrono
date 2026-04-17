
import React from 'react';
import { Battery, Zap, WifiOff, Wifi, Sunset, Sunrise, Thermometer, Mic, MicOff, MapPin } from 'lucide-react';

interface ComplicationsHexProps {
  ui: any;
  themeColor: string;
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
}

export const ComplicationsHex: React.FC<ComplicationsHexProps> = ({
  ui,
  themeColor,
  battery,
  network,
  isDay,
  sunTimes,
  displayMode,
  weather,
  micEnabled,
  decibels,
  hasGps,
  toggleMic
}) => {
  return (
    <>
      <div className="absolute top-[20%] left-[6%] sm:left-[8%] z-30 flex flex-col items-center opacity-70">
         {battery?.charging ? <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} /> : <Battery className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} />}
         <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={battery?.charging ? { color: themeColor } : {}}>{battery ? `${Math.round(battery.level * 100)}%` : '---'}</span>
      </div>

      <div className="absolute bottom-[20%] left-[6%] sm:left-[8%] z-30 flex flex-col items-center opacity-70">
         {network === 'offline' ? <WifiOff className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} /> : <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} />}
         <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={network !== 'offline' ? { color: themeColor } : {}}>{network ? network.toUpperCase() : '---'}</span>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-[2%] sm:left-[4%] z-30 flex flex-col items-center opacity-70">
         {isDay ? <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} /> : <Sunrise className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} />}
         <span className="text-[8px] sm:text-[9px]" style={{ color: themeColor }}>
           {displayMode === 'decimal' 
             ? ((isDay ? sunTimes.set : sunTimes.rise) / 2.4).toFixed(2)
             : `${Math.floor(isDay ? sunTimes.set : sunTimes.rise).toString().padStart(2, '0')}:${Math.floor(((isDay ? sunTimes.set : sunTimes.rise) % 1) * 60).toString().padStart(2, '0')}`}
         </span>
      </div>

      <div className="absolute top-[20%] right-[6%] sm:right-[8%] z-30 flex flex-col items-center opacity-70">
         <Thermometer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} style={weather.temp !== null ? { color: themeColor } : {}} />
         <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={weather.temp !== null ? { color: themeColor } : {}}>{weather.temp !== null ? `${Math.round(weather.temp)}°C` : '---'}</span>
      </div>

      <button onClick={toggleMic} className={`absolute bottom-[20%] right-[6%] sm:right-[8%] z-30 flex flex-col items-center opacity-70 hover:opacity-100 ${ui.textMuted} transition-opacity`}>
         {micEnabled ? <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} /> : <MicOff className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} />}
         <span className="text-[8px] sm:text-[9px]" style={micEnabled ? { color: themeColor } : {}}>{decibels !== null ? `${decibels}dB` : 'MIC'}</span>
      </button>

      <div className="absolute top-1/2 -translate-y-1/2 right-[2%] sm:right-[4%] z-30 flex flex-col items-center opacity-70">
         <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} style={hasGps ? { color: themeColor } : {}} />
         <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={hasGps ? { color: themeColor } : {}}>{hasGps ? 'GPS' : 'OFF'}</span>
      </div>
    </>
  );
};
