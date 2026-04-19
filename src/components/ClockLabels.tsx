
import React from 'react';
import { AppMode, MONTHS, DAYS } from '../types';
import { formatDecimalDuration, formatDecimalDegrees, toDecimalTime } from '../lib/decimalLogic';

interface ClockLabelsProps {
  appMode: AppMode;
  displayMode: 'decimal' | 'standard';
  themeColor: string;
  now: Date;
  decimalTime: { hours: number; minutes: number; seconds: number };
  decimalDate: { year: number; month: number; dayOfMonth: number; dayOfWeek: number };
  ui: any;
  isLightMode: boolean;
  isOverlayModule?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const pad3 = (n: number) => n.toString().padStart(3, '0');

const getDecimalHeading = (h: number | null) => {
  if (h === null) return null;
  return formatDecimalDegrees(h);
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
  ui,
  isLightMode,
  isOverlayModule
}) => {
  return (
    <svg className={`absolute inset-0 w-full h-full z-30 pointer-events-none transition-all duration-500 ${isOverlayModule ? 'scale-95' : 'scale-100'}`} viewBox="0 0 400 400">
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

      {/* CLOCK CORE LABELS - Dimmable */}
      <g className={`transition-opacity duration-700 ${isOverlayModule ? 'opacity-10 blur-[1px]' : 'opacity-100'}`}>
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
          </textPath>
        </text>

        <text fill={isLightMode ? "#888" : "#aaa"} fontSize="8" letterSpacing="4">
          <textPath href="#topArcLabel" startOffset="50%" textAnchor="middle" dominantBaseline="alphabetic">
            {appMode === 'clock' && (displayMode === 'decimal' ? 'DECIMAL.TIME' : 'STANDARD.TIME')}
          </textPath>
        </text>

        <text fill="transparent" stroke={themeColor} strokeWidth="1" fontSize="16" fontWeight="bold" letterSpacing="3" style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}>
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
            {appMode === 'clock' && (
              displayMode === 'decimal' 
                ? `${MONTHS[decimalDate.month - 1]} • ${DAYS[decimalDate.dayOfWeek - 1]}` 
                : `${now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()} • ${now.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}`
            )}
          </textPath>
        </text>

        <text fill={isLightMode ? "#888" : "#999"} fontSize="7" letterSpacing="4">
          <textPath href="#bottomArcLabel" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
            {appMode === 'clock' ? (
              displayMode === 'decimal' 
                ? `LAYER ${pad(decimalDate.month)}  |  STATE ${pad(decimalDate.dayOfMonth)}  |  CYCLE ${decimalDate.dayOfWeek}/9` 
                : now.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()
            ) : ''}
          </textPath>
        </text>
      </g>

      {/* --- HUD Modular Data Blocks --- (NOT DIMMED) */}
      <g opacity="0.9">
        {/* Right HUD Block - Refined Tactical Layout */}
        <path 
          d="M 285,180 H 320 V 220 H 310" 
          fill="none" 
          stroke={ui.tickMuted} 
          strokeWidth="0.5" 
          opacity="0.6"
        />
        <text x="288" y="190" fill={ui.effectiveTheme} fontSize="6" fontWeight="bold" style={{ letterSpacing: '1px' }}>TELEMETRY</text>
        <text x="288" y="202" fill={isLightMode ? "#09090b" : "#f4f4f5"} fontSize="10" fontWeight="bold">
          {displayMode === 'decimal' ? toDecimalTime(now).seconds : now.getSeconds()}SEC
        </text>
        <circle cx="304" cy="212" r="4" fill="none" stroke={ui.tickMuted} strokeWidth="0.5" strokeDasharray="1,2" className="animate-[spin_4s_linear_infinite]" />
      </g>

      {/* Center Grid overlay */}
      <g opacity={isOverlayModule ? 0.2 : 0.05}>
        <line x1="200" y1="130" x2="200" y2="270" stroke={themeColor} strokeWidth="0.5" />
        <line x1="130" y1="200" x2="270" y2="200" stroke={themeColor} strokeWidth="0.5" />
        <circle cx="200" cy="200" r="70" fill="none" stroke={themeColor} strokeWidth="0.5" />
      </g>
    </svg>
  );
};
