import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Battery, Activity, Clock, RefreshCw } from 'lucide-react';

// --- Logic ---

const DAYS = ['Boot', 'Sync', 'Pulse', 'Link', 'Core', 'Drift', 'Cache', 'Loop', 'Null'];
const MONTHS = ['Kernel', 'Input', 'Parse', 'Compile', 'Build', 'Flux', 'Mesh', 'Signal', 'Archive', 'Void'];

const THEMES = [
  { id: 'neon', hex: '#ccff00', name: 'NEON' },
  { id: 'amber', hex: '#ffb000', name: 'AMBER' },
  { id: 'cyan', hex: '#00e5ff', name: 'CYAN' },
  { id: 'crimson', hex: '#ff003c', name: 'CRIMSON' }
];

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDecimalDate(date: Date) {
  const year = date.getFullYear();
  const dayOfYear = getDayOfYear(date);
  const leap = isLeapYear(year);

  const monthLengths = [36, 37, 36, 37, 36, 37, 36, 37, 36, leap ? 38 : 37];

  let currentDay = dayOfYear;
  let month = 1;

  for (let i = 0; i < 10; i++) {
    if (currentDay <= monthLengths[i]) {
      month = i + 1;
      break;
    }
    currentDay -= monthLengths[i];
  }

  const dayOfMonth = currentDay;
  const dayOfWeek = ((dayOfYear - 1) % 9) + 1;

  return { year, month, dayOfMonth, dayOfWeek, dayOfYear };
}

function getDecimalTime(date: Date) {
  const msSinceMidnight =
    date.getHours() * 3600000 +
    date.getMinutes() * 60000 +
    date.getSeconds() * 1000 +
    date.getMilliseconds();

  const totalDecimalSeconds = msSinceMidnight / 864;

  const hours = Math.floor(totalDecimalSeconds / 10000);
  const minutes = Math.floor((totalDecimalSeconds % 10000) / 100);
  const seconds = Math.floor(totalDecimalSeconds % 100);

  return { hours, minutes, seconds, totalDecimalSeconds };
}

export default function App() {
  const [now, setNow] = useState(new Date());
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [displayMode, setDisplayMode] = useState<'decimal' | 'standard'>('decimal');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      setNow(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    updateTime();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Max rotation of 15 degrees
    setTilt({ x: -(y / rect.height) * 30, y: (x / rect.width) * 30 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleMode = () => {
    setDisplayMode(prev => prev === 'decimal' ? 'standard' : 'decimal');
  };

  const decimalTime = getDecimalTime(now);
  const decimalDate = getDecimalDate(now);

  // 0 to 10 hours. Day is 2.5 to 7.5 (equivalent to 6:00 to 18:00 standard)
  const isDay = decimalTime.hours >= 2.5 && decimalTime.hours < 7.5;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const themeColor = activeTheme.hex;

  // SVG Ring calculations
  const radiusHours = 160;
  const radiusMins = 140;
  const radiusSecs = 120;

  const circHours = 2 * Math.PI * radiusHours;
  const circMins = 2 * Math.PI * radiusMins;
  const circSecs = 2 * Math.PI * radiusSecs;

  // Calculate offsets based on mode
  let offsetHours, offsetMins, offsetSecs;
  
  if (displayMode === 'decimal') {
    offsetHours = circHours - (decimalTime.totalDecimalSeconds / 100000) * circHours;
    offsetMins = circMins - ((decimalTime.totalDecimalSeconds % 10000) / 10000) * circMins;
    offsetSecs = circSecs - ((decimalTime.totalDecimalSeconds % 100) / 100) * circSecs;
  } else {
    const msSinceMidnight = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds();
    offsetHours = circHours - (msSinceMidnight / 86400000) * circHours;
    offsetMins = circMins - ((msSinceMidnight % 3600000) / 3600000) * circMins;
    offsetSecs = circSecs - ((msSinceMidnight % 60000) / 60000) * circSecs;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-['Share_Tech_Mono',_monospace] selection:bg-white selection:text-black p-4 overflow-hidden">
      
      {/* Header */}
      <div className="text-center mb-8 max-w-md z-10">
        <h1 className="text-3xl font-bold mb-2 text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          DECIMAL<span style={{ color: themeColor, textShadow: `0 0 15px ${themeColor}` }}>CHRONO</span>
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-[0.3em]">Sistema de Tempo Alternativo</p>
      </div>

      {/* Theme Selector */}
      <div className="absolute top-6 right-6 flex space-x-3 z-20">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme)}
            className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${activeTheme.id === theme.id ? 'scale-125' : 'scale-100 opacity-50 hover:opacity-100'}`}
            style={{ 
              backgroundColor: theme.hex, 
              borderColor: activeTheme.id === theme.id ? '#fff' : 'transparent',
              boxShadow: activeTheme.id === theme.id ? `0 0 15px ${theme.hex}` : 'none'
            }}
            title={theme.name}
          />
        ))}
      </div>

      {/* Main Clock Container with 3D Tilt */}
      <div 
        className="relative perspective-[1000px] z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={clockRef}
          className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border-[14px] border-[#111] bg-[#0a0a0a] flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ 
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 30px ${themeColor}20`
          }}
        >
          
          {/* Background texture */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-[#0a0a0a] to-[#000] rounded-full"></div>

          {/* Outer tick marks */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 400 400">
            {Array.from({ length: displayMode === 'decimal' ? 100 : 60 }).map((_, i) => {
              const total = displayMode === 'decimal' ? 100 : 60;
              const angle = (i / total) * 360;
              const rad = (angle - 90) * (Math.PI / 180);
              const isMajor = displayMode === 'decimal' ? i % 10 === 0 : i % 5 === 0;
              const r1 = isMajor ? 178 : 184;
              const r2 = 190;
              const x1 = 200 + r1 * Math.cos(rad);
              const y1 = 200 + r1 * Math.sin(rad);
              const x2 = 200 + r2 * Math.cos(rad);
              const y2 = 200 + r2 * Math.sin(rad);
              return (
                <line 
                  key={i} 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke={isMajor ? themeColor : "#222"} 
                  strokeWidth={isMajor ? "3" : "1.5"} 
                  style={isMajor ? { filter: `drop-shadow(0 0 4px ${themeColor})` } : {}}
                />
              );
            })}
          </svg>

          {/* Rings */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none" viewBox="0 0 400 400">
            {/* Hours */}
            <circle cx="200" cy="200" r={radiusHours} fill="none" stroke="#151515" strokeWidth="8" />
            <circle cx="200" cy="200" r={radiusHours} fill="none" stroke={themeColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circHours} strokeDashoffset={offsetHours}
              style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}
              className="transition-all duration-75 ease-linear" />

            {/* Minutes */}
            <circle cx="200" cy="200" r={radiusMins} fill="none" stroke="#151515" strokeWidth="6" />
            <circle cx="200" cy="200" r={radiusMins} fill="none" stroke={themeColor} strokeWidth="6" strokeLinecap="round" strokeOpacity="0.7"
              strokeDasharray={circMins} strokeDashoffset={offsetMins}
              style={{ filter: `drop-shadow(0 0 6px ${themeColor}60)` }}
              className="transition-all duration-75 ease-linear" />

            {/* Seconds */}
            <circle cx="200" cy="200" r={radiusSecs} fill="none" stroke="#151515" strokeWidth="4" />
            <circle cx="200" cy="200" r={radiusSecs} fill="none" stroke={themeColor} strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4"
              strokeDasharray={circSecs} strokeDashoffset={offsetSecs}
              style={{ filter: `drop-shadow(0 0 4px ${themeColor}40)` }}
              className="transition-all duration-75 ease-linear" />
          </svg>

          {/* Hour Numbers */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {Array.from({ length: displayMode === 'decimal' ? 10 : 12 }).map((_, i) => {
              const total = displayMode === 'decimal' ? 10 : 12;
              const angle = (i / total) * 360 - 90;
              const rad = angle * (Math.PI / 180);
              const left = `calc(50% + ${Math.cos(rad) * 41}%)`;
              const top = `calc(50% + ${Math.sin(rad) * 41}%)`;
              
              let displayNum = i;
              if (displayMode === 'decimal' && i === 0) displayNum = 10;
              if (displayMode === 'standard' && i === 0) displayNum = 12;
              
              return (
                <div
                  key={i}
                  className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center text-[11px] font-bold text-neutral-600"
                  style={{ left, top }}
                >
                  {displayNum}
                </div>
              );
            })}
          </div>

          {/* Center Celestial Body (Clickable to toggle mode) */}
          <button 
            onClick={toggleMode}
            className="absolute z-40 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center bg-[#0f0f0f] border-2 border-[#1a1a1a] shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:scale-105 hover:border-[#333] transition-all duration-300 group cursor-pointer"
            title="Alternar Modo de Tempo"
          >
             {isDay ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                  <Sun size={36} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:rotate-45 transition-transform duration-500" />
               </div>
             ) : (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                  <Moon size={36} className="text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.4)] group-hover:-rotate-12 transition-transform duration-500" />
               </div>
             )}
             
             {/* Hover indicator */}
             <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/10 scale-110 transition-all duration-300"></div>
          </button>

          {/* Top Text: Time */}
          <div className="absolute top-[16%] z-30 flex flex-col items-center bg-[#0a0a0a]/90 backdrop-blur-md px-5 py-1.5 rounded-lg border border-[#222] shadow-lg">
            <div className="text-[9px] text-neutral-500 mb-0.5 tracking-[0.2em]">
              {displayMode === 'decimal' ? 'DECIMAL.TIME' : 'STANDARD.TIME'}
            </div>
            <div className="flex items-baseline space-x-1 text-white">
              <span className="text-3xl sm:text-4xl font-bold tracking-wider" style={{ textShadow: `0 0 10px ${themeColor}40` }}>
                {displayMode === 'decimal' ? pad(decimalTime.hours) : pad(now.getHours())}
              </span>
              <span className="animate-pulse" style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}` }}>:</span>
              <span className="text-3xl sm:text-4xl font-bold tracking-wider" style={{ textShadow: `0 0 10px ${themeColor}40` }}>
                {displayMode === 'decimal' ? pad(decimalTime.minutes) : pad(now.getMinutes())}
              </span>
              <span className="animate-pulse" style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}` }}>:</span>
              <span className="text-xl sm:text-2xl font-bold text-neutral-400">
                {displayMode === 'decimal' ? pad(decimalTime.seconds) : pad(now.getSeconds())}
              </span>
            </div>
          </div>

          {/* Bottom Text: Date & Lore */}
          <div className="absolute bottom-[14%] z-30 flex flex-col items-center w-full px-12">
            
            {displayMode === 'decimal' ? (
              <>
                <div className="flex justify-between w-full text-[9px] text-neutral-500 mb-1 px-2 tracking-[0.1em]">
                  <span>LAYER (MÊS)</span>
                  <span>STATE (DIA)</span>
                </div>
                <div className="flex justify-between items-center w-full bg-[#0a0a0a]/90 backdrop-blur-md border border-[#222] rounded-lg px-4 py-2 shadow-lg">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-neutral-400">{pad(decimalDate.month)}</span>
                    <span className="text-sm sm:text-base font-bold text-white uppercase" style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}60` }}>
                      {MONTHS[decimalDate.month - 1]}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-1 mx-2">
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor, boxShadow: `0 0 5px ${themeColor}` }}></div>
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor, boxShadow: `0 0 5px ${themeColor}` }}></div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-neutral-400">{pad(decimalDate.dayOfMonth)}</span>
                    <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                      {DAYS[decimalDate.dayOfWeek - 1]}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                  <Activity size={12} />
                  <span>Cycle {decimalDate.dayOfWeek}/9</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center bg-[#0a0a0a]/90 backdrop-blur-md border border-[#222] rounded-lg px-6 py-3 shadow-lg">
                <span className="text-sm text-neutral-400 tracking-widest mb-1">
                  {now.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                </span>
                <span className="text-xl font-bold text-white tracking-widest" style={{ textShadow: `0 0 10px ${themeColor}40` }}>
                  {now.toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

          </div>

          {/* Left/Right decorative elements */}
          <div className="absolute left-[6%] z-30 flex flex-col items-center opacity-60">
             <Battery size={18} className="text-neutral-400 mb-1" />
             <span className="text-[9px]" style={{ color: themeColor }}>100%</span>
          </div>
          <div className="absolute right-[6%] z-30 flex flex-col items-center opacity-60">
             <span className="text-[11px] font-bold text-neutral-400 mb-1 tracking-widest">SYS</span>
             <span className="text-[9px]" style={{ color: themeColor }}>ON</span>
          </div>

        </div>
      </div>
      
      {/* Footer Legend */}
      <div className="mt-12 flex flex-col items-center space-y-4 z-10">
        <button 
          onClick={toggleMode}
          className="flex items-center space-x-2 text-neutral-400 text-xs uppercase tracking-[0.2em] border border-neutral-800 px-5 py-2.5 rounded-full bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={displayMode === 'standard' ? 'animate-spin-slow' : ''} />
          <span>Modo Atual: <strong style={{ color: themeColor }}>{displayMode === 'decimal' ? 'Decimal' : 'Padrão'}</strong></span>
        </button>
        
        {displayMode === 'decimal' && (
          <div className="text-neutral-600 text-[11px] max-w-sm text-center leading-relaxed border-t border-neutral-800 pt-4">
            <span className="text-neutral-400">ARQUITETURA DE TEMPO</span><br/>
            1 Dia = 10h • 1h = 100m • 1m = 100s<br/>
            Ano = 10 Layers (Meses) • Ciclo = 9 States (Dias)
          </div>
        )}
      </div>
    </div>
  );
}
