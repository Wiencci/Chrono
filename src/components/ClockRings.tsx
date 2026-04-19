
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
  isOverlayModule?: boolean;
}

export const ClockRings: React.FC<ClockRingsProps> = ({
  appMode,
  themeColor,
  ui,
  rings,
  isOverlayModule
}) => {
  const { radiusHours, radiusMins, radiusSecs, circHours, circMins, circSecs, offsetHours, offsetMins, offsetSecs } = rings;

  return (
    <svg className={`absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none transition-transform duration-500 ${isOverlayModule ? 'scale-95' : 'scale-100'}`} viewBox="0 0 400 400">
      {/* Outer Ring - Clock Background */}
      <g className={`transition-opacity duration-700 ${isOverlayModule ? 'opacity-20' : 'opacity-100'}`}>
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
      </g>
    </svg>
  );
};
