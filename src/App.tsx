
import React, { useRef } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { useAppLogic } from './hooks/useAppLogic';
import { useAR } from './hooks/useAR';
import { useBluetooth } from './hooks/useBluetooth';
import { ThemeControls } from './components/ThemeControls';
import { ClockRings } from './components/ClockRings';
import { ModeButtons } from './components/ModeButtons';
import { ClockLabels } from './components/ClockLabels';
import { ComplicationsHex } from './components/ComplicationsHex';
import { CenterButton } from './components/CenterButton';
import { getDecimalDate, getDecimalTime } from './lib/time-utils';

export default function App() {
  const {
    now, activeTheme, displayMode, appMode, soundEnabled, lightModeOverride,
    micEnabled, decryptData, waterIntake, setWaterIntake, isSleeping, sleepStart, lastSleepDuration,
    battery, sunTimes, hasGps, weather, network,
    speedData, swRunning, swTime, tmRunning, tmDuration, tmRemaining,
    decibels, audioLevels,
    toggleMode, changeTheme, toggleSound, switchAppMode, toggleMic, handleCenterClick, toggleLightMode,
    lapOrResetStopwatch, addTimerTime, toggleTimer, resetTimer
  } = useAppLogic();

  const { arEnabled, videoRef, toggleAR } = useAR(soundEnabled);
  const { btDevices: scanResults, isScanningBt: scanning, toggleBtScan } = useBluetooth(soundEnabled);

  const clockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / rect.height) * 30;
    const tiltY = (x / rect.width) * 30;
    clockRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!clockRef.current) return;
    clockRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  const decimalTime = getDecimalTime(now);
  const decimalDate = getDecimalDate(now);
  const currentStandardHour = now.getHours() + now.getMinutes() / 60;
  const isDay = currentStandardHour >= sunTimes.rise && currentStandardHour < sunTimes.set;
  const isLightMode = lightModeOverride !== null ? lightModeOverride : isDay;

  const themeColor = activeTheme.hex;
  const daysSinceJ2000 = (now.getTime() - 946728000000) / 86400000;
  const planets = {
    mercury: ((daysSinceJ2000 / 87.969) * 360) % 360,
    venus: ((daysSinceJ2000 / 224.701) * 360) % 360,
    earth: ((daysSinceJ2000 / 365.256) * 360) % 360,
  };

  const ui = {
    bgApp: arEnabled ? "bg-black" : (isLightMode ? "bg-stone-200" : "bg-[#050505]"),
    textMain: isLightMode && !arEnabled ? "text-stone-800" : "text-white",
    textMuted: isLightMode && !arEnabled ? "text-stone-500" : "text-neutral-400",
    textVeryMuted: isLightMode && !arEnabled ? "text-stone-400" : "text-neutral-600",
    bgClock: arEnabled ? "bg-black/60 backdrop-blur-sm" : (isLightMode ? "bg-stone-100" : "bg-[#0a0a0a]"),
    borderClock: arEnabled ? "border-white/20" : (isLightMode ? "border-white" : "border-[#111]"),
    ringBg: arEnabled ? "rgba(255,255,255,0.1)" : (isLightMode ? "#d6d3d1" : "#151515"),
    tickMuted: arEnabled ? "rgba(255,255,255,0.2)" : (isLightMode ? "#a8a29e" : "#222"),
    btnBg: arEnabled ? "bg-black/50" : (isLightMode ? "bg-white" : "bg-[#0f0f0f]"),
    btnBorder: arEnabled ? "border-white/20" : (isLightMode ? "border-stone-200" : "border-[#1a1a1a]"),
    btnHoverBorder: arEnabled ? "hover:border-white/40" : (isLightMode ? "hover:border-stone-400" : "hover:border-[#333]"),
    clockShadow: appMode === 'water' 
      ? `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 40px #3b82f640`
      : appMode === 'sleep'
        ? `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 40px #6366f140`
        : arEnabled 
          ? `0 20px 50px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.5), 0 0 30px ${themeColor}60`
          : isLightMode
            ? `0 20px 50px rgba(0,0,0,0.1), inset 0 0 60px rgba(0,0,0,0.05), 0 0 30px ${themeColor}40`
            : `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 30px ${themeColor}20`,
    controlBtnBorder: arEnabled ? "border-white/20 hover:bg-white/10" : (isLightMode ? "border-stone-300 hover:bg-stone-200" : "border-neutral-700 hover:bg-neutral-800"),
    dividerBorder: arEnabled ? "border-white/20" : (isLightMode ? "border-stone-300" : "border-neutral-800"),
    iconMuted: arEnabled ? "text-white/50" : (isLightMode ? "text-stone-400" : "text-neutral-400")
  };

  const radiusHours = 160;
  const radiusMins = 140;
  const radiusSecs = 120;
  const circHours = 2 * Math.PI * radiusHours;
  const circMins = 2 * Math.PI * radiusMins;
  const circSecs = 2 * Math.PI * radiusSecs;

  let offsetHours = circHours, offsetMins = circMins, offsetSecs = circSecs;

  if (appMode === 'clock') {
    if (displayMode === 'decimal') {
      offsetHours = circHours - (decimalTime.hours / 10) * circHours;
      offsetMins = circMins - (decimalTime.minutes / 100) * circMins;
      offsetSecs = circSecs - (decimalTime.seconds / 100) * circSecs;
    } else {
      offsetHours = circHours - ((now.getHours() % 12 || 12) / 12) * circHours;
      offsetMins = circMins - (now.getMinutes() / 60) * circMins;
      offsetSecs = circSecs - (now.getSeconds() / 60) * circSecs;
    }
  } else if (appMode === 'stopwatch') {
    offsetHours = circHours - (((swTime / 60000) % 60) / 60) * circHours;
    offsetMins = circMins - (((swTime / 1000) % 60) / 60) * circMins;
    offsetSecs = circSecs - ((swTime % 1000) / 1000) * circSecs;
  } else if (appMode === 'timer') {
    const progress = tmDuration > 0 ? tmRemaining / tmDuration : 0;
    offsetHours = circHours - progress * circHours;
    offsetMins = circMins - ((tmRemaining % 60000) / 60000) * circMins;
    offsetSecs = circSecs;
  } else if (appMode === 'speed') {
    const speedKmh = (speedData.speed || 0) * 3.6;
    const maxSpeedKmh = speedData.maxSpeed * 3.6;
    offsetHours = circHours - Math.min(speedKmh / 200, 1) * circHours;
    offsetMins = circMins - (maxSpeedKmh > 0 ? Math.min(speedKmh / maxSpeedKmh, 1) : 0) * circMins;
    offsetSecs = circSecs;
  }

  return (
    <div className={`min-h-screen ${ui.bgApp} flex flex-col items-center justify-center ${ui.textMain} font-['Share_Tech_Mono',_monospace] selection:bg-white selection:text-black p-4 overflow-hidden transition-colors duration-1000 relative`}>
      <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${arEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      
      {arEnabled && <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)', backgroundSize: '100% 4px' }} />}

      <div className="text-center mb-6 sm:mb-8 max-w-md z-10 mt-12 sm:mt-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          DECIMAL<span style={{ color: themeColor, textShadow: `0 0 15px ${themeColor}` }}>CHRONO</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-[0.3em]">
          {appMode === 'clock' ? 'Sistema de Tempo Alternativo' : appMode === 'stopwatch' ? 'Cronômetro de Precisão' : appMode === 'timer' ? 'Purga de Sistema (Timer)' : appMode === 'speed' ? 'Telemetria de Velocidade' : appMode === 'scanner' ? 'Módulo de Reconhecimento' : 'Radar de Proximidade BLE'}
        </p>
      </div>

      <ThemeControls 
        arEnabled={arEnabled}
        isLightMode={isLightMode}
        soundEnabled={soundEnabled}
        activeTheme={activeTheme}
        themeColor={themeColor}
        ui={ui}
        toggleAR={toggleAR}
        toggleLightMode={toggleLightMode}
        toggleSound={toggleSound}
        changeTheme={changeTheme}
      />

      <div className="relative perspective-[1000px] z-10" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div 
          ref={clockRef}
          className={`relative w-[350px] h-[350px] sm:w-[460px] sm:h-[460px] rounded-full border-[12px] sm:border-[14px] ${ui.borderClock} ${ui.bgClock} flex items-center justify-center transition-transform duration-100 ease-out`}
          style={{ boxShadow: ui.clockShadow }}
        >
          <ModeButtons appMode={appMode} themeColor={themeColor} isLightMode={isLightMode} arEnabled={arEnabled} ui={ui} switchAppMode={switchAppMode} />
          
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-[#0a0a0a] to-[#000] rounded-full" />

          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 400 400">
            {Array.from({ length: (appMode === 'clock' && displayMode === 'decimal') ? 100 : 60 }).map((_, i) => {
              const total = (appMode === 'clock' && displayMode === 'decimal') ? 100 : 60;
              const angle = (i / total) * 360;
              const rad = (angle - 90) * (Math.PI / 180);
              const isMajor = (appMode === 'clock' && displayMode === 'decimal') ? i % 10 === 0 : i % 5 === 0;
              const r1 = isMajor ? 178 : 184;
              const r2 = 190;
              return (
                <line 
                  key={i} 
                  x1={200 + r1 * Math.cos(rad)} y1={200 + r1 * Math.sin(rad)} 
                  x2={200 + r2 * Math.cos(rad)} y2={200 + r2 * Math.sin(rad)} 
                  stroke={isMajor ? themeColor : ui.tickMuted} 
                  strokeWidth={isMajor ? "3" : "1.5"} 
                  style={isMajor ? { filter: `drop-shadow(0 0 4px ${themeColor})` } : { transition: 'stroke 1s ease' }}
                />
              );
            })}
          </svg>

          <ClockRings 
            appMode={appMode}
            themeColor={themeColor}
            ui={ui}
            rings={{ radiusHours, radiusMins, radiusSecs, circHours, circMins, circSecs, offsetHours, offsetMins, offsetSecs }}
            planets={planets}
            daysSinceJ2000={daysSinceJ2000}
            speedData={speedData}
            audioLevels={audioLevels}
            isScanningBt={scanning}
            waterIntake={waterIntake}
            waterGoal={2000}
            isSleeping={isSleeping}
          />

          <CenterButton 
            appMode={appMode}
            themeColor={themeColor}
            isDay={isDay}
            swRunning={swRunning}
            tmRunning={tmRunning}
            speedData={speedData}
            isScanningBt={scanning}
            isSleeping={isSleeping}
            ui={ui}
            handleCenterClick={handleCenterClick}
          />

          <ClockLabels 
            appMode={appMode}
            displayMode={displayMode}
            themeColor={themeColor}
            now={now}
            decimalTime={decimalTime}
            decimalDate={decimalDate}
            swTime={swTime}
            tmRemaining={tmRemaining}
            speedData={speedData}
            btDevices={scanResults}
            decryptData={decryptData}
            isSleeping={isSleeping}
            sleepStart={sleepStart}
            lastSleepDuration={lastSleepDuration}
            daysSinceJ2000={daysSinceJ2000}
            audioLevels={audioLevels}
            waterIntake={waterIntake}
            waterGoal={2000}
            isScanningBt={scanning}
          />

          {appMode === 'stopwatch' && (
            <div className="absolute bottom-[12%] z-30 flex flex-col items-center w-full px-12">
              <button 
                onClick={appMode === 'stopwatch' ? lapOrResetStopwatch : undefined} 
                className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-3 py-1 rounded transition-colors ${ui.controlBtnBorder}`}
              >
                {swRunning ? 'Lap' : 'Reset'}
              </button>
            </div>
          )}

          {appMode === 'timer' && (
            <div className="absolute bottom-[14%] z-30 flex flex-col items-center w-full px-12">
              {tmRemaining <= 0 ? (
                <div className="flex space-x-2">
                  {[1, 5, 15].map(m => (
                    <button key={m} onClick={() => addTimerTime(m)} className={`text-[10px] border px-3 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`} style={{ color: themeColor }}>+{m}m</button>
                  ))}
                </div>
              ) : (
                <button onClick={resetTimer} className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-4 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`}><RotateCcw size={12} /><span>Reset</span></button>
              )}
            </div>
          )}

          <ComplicationsHex 
            ui={ui}
            themeColor={themeColor}
            battery={battery}
            network={network}
            isDay={isDay}
            sunTimes={sunTimes}
            displayMode={displayMode}
            weather={weather}
            micEnabled={micEnabled}
            decibels={decibels}
            hasGps={hasGps}
            toggleMic={toggleMic}
          />
        </div>
      </div>

      <div className="mt-8 sm:mt-12 flex flex-col items-center space-y-4 z-10">
        {appMode === 'clock' && (
          <button onClick={toggleMode} className="flex items-center space-x-2 text-neutral-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] border border-neutral-800 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-colors">
            <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${displayMode === 'standard' ? 'animate-spin-slow' : ''}`} />
            <span>Modo Atual: <strong style={{ color: themeColor }}>{displayMode === 'decimal' ? 'Decimal' : 'Padrão'}</strong></span>
          </button>
        )}
        
        {appMode === 'clock' && displayMode === 'decimal' && (
          <div className="text-neutral-600 text-[9px] sm:text-[11px] max-w-[280px] sm:max-w-sm text-center leading-relaxed border-t border-neutral-800 pt-3 sm:pt-4">
            <span className="text-neutral-400">ARQUITETURA DE TEMPO</span><br/>
            1 Dia = 10h • 1h = 100m • 1m = 100s<br/>
            Ano = 10 Layers (Meses) • Ciclo = 9 States (Dias)
          </div>
        )}
      </div>
    </div>
  );
}
