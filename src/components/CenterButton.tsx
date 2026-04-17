
import React from 'react';
import { Sun, Moon, Square, Play, Navigation, Scan, Bluetooth, Compass, Radio, Hash, Droplet, Bed, Wind, Layers, Footprints, Mountain, Orbit } from 'lucide-react';
import { AppMode } from '../types';

interface CenterButtonProps {
  appMode: AppMode;
  themeColor: string;
  isDay: boolean;
  swRunning: boolean;
  tmRunning: boolean;
  speedData: any;
  isScanningBt: boolean;
  isSleeping: boolean;
  ui: any;
  handleCenterClick: () => void;
}

export const CenterButton: React.FC<CenterButtonProps> = ({
  appMode,
  themeColor,
  isDay,
  swRunning,
  tmRunning,
  speedData,
  isScanningBt,
  isSleeping,
  ui,
  handleCenterClick
}) => {
  const renderIcon = () => {
    switch (appMode) {
      case 'clock':
        return isDay ? (
          <Sun className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:rotate-45 transition-transform duration-500" />
        ) : (
          <Moon className="w-7 h-7 sm:w-9 sm:h-9 text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.4)] group-hover:-rotate-12 transition-transform duration-500" />
        );
      case 'stopwatch':
      case 'timer':
        const running = appMode === 'stopwatch' ? swRunning : tmRunning;
        return running ? (
          <Square className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" />
        ) : (
          <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" />
        );
      case 'speed':
        return <Navigation className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})`, transform: `rotate(${speedData.heading || 0}deg)` }} fill="currentColor" />;
      case 'scanner':
        return <Scan className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'radar':
        return <Bluetooth className={`w-7 h-7 sm:w-9 sm:h-9 ${isScanningBt ? 'animate-pulse' : ''}`} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'nav':
        return <Compass className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})`, transform: `rotate(${-(speedData.heading || 0)}deg)` }} />;
      case 'sonar':
        return <Radio className="w-7 h-7 sm:w-9 sm:h-9 animate-pulse" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'decrypt':
        return <Hash className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'water':
        return <Droplet className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'sleep':
        return <Bed className={`w-7 h-7 sm:w-9 sm:h-9 ${isSleeping ? 'animate-pulse' : ''}`} style={{ color: isSleeping ? '#818cf8' : themeColor, filter: `drop-shadow(0 0 10px ${isSleeping ? '#818cf8' : themeColor})` }} />;
      case 'zen':
        return <Wind className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'level':
        return <Layers className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'steps':
        return <Footprints className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'altimeter':
        return <Mountain className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'orbit':
        return <Orbit className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      default:
        return null;
    }
  };

  return (
    <button 
      onClick={handleCenterClick} 
      className={`absolute z-40 w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center ${ui.btnBg} border-2 ${ui.btnBorder} shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:scale-105 ${ui.btnHoverBorder} transition-all duration-300 group cursor-pointer`}
      title={appMode === 'clock' ? "Alternar Modo" : "Ação Central"}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${themeColor}20` }}></div>
        {renderIcon()}
      </div>
      <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/10 scale-110 transition-all duration-300"></div>
    </button>
  );
};
