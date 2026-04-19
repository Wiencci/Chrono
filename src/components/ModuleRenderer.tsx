
import React from 'react';
import { AppMode } from '../types';
import { ZenModule } from './ZenModule';
import { LevelModule } from './LevelModule';
import { PedometerModule } from './PedometerModule';
import { WaypointModule } from './WaypointModule';
import { AltimeterModule } from './AltimeterModule';
import { EMFModule } from './EMFModule';
import { SeismoModule } from './SeismoModule';
import { LumenModule } from './LumenModule';
import { NFCModule } from './NFCModule';
import { CalendarModule } from './CalendarModule';
import { AstroModule } from './AstroModule';
import { AnalogDecimalModule } from './AnalogDecimalModule';
import { motion } from 'motion/react';
import { formatDecimalDuration, toDecimalSpeed, formatDecimalDegrees } from '../lib/decimalLogic';

const ModuleLayout: React.FC<{
  title: string;
  subtitle?: string;
  themeColor: string;
  ui: any;
  children: React.ReactNode;
}> = ({ title, subtitle, themeColor, ui, children }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto"
  >
    {/* Standard Tactical Border */}
    <div className={`absolute inset-4 rounded-full border ${ui?.borderClock || 'border-white/5'} pointer-events-none`} />
    <div className={`absolute inset-8 rounded-full border ${ui?.borderClock || 'border-white/5'} pointer-events-none`} />
    <div className={`absolute inset-[15%] rounded-full border border-dashed ${ui?.borderClock || 'border-white/5'} animate-[spin_120s_linear_infinite] pointer-events-none`} />

    {/* Circular Text Header */}
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
         <defs>
           <path id="moduleTitlePath" d="M 45,200 A 155,155 0 0,1 355,200" />
           <path id="moduleSubtitlePath" d="M 45,200 A 155,155 0 0,0 355,200" />
         </defs>
         {/* Top Arc - Title */}
         <text fill="currentColor" fontSize="13" fontWeight="900" letterSpacing="6" style={{ color: themeColor, filter: `drop-shadow(0 0 8px ${themeColor}80)` }}>
           <textPath href="#moduleTitlePath" startOffset="50%" textAnchor="middle" dominantBaseline="alphabetic">
             {title.toUpperCase()}
           </textPath>
         </text>
         {/* Bottom Arc - Subtitle */}
         {subtitle && (
           <text fill="currentColor" className={ui?.textMuted || 'text-white/60'} fontSize="9" fontWeight="bold" letterSpacing="4">
             <textPath href="#moduleSubtitlePath" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
               {subtitle.toUpperCase()}
             </textPath>
           </text>
         )}
      </svg>
    </div>

    {/* Content Area */}
    <div className="relative z-10 w-full h-full flex items-center justify-center p-8 sm:p-16 pointer-events-auto overflow-hidden">
      <div className="flex flex-col items-center justify-center scale-[0.85] sm:scale-95 mt-2">
        {children}
      </div>
    </div>
  </motion.div>
);

const OrbitOverlay = ({ planets, daysSinceJ2000, themeColor, displayMode, ui }: any) => (
  <ModuleLayout title="Planetary Monitor" subtitle="Solar Orbital Sync" themeColor={themeColor} ui={ui}>
    <div className="flex flex-col items-center justify-center p-4 w-full h-full pb-8">
      {/* Container Tático Restrito para SVG */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 400 400">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb000" stopOpacity="1" />
              <stop offset="60%" stopColor="#ffb000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffb000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit Rings */}
          <circle cx="200" cy="200" r="60" fill="none" stroke={ui?.textMain || "white"} strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />
          <circle cx="200" cy="200" r="100" fill="none" stroke={ui?.textMain || "white"} strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />
          <circle cx="200" cy="200" r="140" fill="none" stroke={ui?.textMain || "white"} strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />

          {/* The Sun */}
          <circle cx="200" cy="200" r="25" fill="url(#sunGlow)" className="animate-[pulse_4s_ease-in-out_infinite]" />
          <circle cx="200" cy="200" r="10" fill={ui?.textMain || "#fff"} opacity="0.8" style={{ filter: 'drop-shadow(0 0 10px #ffb000)' }} />

          {/* Mercury */}
          <g style={{ transform: `rotate(${planets.mercury}deg)`, transformOrigin: '200px 200px' }}>
            <circle cx="260" cy="200" r="3" fill="#a8a8a8" style={{ filter: 'drop-shadow(0 0 4px #a8a8a8)' }} />
            <line x1="200" y1="200" x2="260" y2="200" stroke={themeColor} strokeWidth="0.5" opacity="0.2" />
          </g>

          {/* Venus */}
          <g style={{ transform: `rotate(${planets.venus}deg)`, transformOrigin: '200px 200px' }}>
            <circle cx="300" cy="200" r="5" fill="#e2c47a" style={{ filter: 'drop-shadow(0 0 6px #e2c47a)' }} />
            <line x1="200" y1="200" x2="300" y2="200" stroke={themeColor} strokeWidth="0.5" opacity="0.2" />
          </g>

          {/* Earth & Moon */}
          <g style={{ transform: `rotate(${planets.earth}deg)`, transformOrigin: '200px 200px' }}>
            <circle cx="340" cy="200" r="6" fill="#4b9cd3" style={{ filter: 'drop-shadow(0 0 8px #4b9cd3)' }} />
            <line x1="200" y1="200" x2="340" y2="200" stroke={themeColor} strokeWidth="0.5" opacity="0.2" />
            
            <g style={{ transform: `rotate(${(daysSinceJ2000 / 27.322) * 360}deg)`, transformOrigin: '340px 200px' }}>
               <circle cx="352" cy="200" r="1.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 2px #ffffff)' }} />
            </g>
          </g>
        </svg>
      </div>
      
      {/* HUD Telemetry Data */}
      <div className="flex flex-col items-center mt-6">
        <span className={`text-[7px] uppercase tracking-widest opacity-80 mb-1 ${ui?.textMuted || ''}`}>Orbital Resonance</span>
        <div className="text-[10px] font-mono font-bold tracking-[0.2em]" style={{ color: themeColor }}>
          {displayMode === 'decimal' ? `${formatDecimalDegrees(planets.earth)}` : `${Math.round(planets.earth)}°`} / TERRA
        </div>
      </div>
    </div>
  </ModuleLayout>
);

const SonarOverlay = ({ audioLevels, themeColor, ui }: any) => (
  <ModuleLayout title="Sonar Feedback" subtitle="Acoustic Wave Analysis" themeColor={themeColor} ui={ui}>
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 400 400">
      {audioLevels.slice(0, 60).map((val: any, i: number) => {
          const angle = (i / 60) * 360;
          const rad = angle * (Math.PI / 180);
          const barHeight = 10 + (val / 255) * 60;
          const x1 = 200 + 100 * Math.cos(rad);
          const y1 = 200 + 100 * Math.sin(rad);
          const x2 = 200 + (100 + barHeight) * Math.cos(rad);
          const y2 = 200 + (100 + barHeight) * Math.sin(rad);
          return (
              <line 
                  key={`sonar-${i}`} 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke={themeColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 8px ${themeColor})`, transition: 'all 0.05s ease-out' }}
              />
          );
      })}
    </svg>
  </ModuleLayout>
);

const RadarOverlay = ({ isScanningBt, themeColor, scanResults, ui }: any) => (
  <ModuleLayout title="BT Radar Scan" subtitle="Device Proximity Detection" themeColor={themeColor} ui={ui}>
    <div className="absolute inset-0 p-8 flex flex-col items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 opacity-40" viewBox="0 0 400 400">
         <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
          <path d="M 200,200 L 200,40 A 160,160 0 0,1 360,200 Z" fill={themeColor} opacity="0.3" />
          <line x1="200" y1="200" x2="200" y2="40" stroke={themeColor} strokeWidth="3" style={{ filter: `drop-shadow(0 0 10px ${themeColor})` }} />
        </g>
      </svg>
      <div className="relative z-10 flex flex-col items-center w-full mt-4">
         {scanResults && scanResults.length > 0 ? (
           <div className="grid grid-cols-2 gap-3 w-full max-w-[240px]">
              {scanResults.slice(0, 4).map((dev: any, i: number) => (
                <div key={i} className={`bg-black/60 border ${ui?.borderClock || 'border-white/10'} p-2 rounded-lg backdrop-blur-md`}>
                  <p className={`text-[6px] ${ui?.textMain || 'text-white'} opacity-60 uppercase tracking-widest font-bold`}>UID {dev.id?.slice(-4)}</p>
                  <p className={`text-[9px] font-black truncate ${ui?.textMain || 'text-white'}`} style={{ textShadow: `0 0 10px ${themeColor}` }}>{dev.name || 'UNKNOWN DEVICE'}</p>
                </div>
              ))}
           </div>
         ) : (
           <div className={`text-[8px] font-bold uppercase tracking-[0.3em] opacity-60 animate-pulse ${ui?.textMain || 'text-white'}`}>Searching Frequencies...</div>
         )}
      </div>
    </div>
  </ModuleLayout>
);

const ScannerOverlay = ({ themeColor, ui }: any) => (
  <ModuleLayout title="Signal Scanner" subtitle="Spectrum Analysis Node" themeColor={themeColor} ui={ui}>
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <g opacity="0.8" stroke={themeColor} strokeWidth="2" fill="none">
          <circle cx="200" cy="200" r="160" strokeDasharray="4 8" opacity="0.3" stroke={ui?.borderClock || "#333"} />
          <circle cx="200" cy="200" r="100" strokeDasharray="2 4" opacity="0.2" stroke={ui?.borderClock || "#333"} />
          <circle cx="200" cy="200" r="40" opacity="0.1" stroke={ui?.borderClock || "#333"} />
          <line x1="200" y1="20" x2="200" y2="380" strokeWidth="0.5" opacity="0.2" stroke={ui?.borderClock || "#333"} />
          <line x1="20" y1="200" x2="380" y2="200" strokeWidth="0.5" opacity="0.2" stroke={ui?.borderClock || "#333"} />
          
          <g className="animate-[spin_4s_linear_infinite] transform-origin-[200px_200px]" style={{ transformOrigin: '200px 200px' }}>
            <path d="M 200,200 L 200,40 A 160,160 0 0,1 313,87 Z" fill={themeColor} opacity="0.1" stroke="none" />
            <line x1="200" y1="200" x2="200" y2="40" strokeWidth="2" style={{ filter: `drop-shadow(0 0 8px ${themeColor})` }} />
            <circle cx="200" cy="100" r="2" fill={themeColor} style={{ filter: `drop-shadow(0 0 4px ${themeColor})` }} />
            <circle cx="240" cy="120" r="1.5" fill={themeColor} opacity="0.5" />
          </g>
        </g>
      </svg>
      <div className="absolute font-black tracking-[0.5em] text-[8px] uppercase backdrop-blur-md px-3 py-1 rounded-full border border-white/5" style={{ color: themeColor, textShadow: `0 0 5px ${themeColor}80` }}>
        SCANNING SECTOR
      </div>
    </div>
  </ModuleLayout>
);

const DecryptOverlay = ({ decryptData, themeColor, ui }: any) => {
  const radius = 120;
  return (
    <ModuleLayout title="Neural Decrypt" subtitle="Vector Code Extraction" themeColor={themeColor} ui={ui}>
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r={radius} fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="2" opacity="0.3" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r={radius + 15} fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.2" />
          <circle 
            cx="200" cy="200" r={radius} fill="none" stroke={themeColor} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * radius}
            strokeDashoffset={(2 * Math.PI * radius) * (1 - (decryptData.progress || 0))}
            style={{ transition: 'stroke-dashoffset 0.1s linear', filter: `drop-shadow(0 0 8px ${themeColor})` }}
            transform="rotate(-90 200 200)"
          />
          <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
            {decryptData.chars.slice(0, 16).map((c: string, i: number) => {
              const angle = (i / 16) * 360;
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 200 + (radius - 25) * Math.cos(rad);
              const y = 200 + (radius - 25) * Math.sin(rad);
              return (
                <text key={i} x={x} y={y} fill={themeColor} fontSize="14" fontWeight="black" textAnchor="middle" dominantBaseline="middle" className="animate-pulse" style={{ filter: `drop-shadow(0 0 5px ${themeColor})` }} transform={`rotate(${angle}, ${x}, ${y})`}>{c}</text>
              );
            })}
          </g>
        </svg>
        <div className="flex flex-col items-center z-10 bg-black/40 p-4 rounded-full backdrop-blur-md border border-white/5 shadow-2xl">
          <span className={`text-[6px] font-black tracking-[0.4em] ${ui?.textMuted || 'text-white opacity-40'} uppercase mb-1`}>Decrypt Node</span>
          <span className="text-3xl font-mono font-black" style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}80` }}>{Math.round((decryptData.progress || 0) * 100)}%</span>
        </div>
      </div>
    </ModuleLayout>
  );
};

const StopwatchOverlay = ({ swTime, displayMode, themeColor, ui }: any) => {
  const timeStr = displayMode === 'decimal' 
    ? formatDecimalDuration(swTime, true)
    : (() => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const pad3 = (n: number) => n.toString().padStart(3, '0');
        return `${pad(Math.floor(swTime / 60000))}:${pad(Math.floor((swTime % 60000) / 1000))}.${pad3(swTime % 1000)}`;
      })();

  const msProgress = (swTime % 1000) / 1000;
  const secProgress = ((swTime / 1000) % 60) / 60;

  return (
    <ModuleLayout title="Chronometer" subtitle="Precision Timer Link" themeColor={themeColor} ui={ui}>
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mt-4">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="160" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" strokeDasharray="1 6" opacity="0.5" />
          
          <circle cx="200" cy="200" r="140" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="4" opacity="0.1" />
          <circle 
            cx="200" cy="200" r="140" fill="none" stroke={themeColor} strokeWidth="4" strokeLinecap="round" opacity="0.5"
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={(2 * Math.PI * 140) * (1 - secProgress)}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />

          <circle cx="200" cy="200" r="120" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="2" opacity="0.1" />
          <circle 
            cx="200" cy="200" r="120" fill="none" stroke={themeColor} strokeWidth="2" strokeLinecap="round" opacity="0.9"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={(2 * Math.PI * 120) * (1 - msProgress)}
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 5px ${themeColor})` }}
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <div className={`text-4xl sm:text-5xl font-mono font-black tracking-tighter ${ui?.textMain || 'text-[#fff]'} brightness-125 tabular-nums`} style={{ textShadow: `0 0 10px ${themeColor}40` }}>
            {timeStr}
          </div>
          <span className={`text-[7px] uppercase font-black tracking-[0.4em] ${ui?.textMuted || 'text-white opacity-40'} mt-4`}>CHRONO CORE</span>
        </div>
      </div>
    </ModuleLayout>
  );
};

const TimerOverlay = ({ tmRemaining, tmDuration, displayMode, themeColor, ui }: any) => {
  const timeStr = displayMode === 'decimal'
    ? formatDecimalDuration(tmRemaining)
    : (() => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(Math.floor(tmRemaining / 60000))}:${pad(Math.floor((tmRemaining % 60000) / 1000))}`;
      })();

  const progress = tmDuration > 0 ? (tmDuration - tmRemaining) / tmDuration : 0;

  return (
    <ModuleLayout title="Purge Countdown" subtitle="System Critical Timer" themeColor={themeColor} ui={ui}>
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mt-4">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="150" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="2" opacity="0.2" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="130" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="12" opacity="0.1" />
          <circle 
            cx="200" cy="200" r="130" fill="none" stroke={themeColor} strokeWidth="12" strokeLinecap="round" opacity="0.9"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={(2 * Math.PI * 130) * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.1s linear', filter: `drop-shadow(0 0 10px ${themeColor}90)` }}
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <div className={`text-5xl sm:text-6xl font-mono font-black tracking-widest ${ui?.textMain || 'text-[#fff]'} animate-pulse drop-shadow-md`}>
            {timeStr}
          </div>
          <span className={`text-[8px] font-bold tracking-[0.5em] uppercase mt-4 ${ui?.textMuted || 'opacity-50'}`}>COUNTDOWN</span>
        </div>
      </div>
    </ModuleLayout>
  );
};

const SpeedOverlay = ({ speedData, themeColor, displayMode, ui }: any) => {
  const speedVal = displayMode === 'decimal' ? toDecimalSpeed(speedData?.speed || 0) : ((speedData?.speed || 0) * 3.6);
  const maxVal = displayMode === 'decimal' ? 100 : 160; 
  const progress = Math.min(speedVal / maxVal, 1);

  return (
    <ModuleLayout title="Velocity Node" subtitle="DK/H Metric Tracking" themeColor={themeColor} ui={ui}>
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex flex-col items-center justify-center mt-2">
        <svg className="absolute inset-0 w-full h-full transform" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="160" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="4" strokeDasharray="2 12" opacity="0.3" />
          
          <path d="M 60,260 A 150,150 0 1,1 340,260" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="12" strokeLinecap="round" opacity="0.1" />
          <path 
            d="M 60,260 A 150,150 0 1,1 340,260" fill="none" stroke={themeColor} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={150 * Math.PI * 1.5}
            strokeDashoffset={(150 * Math.PI * 1.5) * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out', filter: `drop-shadow(0 0 8px ${themeColor})` }}
          />
        </svg>
        <div className="flex flex-col items-center z-10 mt-[-20px]">
          <div className={`text-6xl sm:text-7xl font-mono font-black ${ui?.textMain || 'text-white'}`} style={{ textShadow: `0 0 15px ${themeColor}80` }}>
            {speedVal.toFixed(1)}
          </div>
          <div className={`mt-2 text-[8px] font-bold tracking-[0.5em] ${ui?.textMuted || 'text-white opacity-40'} uppercase`}>
            {displayMode === 'decimal' ? 'METRIC DKH' : 'KM/H UNIT'}
          </div>
          
          <div className={`mt-10 grid grid-cols-2 gap-12 w-full px-6`}>
            <div className="flex flex-col items-center">
              <span className={`text-[6px] uppercase font-black tracking-widest ${ui?.textMuted || 'text-white opacity-40'} mb-1`}>PEAK VEL</span>
              <span className={`text-sm font-bold ${ui?.textMain || 'text-white'}`}>
                {displayMode === 'decimal' ? toDecimalSpeed(speedData?.maxSpeed || 0).toFixed(1) : (speedData?.maxSpeed * 3.6 || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[6px] uppercase font-black tracking-widest ${ui?.textMuted || 'text-white opacity-40'} mb-1`}>HEADING</span>
              <span className={`text-sm font-bold ${ui?.textMain || 'text-white'}`}>
                {displayMode === 'decimal' ? formatDecimalDegrees(speedData?.heading || 0) : `${Math.round(speedData?.heading || 0)}°N`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

const WaterOverlay = ({ waterIntake, waterGoal, themeColor, ui }: any) => (
  <ModuleLayout title="Hydration Cell" subtitle="Liquid Intake Telemetry" themeColor={themeColor} ui={ui}>
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="60" fill="none" stroke={ui?.textMain || "white"} strokeWidth="2" opacity="0.05" />
          <circle 
            cx="64" cy="64" r="60" fill="none" stroke={themeColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={377} strokeDashoffset={377 * (1 - Math.min((waterIntake || 0) / (waterGoal || 2000), 1))}
            style={{ filter: `drop-shadow(0 0 10px ${themeColor})`, transition: 'all 1s ease-out' }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className={`text-3xl font-black ${ui?.textMain || 'text-white'}`}>{waterIntake || 0}</span>
          <span className={`text-[8px] font-bold uppercase ${ui?.textMuted || 'text-white opacity-40'}`}>of {waterGoal || 2000} ML</span>
        </div>
      </div>
    </div>
  </ModuleLayout>
);

const SleepOverlay = ({ isSleeping, sleepStart, lastSleepDuration, sleepQuality, sleepMetrics, displayMode, themeColor, ui }: any) => {
  const getDuration = () => {
    if (!isSleeping) return lastSleepDuration;
    return Date.now() - (sleepStart || Date.now());
  };
  const d = getDuration();
  const timeStr = displayMode === 'decimal'
    ? formatDecimalDuration(d)
    : (() => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(Math.floor(d / 3600000))}:${pad(Math.floor((d % 3600000) / 60000))}:${pad(Math.floor((d % 60000) / 1000))}`;
      })();

  const cx = 200, cy = 200, r = 130;
  const metricsProgress = sleepQuality / 100;

  return (
    <ModuleLayout title="Biometric Sleep" subtitle={isSleeping ? "Active Capture Mode" : "Analysis Dashboard"} themeColor={themeColor} ui={ui}>
      
      {/* Background SVG for Circular Rings */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 400 400">
        {!isSleeping && (
          <>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="12" opacity="0.1" />
            <circle 
              cx={cx} cy={cy} r={r} fill="none" stroke={sleepQuality > 80 ? '#22c55e' : (sleepQuality > 50 ? themeColor : '#ef4444')} strokeWidth="12" strokeLinecap="round" opacity="0.9"
              strokeDasharray={2 * Math.PI * r}
              strokeDashoffset={(2 * Math.PI * r) * (1 - metricsProgress)}
              style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 10px ${themeColor}90)` }}
            />
          </>
        )}
        {isSleeping && (
          <>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={themeColor} strokeWidth="4" opacity="0.2" strokeDasharray="5,15" className="animate-[spin_60s_linear_infinite]" />
            <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke={themeColor} strokeWidth="2" opacity="0.1" strokeDasharray="2,2" />
          </>
        )}
      </svg>

      <div className="flex flex-col items-center z-10 scale-90">
        
        {/* Core Timer display */}
        <div className={`text-4xl sm:text-5xl font-mono font-black tracking-widest ${ui?.textMain || 'text-white'} ${isSleeping ? 'animate-pulse' : ''} mb-4`}>
          {timeStr}
        </div>
        
        {/* Sub Elements depending on Mode */}
        {isSleeping ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 5px red)'}} />
                <span className={`text-xs font-black tracking-[0.3em] uppercase opacity-80 ${ui?.textMain || 'text-white'}`}>
                  SENSING ENVIRONMENT
                </span>
              </div>
              <div className={`text-[10px] uppercase font-mono tracking-widest ${ui?.textMuted || 'text-white/40'}`}>
                Noise: {Math.round(sleepMetrics?.avgNoise || 0)} dB | Movement: {Math.round(sleepMetrics?.avgMove || 0)}
              </div>
            </div>
        ) : (
            <div className="w-full flex-col flex items-center bg-black/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
              <div className="grid grid-cols-3 gap-6 text-center w-full">
                <div className="flex flex-col items-center">
                  <span className={`text-[9px] uppercase tracking-widest ${ui?.textMuted || 'text-white/40'} mb-1`}>QUALITY</span>
                  <span className={`text-xl font-black ${sleepQuality > 80 ? 'text-green-500' : (sleepQuality > 50 ? 'text-yellow-500' : 'text-red-500')}`}>{sleepQuality}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[9px] uppercase tracking-widest ${ui?.textMuted || 'text-white/40'} mb-1`}>DISTURBANCES</span>
                  <span className="text-xl font-black font-mono text-white">{sleepMetrics?.disturbances || 0}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[9px] uppercase tracking-widest ${ui?.textMuted || 'text-white/40'} mb-1`}>AVG DB</span>
                  <span className="text-xl font-black font-mono text-white">{Math.round(sleepMetrics?.avgNoise || 0)}</span>
                </div>
              </div>
            </div>
        )}

      </div>
    </ModuleLayout>
  );
};

const ThermalOverlay = ({ themeColor, ui }: any) => (
  <ModuleLayout title="Thermal Bypass" subtitle="Infrared Signal Bypass" themeColor={themeColor} ui={ui}>
    <div className="w-full h-full rounded-full border border-red-500/10 flex flex-col items-center justify-center pointer-events-none relative overflow-hidden">
      <div className="absolute inset-0 bg-red-900/5 animate-pulse" />
      <div className="text-red-500 font-bold text-[11px] animate-pulse uppercase tracking-[0.5em] brightness-125 z-10 flex flex-col items-center">
        <span>THERMAL LINK ESTABLISHED</span>
        <span className="text-[7px] mt-2 opacity-50">Bypassing Optical Sensor</span>
      </div>
      {/* Visual distortion effect */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,0,0,0.1)_50%,transparent_50%)] bg-[length:100%_4px]" />
    </div>
  </ModuleLayout>
);

interface ModuleRendererProps {
  appMode: AppMode;
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
  // Module-specific props
  voiceEnabled: boolean;
  speakAI: (text: string) => void;
  motion: any;
  steps: number;
  baseLocation: any;
  coords: any;
  heading: number | null;
  altitude: number;
  weather: any;
  mag: any;
  seismoData: any[];
  lux: number;
  audioLevels: number[];
  isScanningBt: boolean;
  scanResults: any[];
  planets: any;
  daysSinceJ2000: number;
  decryptData: any;
  swTime: number;
  tmRemaining: number;
  tmDuration: number;
  waterIntake: number;
  isSleeping: boolean;
  sleepStart: number | null;
  lastSleepDuration: number;
  sleepQuality: number;
  sleepMetrics: {disturbances: number, avgNoise: number, avgMove: number};
  sunTimes: { rise: number, set: number };
  zenActive: boolean;
  zenPhase: 'inspire' | 'hold' | 'expire' | 'wait';
  zenTimer: number;
  toggleZen: () => void;
  speedData: any;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  appMode, themeColor, ui, displayMode,
  voiceEnabled, speakAI, motion, steps, baseLocation, coords, heading,
  altitude, weather, mag, seismoData, lux,
  audioLevels, isScanningBt, scanResults, planets, daysSinceJ2000, decryptData,
  swTime, tmRemaining, tmDuration, waterIntake, isSleeping, sleepStart, lastSleepDuration, sleepQuality, sleepMetrics,
  sunTimes,
  zenActive, zenPhase, zenTimer, toggleZen,
  speedData
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
      {appMode === 'zen' && (
        <ModuleLayout title="Zen Protocol" subtitle="Biometric Calm Sync" themeColor={themeColor} ui={ui}>
          <ZenModule 
            isActive={zenActive}
            phase={zenPhase}
            timer={zenTimer}
            toggleZen={toggleZen}
            themeColor={themeColor} 
            ui={ui} 
            speakAI={speakAI}
            voiceEnabled={voiceEnabled}
          />
        </ModuleLayout>
      )}

      {appMode === 'analog' && (
        <ModuleLayout title="Decimal Chrono" subtitle="Tactical Analogue" themeColor={themeColor} ui={ui}>
          <AnalogDecimalModule 
            themeColor={themeColor} 
            ui={ui} 
          />
        </ModuleLayout>
      )}

      {appMode === 'level' && (
        <ModuleLayout title="Inertial Level" subtitle="Axis Stability Monitor" themeColor={themeColor} ui={ui}>
          <LevelModule 
            motion={motion}
            themeColor={themeColor}
            ui={ui}
          />
        </ModuleLayout>
      )}

      {appMode === 'steps' && (
        <ModuleLayout title="Pedometer" subtitle="Active Step Telemetry" themeColor={themeColor} ui={ui}>
          <PedometerModule 
            steps={steps}
            themeColor={themeColor}
            ui={ui}
          />
        </ModuleLayout>
      )}

      {appMode === 'nav' && (
        <ModuleLayout title="Waypoint Nav" subtitle="Positional GPS Lock" themeColor={themeColor} ui={ui}>
          <WaypointModule 
            baseLocation={baseLocation}
            currentLocation={coords}
            heading={heading}
            themeColor={themeColor}
            ui={ui}
          />
        </ModuleLayout>
      )}

      {appMode === 'altimeter' && (
        <ModuleLayout title="Altimeter" subtitle="Barometric Elevation" themeColor={themeColor} ui={ui}>
          <AltimeterModule 
            altitude={altitude}
            themeColor={themeColor}
            weather={weather}
            ui={ui}
          />
        </ModuleLayout>
      )}

      {appMode === 'emf' && (
        <ModuleLayout title="EMF Static" subtitle="Electromagnetic Field" themeColor={themeColor} ui={ui}>
          <EMFModule 
            mag={mag}
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}

      {appMode === 'seismo' && (
        <ModuleLayout title="Seismograph" subtitle="Tectonic Active Node" themeColor={themeColor} ui={ui}>
          <SeismoModule 
            seismoData={seismoData}
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}

      {appMode === 'stopwatch' && (
        <StopwatchOverlay swTime={swTime} displayMode={displayMode} themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'timer' && (
        <TimerOverlay tmRemaining={tmRemaining} tmDuration={tmDuration} displayMode={displayMode} themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'speed' && (
        <SpeedOverlay speedData={speedData} themeColor={themeColor} displayMode={displayMode} ui={ui} />
      )}

      {appMode === 'water' && (
        <WaterOverlay waterIntake={waterIntake} waterGoal={2000} themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'sleep' && (
        <SleepOverlay isSleeping={isSleeping} sleepStart={sleepStart} lastSleepDuration={lastSleepDuration} sleepQuality={sleepQuality} sleepMetrics={sleepMetrics} displayMode={displayMode} themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'lumen' && (
        <ModuleLayout title="Lumen Meter" subtitle="Ambient Lux Sensor" themeColor={themeColor} ui={ui}>
          <LumenModule 
            lux={lux}
            sunTimes={sunTimes}
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}

      {appMode === 'thermal' && (
        <ThermalOverlay themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'radar' && (
        <RadarOverlay isScanningBt={isScanningBt} themeColor={themeColor} scanResults={scanResults} ui={ui} />
      )}

      {appMode === 'scanner' && (
        <ScannerOverlay themeColor={themeColor} ui={ui} />
      )}

        {appMode === 'orbit' && (
          <OrbitOverlay planets={planets} daysSinceJ2000={daysSinceJ2000} themeColor={themeColor} displayMode={displayMode} ui={ui} />
        )}

      {appMode === 'sonar' && (
        <SonarOverlay audioLevels={audioLevels} themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'decrypt' && (
        <DecryptOverlay decryptData={decryptData} themeColor={themeColor} ui={ui} />
      )}

      {appMode === 'nfc' && (
        <ModuleLayout title="NFC Scanner" subtitle="Near Field Comm Scan" themeColor={themeColor} ui={ui}>
          <NFCModule 
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}

      {appMode === 'calendar' && (
        <ModuleLayout title="Task Calendar" subtitle="Temporal Schedule Core" themeColor={themeColor} ui={ui}>
          <CalendarModule 
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}

      {appMode === 'astro' && (
        <ModuleLayout title="Astro Telemetry" subtitle="NASA NEO System Link" themeColor={themeColor} ui={ui}>
          <AstroModule 
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}
    </div>
  );
};
