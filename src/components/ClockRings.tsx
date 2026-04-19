
import React from 'react';
import { AppMode, Theme } from '../types';

interface ClockRingsProps {
  appMode: AppMode;
  themeColor: string;
  ui: any;
  rings: {
    radiusHours: number;
    radiusMins: number;
    radiusSecs: number;
    circHours: number;
    circMins: number;
    circSecs: number;
    offsetHours: number;
    offsetMins: number;
    offsetSecs: number;
  };
  planets: {
    mercury: number;
    venus: number;
    earth: number;
  };
  daysSinceJ2000: number;
  speedData: any;
  audioLevels: number[];
  isScanningBt: boolean;
  waterIntake: number;
  waterGoal: number;
  isSleeping: boolean;
  isOverlayModule?: boolean;
}

export const ClockRings: React.FC<ClockRingsProps> = ({
  appMode,
  themeColor,
  ui,
  rings,
  planets,
  daysSinceJ2000,
  speedData,
  audioLevels,
  isScanningBt,
  waterIntake,
  waterGoal,
  isSleeping,
  isOverlayModule
}) => {
  const { radiusHours, radiusMins, radiusSecs, circHours, circMins, circSecs, offsetHours, offsetMins, offsetSecs } = rings;

  return (
    <svg className={`absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none transition-opacity duration-500 ${isOverlayModule ? 'opacity-20 scale-95' : 'opacity-100'}`} viewBox="0 0 400 400">
      {/* Outer Ring */}
      <circle cx="200" cy="200" r={radiusHours} fill="none" stroke={ui.ringBg} strokeWidth="8" style={{ transition: 'stroke 1s ease' }} />
      <circle cx="200" cy="200" r={radiusHours} fill="none" stroke={themeColor} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circHours} strokeDashoffset={offsetHours}
        style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}
        className={appMode === 'stopwatch' ? '' : 'transition-all duration-75 ease-linear'} />

      {/* Middle Ring */}
      <circle cx="200" cy="200" r={radiusMins} fill="none" stroke={ui.ringBg} strokeWidth="6" style={{ transition: 'stroke 1s ease' }} />
      <circle cx="200" cy="200" r={radiusMins} fill="none" stroke={themeColor} strokeWidth="6" strokeLinecap="round" strokeOpacity={appMode === 'decrypt' ? "0.2" : "0.7"}
        strokeDasharray={circMins} strokeDashoffset={offsetMins}
        style={{ filter: `drop-shadow(0 0 6px ${themeColor}60)` }}
        className={appMode === 'stopwatch' ? '' : 'transition-all duration-75 ease-linear'} />

      {/* Inner Ring */}
      {appMode !== 'timer' && (
        <>
          <circle cx="200" cy="200" r={radiusSecs} fill="none" stroke={ui.ringBg} strokeWidth="4" style={{ transition: 'stroke 1s ease' }} />
          <circle cx="200" cy="200" r={radiusSecs} fill="none" stroke={themeColor} strokeWidth="4" strokeLinecap="round" strokeOpacity={appMode === 'decrypt' ? "0.1" : "0.4"}
            strokeDasharray={circSecs} strokeDashoffset={offsetSecs}
            style={{ filter: `drop-shadow(0 0 4px ${themeColor}40)` }}
            className={appMode === 'stopwatch' ? '' : 'transition-all duration-75 ease-linear'} />
        </>
      )}

      {/* Planetary Orbits */}
      {appMode === 'orbit' && (
        <>
          <g style={{ transform: `rotate(${planets.mercury}deg)`, transformOrigin: '200px 200px' }}>
            <circle cx="320" cy="200" r="5" fill="#a8a8a8" style={{ filter: 'drop-shadow(0 0 5px #a8a8a8)' }} />
          </g>
          <g style={{ transform: `rotate(${planets.venus}deg)`, transformOrigin: '200px 200px' }}>
            <circle cx="340" cy="200" r="7" fill="#e2c47a" style={{ filter: 'drop-shadow(0 0 6px #e2c47a)' }} />
          </g>
          <g style={{ transform: `rotate(${planets.earth}deg)`, transformOrigin: '200px 200px' }}>
            <circle cx="360" cy="200" r="8" fill="#4b9cd3" style={{ filter: 'drop-shadow(0 0 8px #4b9cd3)' }} />
            <g style={{ transform: `rotate(${(daysSinceJ2000 / 27.322) * 360}deg)`, transformOrigin: '360px 200px' }}>
               <circle cx="373" cy="200" r="2.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 2px #ffffff)' }} />
            </g>
          </g>
        </>
      )}

      {/* Speedometer Needle */}
      {appMode === 'speed' && (
        <g 
          style={{ 
            transform: `rotate(${-45 + Math.min(((speedData.speed || 0) * 3.6) / 200, 1) * 270}deg)`, 
            transformOrigin: '200px 200px',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <polygon points="196,200 204,200 200,40" fill={themeColor} style={{ filter: `drop-shadow(0 0 8px ${themeColor})` }} opacity="0.8" />
          <circle cx="200" cy="200" r="8" fill="#111" stroke={themeColor} strokeWidth="2" />
        </g>
      )}

      {/* Sonar Audio Waveform */}
      {appMode === 'sonar' && (
         <g>
             {audioLevels.map((val, i) => {
                 const angle = (i / 60) * 360;
                 const rad = angle * (Math.PI / 180);
                 const barHeight = 10 + (val / 255) * 50;
                 const x1 = 200 + 130 * Math.cos(rad);
                 const y1 = 200 + 130 * Math.sin(rad);
                 const x2 = 200 + (130 + barHeight) * Math.cos(rad);
                 const y2 = 200 + (130 + barHeight) * Math.sin(rad);
                 return (
                     <line 
                         key={`sonar-${i}`} 
                         x1={x1} y1={y1} x2={x2} y2={y2} 
                         stroke={themeColor}
                         strokeWidth="3"
                         strokeLinecap="round"
                         style={{ filter: `drop-shadow(0 0 6px ${themeColor})`, transition: 'all 0.05s ease-out' }}
                     />
                 );
             })}
         </g>
      )}

      {/* Radar Sweep Arc */}
      {appMode === 'radar' && isScanningBt && (
        <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
          <path d="M 200,200 L 200,40 A 160,160 0 0,1 360,200 Z" fill={themeColor} opacity="0.1" />
          <line x1="200" y1="200" x2="200" y2="40" stroke={themeColor} strokeWidth="2" style={{ filter: `drop-shadow(0 0 8px ${themeColor})` }} />
        </g>
      )}
      
      {/* Scanner Focus Box */}
      {appMode === 'scanner' && (
        <g opacity="0.5" stroke={themeColor} strokeWidth="2" fill="none">
          <path d="M 120,100 L 100,100 L 100,120" />
          <path d="M 280,100 L 300,100 L 300,120" />
          <path d="M 120,300 L 100,300 L 100,280" />
          <path d="M 280,300 L 300,300 L 300,280" />
          <rect x="90" y="90" width="220" height="220" fill="none" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        </g>
      )}

      {/* Water Tracker Fill */}
      {appMode === 'water' && (
        <g>
          <circle cx="200" cy="200" r={radiusHours - 10} fill="none" stroke={themeColor} strokeWidth="20" opacity="0.1" />
          <circle cx="200" cy="200" r={radiusHours - 10} fill="none" stroke={themeColor} strokeWidth="20" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (radiusHours - 10)} 
            strokeDashoffset={2 * Math.PI * (radiusHours - 10) * (1 - Math.min(waterIntake / waterGoal, 1))}
            style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 10px ${themeColor})` }}
          />
        </g>
      )}

      {/* Sleep Breathing Ring */}
      {appMode === 'sleep' && isSleeping && (
        <circle cx="200" cy="200" r="150" fill="none" stroke={themeColor} strokeWidth="4" 
          className="animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" 
          opacity="0.3"
        />
      )}
    </svg>
  );
};
