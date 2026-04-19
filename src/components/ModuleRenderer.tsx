
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
    <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
    <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
    <div className="absolute inset-[15%] rounded-full border border-dashed border-white/5 animate-[spin_120s_linear_infinite] pointer-events-none" />

    {/* Header Info */}
    <div className="absolute top-[18%] flex flex-col items-center pointer-events-none">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: themeColor }} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white brightness-125">{title}</span>
      </div>
      {subtitle && (
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-40 text-white">{subtitle}</span>
      )}
    </div>

    {/* Content Area */}
    <div className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-10 pointer-events-auto overflow-hidden">
      <div className="flex flex-col items-center justify-center scale-90 sm:scale-100">
        {children}
      </div>
    </div>

    {/* System Status Header */}
    <div className="absolute top-[10%] flex flex-col items-center pointer-events-none">
      <div className="h-[1px] w-6 bg-white/10 mb-0.5 overflow-hidden">
        <div className="h-full bg-current animate-[shimmer_3s_infinite]" style={{ backgroundColor: themeColor, width: '30%' }} />
      </div>
      <span className="text-[4px] font-bold tracking-[0.3em] opacity-10 text-white uppercase">Status Nominal</span>
    </div>
  </motion.div>
);

const OrbitOverlay = ({ planets, daysSinceJ2000, themeColor, displayMode }: any) => (
  <ModuleLayout title="Planetary Monitor" subtitle="Solar Orbital Sync" themeColor={themeColor} ui={{}}>
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
          <circle cx="200" cy="200" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" strokeDasharray="4,4" />

          {/* The Sun */}
          <circle cx="200" cy="200" r="25" fill="url(#sunGlow)" className="animate-[pulse_4s_ease-in-out_infinite]" />
          <circle cx="200" cy="200" r="10" fill="#fff" opacity="0.8" style={{ filter: 'drop-shadow(0 0 10px #ffb000)' }} />

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
        <span className="text-[7px] uppercase tracking-widest opacity-40 mb-1">Orbital Resonance</span>
        <div className="text-[10px] font-mono font-bold tracking-[0.2em]" style={{ color: themeColor }}>
          {displayMode === 'decimal' ? `${formatDecimalDegrees(planets.earth)}` : `${Math.round(planets.earth)}°`} / TERRA
        </div>
      </div>
    </div>
  </ModuleLayout>
);

const SonarOverlay = ({ audioLevels, themeColor }: any) => (
  <ModuleLayout title="Sonar Feedback" subtitle="Acoustic Wave Analysis" themeColor={themeColor} ui={{}}>
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

const RadarOverlay = ({ isScanningBt, themeColor, scanResults }: any) => (
  <ModuleLayout title="BT Radar Scan" subtitle="Device Proximity Detection" themeColor={themeColor} ui={{}}>
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
                <div key={i} className="bg-black/60 border border-white/10 p-2 rounded-lg backdrop-blur-md">
                  <p className="text-[6px] text-white opacity-40 uppercase tracking-widest font-bold">UID {dev.id?.slice(-4)}</p>
                  <p className="text-[9px] font-black truncate text-white" style={{ textShadow: `0 0 10px ${themeColor}` }}>{dev.name || 'UNKNOWN DEVICE'}</p>
                </div>
              ))}
           </div>
         ) : (
           <div className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40 animate-pulse text-white">Searching Frequencies...</div>
         )}
      </div>
    </div>
  </ModuleLayout>
);

const ScannerOverlay = ({ themeColor }: any) => (
  <ModuleLayout title="Signal Scanner" subtitle="Spectrum Analysis Node" themeColor={themeColor} ui={{}}>
    <svg className="w-full h-full" viewBox="0 0 400 400">
      <g opacity="0.8" stroke={themeColor} strokeWidth="3" fill="none">
        <path d="M 120,100 L 100,100 L 100,120" />
        <path d="M 280,100 L 300,100 L 300,120" />
        <path d="M 120,300 L 100,300 L 100,280" />
        <path d="M 280,300 L 300,300 L 300,280" />
        <rect x="90" y="90" width="220" height="220" fill="none" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.2" />
        <line x1="100" y1="200" x2="300" y2="200" strokeWidth="0.3" opacity="0.3" />
        <line x1="200" y1="100" x2="200" y2="300" strokeWidth="0.3" opacity="0.3" />
        {/* Scanning line */}
        <motion.line 
          x1="100" y1="100" x2="300" y2="100" 
          animate={{ y: [0, 200, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          strokeWidth="1"
          opacity="0.8"
          style={{ filter: `drop-shadow(0 0 8px ${themeColor})` }}
        />
      </g>
    </svg>
  </ModuleLayout>
);

const DecryptOverlay = ({ decryptData, themeColor }: any) => (
  <ModuleLayout title="Neural Decrypt" subtitle="Vector Code Extraction" themeColor={themeColor} ui={{}}>
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-3 mb-6 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        {decryptData.chars.slice(0, 16).map((c: string, i: number) => (
          <span key={i} className="text-xl font-mono font-black animate-pulse brightness-150" style={{ color: themeColor }}>{c}</span>
        ))}
      </div>
      <div className="w-56 h-2 bg-white/5 rounded-full overflow-hidden p-[2px]">
          <div className="h-full rounded-full animate-[shimmer_2s_infinite]" style={{ backgroundColor: themeColor, width: `${(decryptData.progress || 0) * 100}%`, boxShadow: `0 0 15px ${themeColor}` }} />
      </div>
      <div className="mt-4 text-[8px] font-black tracking-[0.4em] text-white opacity-40 uppercase">Decrypting Node Active</div>
    </div>
  </ModuleLayout>
);

const StopwatchOverlay = ({ swTime, displayMode, themeColor }: any) => {
  const timeStr = displayMode === 'decimal' 
    ? formatDecimalDuration(swTime, true)
    : (() => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const pad3 = (n: number) => n.toString().padStart(3, '0');
        return `${pad(Math.floor(swTime / 60000))}:${pad(Math.floor((swTime % 60000) / 1000))}.${pad3(swTime % 1000)}`;
      })();

  return (
    <ModuleLayout title="Chronometer" subtitle="Precision Timer Link" themeColor={themeColor} ui={{}}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl sm:text-6xl font-mono font-black tracking-tighter text-[#fff] brightness-200 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] tabular-nums">
          {timeStr}
        </div>
        <div className="mt-8 flex gap-6 items-center">
          <div className="flex flex-col items-center">
            <span className="text-[7px] opacity-40 uppercase font-black tracking-widest text-white mb-1">Status Capture</span>
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-white/50 w-full animate-pulse" />
            </div>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[7px] opacity-40 uppercase font-black tracking-widest text-white mb-1">Tactical Pulse</span>
            <div className="flex gap-1">
              {[1, 1, 1, 0, 0].map((v, i) => (
                <div key={i} className={`w-1 h-3 rounded-sm ${v ? 'bg-white/40' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

const TimerOverlay = ({ tmRemaining, displayMode, themeColor }: any) => {
  const timeStr = displayMode === 'decimal'
    ? formatDecimalDuration(tmRemaining)
    : (() => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(Math.floor(tmRemaining / 60000))}:${pad(Math.floor((tmRemaining % 60000) / 1000))}`;
      })();

  return (
    <ModuleLayout title="Purge Countdown" subtitle="System Critical Timer" themeColor={themeColor} ui={{}}>
      <div className="flex flex-col items-center">
        <div className="text-4xl sm:text-6xl font-mono font-black tracking-widest text-[#fff] brightness-125 animate-pulse drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          {timeStr}
        </div>
        <div className="mt-6 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full animate-pulse" style={{ backgroundColor: themeColor, width: '75%' }} />
        </div>
      </div>
    </ModuleLayout>
  );
};

const SpeedOverlay = ({ speedData, themeColor, displayMode }: any) => (
  <ModuleLayout title="Velocity Node" subtitle="DK/H Metric Tracking" themeColor={themeColor} ui={{}}>
    <div className="flex flex-col items-center">
      <div className="text-5xl sm:text-7xl font-mono font-black text-white brightness-150 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
        {displayMode === 'decimal' ? toDecimalSpeed(speedData?.speed || 0).toFixed(1) : ((speedData?.speed || 0) * 3.6).toFixed(1)}
      </div>
      <div className="mt-2 text-[10px] font-bold tracking-[0.5em] text-white opacity-40 uppercase">
        {displayMode === 'decimal' ? 'METRIC DKH' : 'KM/H UNIT'}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-8 border-t border-white/10 pt-4 w-full px-8">
        <div className="flex flex-col">
          <span className="text-[6px] opacity-40 uppercase font-black text-white">Peak Vel</span>
          <span className="text-xs font-bold text-white">
            {displayMode === 'decimal' ? toDecimalSpeed(speedData?.maxSpeed || 0).toFixed(1) : (speedData?.maxSpeed * 3.6 || 0).toFixed(1)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[6px] opacity-40 uppercase font-black text-white">Heading</span>
          <span className="text-xs font-bold text-white">
            {displayMode === 'decimal' ? formatDecimalDegrees(speedData?.heading || 0) : `${Math.round(speedData?.heading || 0)}°N`}
          </span>
        </div>
      </div>
    </div>
  </ModuleLayout>
);

const WaterOverlay = ({ waterIntake, waterGoal, themeColor }: any) => (
  <ModuleLayout title="Hydration Cell" subtitle="Liquid Intake Telemetry" themeColor={themeColor} ui={{}}>
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="60" fill="none" stroke="white" strokeWidth="2" opacity="0.05" />
          <circle 
            cx="64" cy="64" r="60" fill="none" stroke={themeColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={377} strokeDashoffset={377 * (1 - Math.min((waterIntake || 0) / (waterGoal || 2000), 1))}
            style={{ filter: `drop-shadow(0 0 10px ${themeColor})`, transition: 'all 1s ease-out' }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-white brightness-125">{waterIntake || 0}</span>
          <span className="text-[8px] opacity-40 font-bold uppercase text-white">of {waterGoal || 2000} ML</span>
        </div>
      </div>
    </div>
  </ModuleLayout>
);

const SleepOverlay = ({ isSleeping, sleepStart, lastSleepDuration, displayMode, themeColor }: any) => {
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

  return (
    <ModuleLayout title="Biometric Sleep" subtitle={isSleeping ? "Active Phase Capture" : "Standby Monitor"} themeColor={themeColor} ui={{}}>
      <div className="flex flex-col items-center">
        <div className={`text-4xl font-mono font-black tracking-widest text-white ${isSleeping ? 'animate-pulse' : 'opacity-80'}`}>
          {timeStr}
        </div>
        <div className="mt-8 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isSleeping ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white opacity-40">
            {isSleeping ? 'DATA SYNC ACTIVE' : 'READY FOR CAPTURE'}
          </span>
        </div>
      </div>
    </ModuleLayout>
  );
};

const ThermalOverlay = ({ themeColor }: any) => (
  <ModuleLayout title="Thermal Bypass" subtitle="Infrared Signal Bypass" themeColor={themeColor} ui={{}}>
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
  waterIntake: number;
  isSleeping: boolean;
  sleepStart: number | null;
  lastSleepDuration: number;
  speedData: any;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  appMode, themeColor, ui, displayMode,
  voiceEnabled, speakAI, motion, steps, baseLocation, coords, heading,
  altitude, weather, mag, seismoData, lux,
  audioLevels, isScanningBt, scanResults, planets, daysSinceJ2000, decryptData,
  swTime, tmRemaining, waterIntake, isSleeping, sleepStart, lastSleepDuration,
  speedData
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
      {appMode === 'zen' && (
        <ModuleLayout title="Zen Protocol" subtitle="Biometric Calm Sync" themeColor={themeColor} ui={ui}>
          <ZenModule 
            themeColor={themeColor} 
            ui={ui} 
            speakAI={speakAI}
            voiceEnabled={voiceEnabled}
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
        <StopwatchOverlay swTime={swTime} displayMode={displayMode} themeColor={themeColor} />
      )}

      {appMode === 'timer' && (
        <TimerOverlay tmRemaining={tmRemaining} displayMode={displayMode} themeColor={themeColor} />
      )}

      {appMode === 'speed' && (
        <SpeedOverlay speedData={speedData} themeColor={themeColor} />
      )}

      {appMode === 'water' && (
        <WaterOverlay waterIntake={waterIntake} waterGoal={2000} themeColor={themeColor} />
      )}

      {appMode === 'sleep' && (
        <SleepOverlay isSleeping={isSleeping} sleepStart={sleepStart} lastSleepDuration={lastSleepDuration} displayMode={displayMode} themeColor={themeColor} />
      )}

      {appMode === 'lumen' && (
        <ModuleLayout title="Lumen Meter" subtitle="Ambient Lux Sensor" themeColor={themeColor} ui={ui}>
          <LumenModule 
            lux={lux}
            themeColor={themeColor}
            ui={ui}
            displayMode={displayMode}
          />
        </ModuleLayout>
      )}

      {appMode === 'thermal' && (
        <ThermalOverlay themeColor={themeColor} />
      )}

      {appMode === 'radar' && (
        <RadarOverlay isScanningBt={isScanningBt} themeColor={themeColor} scanResults={scanResults} />
      )}

      {appMode === 'scanner' && (
        <ScannerOverlay themeColor={themeColor} />
      )}

        {appMode === 'orbit' && (
          <OrbitOverlay planets={planets} daysSinceJ2000={daysSinceJ2000} themeColor={themeColor} displayMode={displayMode} />
        )}

      {appMode === 'sonar' && (
        <SonarOverlay audioLevels={audioLevels} themeColor={themeColor} />
      )}

      {appMode === 'decrypt' && (
        <DecryptOverlay decryptData={decryptData} themeColor={themeColor} />
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
    </div>
  );
};
