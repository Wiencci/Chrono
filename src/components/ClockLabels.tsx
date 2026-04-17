
import React from 'react';
import { AppMode, MONTHS, DAYS } from '../types';

interface ClockLabelsProps {
  appMode: AppMode;
  displayMode: 'decimal' | 'standard';
  themeColor: string;
  now: Date;
  decimalTime: { hours: number; minutes: number; seconds: number };
  decimalDate: { year: number; month: number; dayOfMonth: number; dayOfWeek: number };
  swTime: number;
  tmRemaining: number;
  speedData: any;
  btDevices: any[];
  decryptData: { chars: string[] };
  isSleeping: boolean;
  sleepStart: number | null;
  lastSleepDuration: number;
  daysSinceJ2000: number;
  audioLevels: number[];
  waterIntake: number;
  waterGoal: number;
  isScanningBt: boolean;
  heading: number | null;
  ui: any;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const pad3 = (n: number) => n.toString().padStart(3, '0');

const getDecimalHeading = (h: number | null) => {
  if (h === null) return null;
  return (h / 360) * 100;
};

const getCardinal = (h: number | null, mode: 'decimal' | 'standard') => {
  if (h === null) return null;
  const sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  if (mode === 'decimal') {
    return sectors[Math.round((h / 360) * 8) % 8];
  }
  return sectors[Math.round(h / 45) % 8];
};

export const ClockLabels: React.FC<ClockLabelsProps> = ({
  appMode,
  displayMode,
  themeColor,
  now,
  decimalTime,
  decimalDate,
  swTime,
  tmRemaining,
  speedData,
  btDevices,
  decryptData,
  isSleeping,
  sleepStart,
  lastSleepDuration,
  daysSinceJ2000,
  audioLevels,
  waterIntake,
  waterGoal,
  isScanningBt,
  heading,
  ui
}) => {
  return (
    <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none" viewBox="0 0 400 400">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <path id="topArc" d="M 125,200 A 75,75 0 0,1 275,200" />
        <path id="bottomArc" d="M 125,200 A 75,75 0 0,0 275,200" />
        <path id="topArcLabel" d="M 100,200 A 100,100 0 0,1 300,200" />
        <path id="bottomArcLabel" d="M 100,200 A 100,100 0 0,0 300,200" />
      </defs>

      <text fill="transparent" stroke={themeColor} strokeWidth="1.2" fontSize="26" fontWeight="bold" letterSpacing="3" style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}>
        <textPath href="#topArc" startOffset="50%" textAnchor="middle" dominantBaseline="alphabetic">
          {appMode === 'clock' && (
            <>
              {displayMode === 'decimal' ? pad(decimalTime.hours) : pad(now.getHours())}
              <tspan className="animate-pulse">:</tspan>
              {displayMode === 'decimal' ? pad(decimalTime.minutes) : pad(now.getMinutes())}
              <tspan className="animate-pulse">:</tspan>
              <tspan style={{ opacity: 0.4 }}>{displayMode === 'decimal' ? pad(decimalTime.seconds) : pad(now.getSeconds())}</tspan>
            </>
          )}
          {appMode === 'stopwatch' && (
            <>
              {pad(Math.floor(swTime / 60000))}
              <tspan>:</tspan>
              {pad(Math.floor((swTime % 60000) / 1000))}
              <tspan>.</tspan>
              <tspan stroke="#555" style={{ filter: 'none' }}>{pad3(swTime % 1000)}</tspan>
            </>
          )}
          {appMode === 'timer' && (
            <>
              {pad(Math.floor(tmRemaining / 60000))}
              <tspan className="animate-pulse">:</tspan>
              {pad(Math.floor((tmRemaining % 60000) / 1000))}
            </>
          )}
          {appMode === 'nav' && (heading !== null ? 
            (displayMode === 'decimal' ? `${getDecimalHeading(heading)?.toFixed(1)}°D` : `${Math.round(heading)}°`) 
            : 'SEARCHING')}
          {appMode === 'speed' && ((speedData.speed || 0) * 8.64).toFixed(1)}
          {appMode === 'scanner' && 'READY'}
          {appMode === 'radar' && btDevices.length.toString().padStart(2, '0')}
          {appMode === 'orbit' && 'ORBITAL'}
          {appMode === 'nav' && (heading !== null ? 
            getCardinal(heading, displayMode) : 
            (speedData.latitude !== null ? `${Math.abs(speedData.latitude).toFixed(4)}° ${speedData.latitude >= 0 ? 'N' : 'S'}` : 'SEARCHING...'))}
          {appMode === 'sonar' && 'LISTENING'}
          {appMode === 'decrypt' && decryptData.chars.slice(0, 6).join('')}
          {appMode === 'water' && 'INTAKE'}
          {appMode === 'sleep' && (isSleeping ? (
              <>
                {pad(Math.floor((Date.now() - (sleepStart || Date.now())) / 3600000))}
                <tspan className="animate-pulse">:</tspan>
                {pad(Math.floor(((Date.now() - (sleepStart || Date.now())) % 3600000) / 60000))}
                <tspan className="animate-pulse">:</tspan>
                <tspan stroke="#555" style={{ filter: 'none' }}>{pad(Math.floor(((Date.now() - (sleepStart || Date.now())) % 60000) / 1000))}</tspan>
              </>
            ) : lastSleepDuration > 0 ? (
              `${pad(Math.floor(lastSleepDuration / 3600000))}:${pad(Math.floor((lastSleepDuration % 3600000) / 60000))}`
            ) : 'RESTING')}
        </textPath>
      </text>

      {/* --- HUD Modular Data Blocks --- */}
      <g opacity="0.8">
        {/* Left HUD Block */}
        <rect x="80" y="180" width="35" height="40" fill="black" fillOpacity="0.4" stroke={ui.tickMuted} strokeWidth="0.5" />
        <text x="83" y="190" fill={themeColor} fontSize="5" fontWeight="bold">SENSORS</text>
        <text x="83" y="200" fill={ui.textMain} fontSize="8" fontWeight="bold">{Math.round(audioLevels[10]/2.55)}</text>
        <line x1="83" y1="205" x2="110" y2="205" stroke={ui.tickMuted} strokeWidth="0.3" />
        <rect x="83" y="210" width={(audioLevels[15]/255)*25} height="2" fill={themeColor} />

        {/* Right HUD Block */}
        <rect x="285" y="180" width="35" height="40" fill="black" fillOpacity="0.4" stroke={ui.tickMuted} strokeWidth="0.5" />
        <text x="288" y="190" fill={themeColor} fontSize="5" fontWeight="bold">TELEMETRY</text>
        <text x="288" y="200" fill={ui.textMain} fontSize="7" fontWeight="bold">{now.getSeconds()}SEC</text>
        <circle cx="302" cy="210" r="5" fill="none" stroke={ui.tickMuted} strokeWidth="0.3" strokeDasharray="1,1" className="animate-spin-slow" />
      </g>

      {/* Center Grid overlay */}
      <g opacity="0.05">
        <line x1="200" y1="130" x2="200" y2="270" stroke={themeColor} strokeWidth="0.5" />
        <line x1="130" y1="200" x2="270" y2="200" stroke={themeColor} strokeWidth="0.5" />
        <circle cx="200" cy="200" r="70" fill="none" stroke={themeColor} strokeWidth="0.5" />
      </g>

      <text fill="#888" fontSize="8" letterSpacing="4">
        <textPath href="#topArcLabel" startOffset="50%" textAnchor="middle" dominantBaseline="alphabetic">
          {appMode === 'clock' ? (displayMode === 'decimal' ? 'DECIMAL.TIME' : 'STANDARD.TIME') :
           appMode === 'stopwatch' ? 'CHRONOGRAPH' :
           appMode === 'timer' ? 'SYSTEM PURGE' :
           appMode === 'speed' ? 'VELOCITY KM/HD' :
           appMode === 'scanner' ? 'TARGET ACQUISITION' :
           appMode === 'orbit' ? 'HELIOCENTRIC' :
           appMode === 'nav' ? 'LATITUDE POS' :
           appMode === 'sonar' ? 'ACOUSTIC SENSOR' :
           appMode === 'decrypt' ? 'SYS INTRUSION' :
           appMode === 'water' ? 'H2O TRACKER' :
           appMode === 'sleep' ? 'BIOMETRIC SLEEP' :
           'DEVICES FOUND'}
        </textPath>
      </text>

      <text fill="transparent" stroke={themeColor} strokeWidth="1" fontSize="16" fontWeight="bold" letterSpacing="3" style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}>
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          {appMode === 'clock' && (
            displayMode === 'decimal' 
              ? `${MONTHS[decimalDate.month - 1]} • ${DAYS[decimalDate.dayOfWeek - 1]}` 
              : `${now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()} • ${now.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}`
          )}
          {appMode === 'speed' && `${(speedData.maxSpeed * 8.64).toFixed(1)} MAX`}
          {appMode === 'scanner' && 'IDLE'}
          {appMode === 'radar' && (isScanningBt ? 'SCANNING' : 'STANDBY')}
          {appMode === 'orbit' && `J2000 + ${Math.floor(daysSinceJ2000)}`}
          {appMode === 'nav' && (speedData.longitude !== null ? `${Math.abs(speedData.longitude).toFixed(4)}° ${speedData.longitude >= 0 ? 'E' : 'W'}` : 'SEARCHING...')}
          {appMode === 'sonar' && `${Math.round(100 - (audioLevels[0] || 0) / 255 * 100)}% CLR`}
          {appMode === 'decrypt' && decryptData.chars.slice(6, 12).join('')}
          {appMode === 'water' && `${waterIntake} / ${waterGoal} ML`}
          {appMode === 'sleep' && (isSleeping ? 'RECORDING' : 'READY')}
        </textPath>
      </text>

      <text fill="#888" fontSize="7" letterSpacing="4">
        <textPath href="#bottomArcLabel" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          {appMode === 'clock' ? (
            displayMode === 'decimal' 
              ? `LAYER ${pad(decimalDate.month)}  |  STATE ${pad(decimalDate.dayOfMonth)}  |  CYCLE ${decimalDate.dayOfWeek}/9` 
              : now.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()
          ) : appMode === 'speed' ? 'PEAK VELOCITY' :
              appMode === 'scanner' ? 'SYSTEM STATUS' :
              appMode === 'orbit' ? 'ABSOLUTE EPOCH' :
              appMode === 'nav' ? 'LONGITUDE POS' :
              appMode === 'sonar' ? 'SIGNAL TO NOISE' :
              appMode === 'decrypt' ? 'DECRYPTING...' :
              appMode === 'water' ? 'HYDRATION LEVEL' :
              appMode === 'sleep' ? 'SYSTEM STATUS' :
              appMode === 'radar' ? 'NETWORK STATUS' : ''}
        </textPath>
      </text>
    </svg>
  );
};
