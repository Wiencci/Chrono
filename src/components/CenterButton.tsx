
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
  const renderIcon = (isMinimized: boolean) => {
    const s = isMinimized ? "w-5 h-5 sm:w-6 sm:h-6" : "w-7 h-7 sm:w-9 sm:h-9";
    const ss = isMinimized ? "w-4 h-4 sm:w-5 sm:h-5" : "w-6 h-6 sm:w-8 sm:h-8";
    switch (appMode) {
      case 'clock':
        return isDay ? (
          <Sun className={`${s} text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:rotate-45 transition-transform duration-500`} />
        ) : (
          <Moon className={`${s} text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.4)] group-hover:-rotate-12 transition-transform duration-500`} />
        );
      case 'stopwatch':
      case 'timer':
        const running = appMode === 'stopwatch' ? swRunning : tmRunning;
        return running ? (
          <Square className={ss} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" />
        ) : (
          <Play className={`${s} ml-1`} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" />
        );
      case 'speed':
        return <Navigation className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})`, transform: `rotate(${speedData.heading || 0}deg)` }} fill="currentColor" />;
      case 'scanner':
        return <Scan className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'radar':
        return <Bluetooth className={`${s} ${isScanningBt ? 'animate-pulse' : ''}`} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'nav':
        return <Compass className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})`, transform: `rotate(${-(speedData.heading || 0)}deg)` }} />;
      case 'sonar':
        return <Radio className={`${s} animate-pulse`} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'decrypt':
        return <Hash className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'water':
        return <Droplet className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'sleep':
        return <Bed className={`${s} ${isSleeping ? 'animate-pulse' : ''}`} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'zen':
        return <Wind className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'level':
        return <Layers className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'steps':
        return <Footprints className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'altimeter':
        return <Mountain className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      case 'orbit':
        return <Orbit className={s} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />;
      default:
        return null;
    }
  };

  const isMinimized = ['zen', 'level', 'steps', 'nav', 'altimeter', 'scanner', 'radar', 'orbit', 'sonar', 'decrypt', 'water'].includes(appMode);

  return (
    <button 
      onClick={handleCenterClick} 
      className={`absolute z-40 rounded-full flex items-center justify-center ${ui.btnBg} border-2 ${ui.btnBorder} shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:scale-105 ${ui.btnHoverBorder} transition-all duration-300 group cursor-pointer
        ${isMinimized 
          ? 'w-10 h-10 sm:w-12 sm:h-12 translate-x-[80px] translate-y-[80px] sm:translate-x-[100px] sm:translate-y-[100px]' 
          : 'w-20 h-20 sm:w-28 sm:h-28'}`}
      title={appMode === 'clock' ? "Alternar Modo" : "Ação Central"}
    >
      <div className="relative flex items-center justify-center">
        <div className={`absolute rounded-full blur-xl animate-pulse ${isMinimized ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-12 h-12 sm:w-16 sm:h-16'}`} style={{ backgroundColor: `${themeColor}20` }}></div>
        {renderIcon(isMinimized)}
      </div>
      <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/10 scale-110 transition-all duration-300"></div>
    </button>
  );
};
