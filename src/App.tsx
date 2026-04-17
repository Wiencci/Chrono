
import React, { useRef, useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { useAppLogic } from './hooks/useAppLogic';
import { useAR } from './hooks/useAR';
import { useBluetooth } from './hooks/useBluetooth';
import { ClockRings } from './components/ClockRings';
import { OuterRing } from './components/ModeButtons';
import { ClockLabels } from './components/ClockLabels';
import { CenterButton } from './components/CenterButton';
import { ZenModule } from './components/ZenModule';
import { LevelModule } from './components/LevelModule';
import { PedometerModule } from './components/PedometerModule';
import { WaypointModule } from './components/WaypointModule';
import { AltimeterModule } from './components/AltimeterModule';
import { AIBriefing } from './components/AIBriefing';
import { MissionLogs } from './components/MissionLogs';
import { SystemMenu } from './components/SystemMenu';
import { TelemetryBar } from './components/TelemetryBar';
import { ManualOverlay } from './components/ManualOverlay';
import { AppLauncher } from './components/AppLauncher';
import { getDecimalDate, getDecimalTime } from './lib/time-utils';

export default function App() {
  const {
    now, activeTheme, displayMode, appMode, soundEnabled, voiceEnabled, lightModeOverride,
    micEnabled, decryptData, waterIntake, setWaterIntake, isSleeping, sleepStart, lastSleepDuration,
    battery, sunTimes, hasGps, weather, network, tiltRef, heading,
    speedData, swRunning, swTime, swLaps, tmRunning, tmDuration, tmRemaining,
    decibels, audioLevels,
    toggleMode, changeTheme, toggleSound, toggleVoice, switchAppMode, toggleMic, handleCenterClick, toggleLightMode,
    toggleStopwatch, lapOrResetStopwatch, addTimerTime, toggleTimer, resetTimer,
    requestPermissions,
    aiBriefing, missionLogs, addMissionLog, clearLogs, fetchBriefing, analyzeMissionLogs,
    speakAI,
    aiEnabled, toggleAiEnabled, baseLocation, steps, altitude, motion, stealthMode, toggleStealthMode, coords
  } = useAppLogic();

  const { arEnabled, videoRef, toggleAR } = useAR(soundEnabled);
  const { btDevices: scanResults, isScanningBt: scanning, toggleBtScan } = useBluetooth(soundEnabled);

  const clockRef = useRef<HTMLDivElement>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);

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
  
  // High contrast accent for light mode readability (darker versions of theme colors)
  const effectiveTheme = isLightMode && !arEnabled ? {
    '#ccff00': '#7a9900', // Neon -> Olive/Dark Neon
    '#ffb000': '#bf8400', // Amber -> Deep Amber
    '#00e5ff': '#008c99', // Cyan -> Deep Cyan
    '#ff003c': '#cc0030', // Crimson -> Dark Crimson
  }[themeColor] || themeColor : themeColor;

  const ui = {
    bgApp: arEnabled ? "bg-black" : (stealthMode ? "bg-[#020202]" : (isLightMode ? "bg-zinc-50" : "bg-[#050505]")),
    textMain: (stealthMode || !isLightMode || arEnabled) ? "text-zinc-50" : "text-zinc-950",
    textMuted: stealthMode ? "text-zinc-400" : (isLightMode && !arEnabled ? "text-zinc-500" : "text-zinc-400"),
    textVeryMuted: stealthMode ? "text-zinc-600" : (isLightMode && !arEnabled ? "text-zinc-300" : "text-zinc-500"),
    bgClock: arEnabled ? "bg-black/60 backdrop-blur-sm" : (stealthMode ? "bg-black" : (isLightMode ? "bg-white" : "bg-[#0a0a0a]")),
    borderClock: arEnabled ? "border-white/20" : (stealthMode ? "border-neutral-800" : (isLightMode ? "border-zinc-200" : "border-[#111]")),
    ringBg: arEnabled ? "rgba(255,255,255,0.1)" : (stealthMode ? "#0a0a0a" : (isLightMode ? "rgba(0,0,0,0.03)" : "#151515")),
    tickMuted: arEnabled ? "rgba(255,255,255,0.2)" : (stealthMode ? "#1a1a1a" : (isLightMode ? "rgba(0,0,0,0.08)" : "#222")),
    btnBg: arEnabled ? "bg-black/50" : (stealthMode ? "bg-black" : (isLightMode ? "bg-white" : "bg-[#0f0f0f]")),
    btnBorder: arEnabled ? "border-white/20" : (stealthMode ? "border-neutral-800" : (isLightMode ? "border-zinc-200" : "border-[#1a1a1a]")),
    btnHoverBorder: arEnabled ? "hover:border-white/40" : (stealthMode ? "hover:border-neutral-600" : (isLightMode ? "hover:border-zinc-400" : "hover:border-[#333]")),
    clockShadow: stealthMode
      ? `0 20px 60px rgba(0,0,0,1), inset 0 0 80px rgba(0,0,0,1), 0 0 10px ${themeColor}10`
      : appMode === 'water' 
        ? `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 40px #3b82f640`
        : appMode === 'sleep'
          ? `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 40px #6366f140`
          : arEnabled 
            ? `0 20px 50px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.5), 0 0 30px ${themeColor}60`
            : isLightMode
              ? `0 10px 30px rgba(0,0,0,0.03), inset 0 0 20px rgba(0,0,0,0.02), 0 0 2px rgba(0,0,0,0.1)`
              : `0 20px 50px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.9), 0 0 30px ${themeColor}20`,
    controlBtnBorder: arEnabled ? "border-white/20 hover:bg-white/10" : (stealthMode ? "border-neutral-800 hover:bg-neutral-900" : (isLightMode ? "border-zinc-200 hover:bg-zinc-100" : "border-neutral-700 hover:bg-neutral-800")),
    dividerBorder: arEnabled ? "border-white/20" : (stealthMode ? "border-neutral-900" : (isLightMode ? "border-zinc-100" : "border-neutral-800")),
    iconMuted: arEnabled ? "text-white/50" : (stealthMode ? "text-neutral-600" : (isLightMode ? "text-zinc-400" : "text-neutral-400")),
    effectiveTheme: effectiveTheme
  };

  const daysSinceJ2000 = (now.getTime() - 946728000000) / 86400000;
  const planets = {
    mercury: ((daysSinceJ2000 / 87.969) * 360) % 360,
    venus: ((daysSinceJ2000 / 224.701) * 360) % 360,
    earth: ((daysSinceJ2000 / 365.256) * 360) % 360,
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
      <AIBriefing 
        briefing={aiBriefing} 
        themeColor={ui.effectiveTheme} 
        isLightMode={isLightMode} 
        onRefresh={fetchBriefing} 
      />

      <MissionLogs 
        logs={missionLogs}
        addLog={addMissionLog}
        clearLogs={clearLogs}
        analyzeLogs={analyzeMissionLogs}
        themeColor={ui.effectiveTheme}
        ui={ui}
      />

      <TelemetryBar 
        themeColor={ui.effectiveTheme}
        ui={ui}
        battery={battery}
        weather={weather}
        network={network}
        hasGps={hasGps}
        micEnabled={micEnabled}
        decibels={decibels}
        isDay={isDay}
        sunTimes={sunTimes}
        displayMode={displayMode}
        toggleMic={toggleMic}
      />

      {/* Background Video (AR) */}
      <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${arEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      
      {/* UI Overlay Layers */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {/* CRT Scanlines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 118, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />
        
        {/* Vigette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="relative perspective-[1000px] z-10" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div 
          ref={clockRef}
          className={`relative w-[350px] h-[350px] sm:w-[460px] sm:h-[460px] rounded-full border-[12px] sm:border-[14px] ${ui.borderClock} ${ui.bgClock} flex items-center justify-center transition-transform duration-100 ease-out`}
          style={{ boxShadow: ui.clockShadow }}
        >
          <OuterRing 
            appMode={appMode} 
            themeColor={ui.effectiveTheme} 
            ui={ui} 
            switchAppMode={switchAppMode}
            toggleBtScan={toggleBtScan}
            isScanningBt={scanning}
          />
          
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
                  stroke={isMajor ? ui.effectiveTheme : ui.tickMuted} 
                  strokeWidth={isMajor ? "3" : "1.5"} 
                  style={isMajor ? { filter: `drop-shadow(0 0 4px ${ui.effectiveTheme})` } : { transition: 'stroke 1s ease' }}
                />
              );
            })}
          </svg>

          <ClockRings 
            appMode={appMode}
            themeColor={ui.effectiveTheme}
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

          {appMode === 'zen' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-8 pointer-events-auto">
              <ZenModule 
                themeColor={ui.effectiveTheme} 
                ui={ui} 
                speakAI={speakAI}
                voiceEnabled={voiceEnabled}
              />
            </div>
          )}

          {appMode === 'level' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto">
              <LevelModule 
                motion={motion}
                themeColor={ui.effectiveTheme}
                ui={ui}
              />
            </div>
          )}

          {appMode === 'steps' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto">
              <PedometerModule 
                steps={steps}
                themeColor={ui.effectiveTheme}
                ui={ui}
              />
            </div>
          )}

          {appMode === 'nav' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto">
              <WaypointModule 
                baseLocation={baseLocation}
                currentLocation={coords}
                heading={heading}
                themeColor={ui.effectiveTheme}
                ui={ui}
              />
            </div>
          )}

          {appMode === 'altimeter' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto">
              <AltimeterModule 
                altitude={altitude}
                themeColor={ui.effectiveTheme}
                weather={weather}
                ui={ui}
              />
            </div>
          )}

          <CenterButton 
            appMode={appMode}
            themeColor={ui.effectiveTheme}
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
            themeColor={ui.effectiveTheme}
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
            heading={heading}
            ui={ui}
            isLightMode={isLightMode}
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
                    <button key={m} onClick={() => addTimerTime(m)} className={`text-[10px] border px-3 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`} style={{ color: ui.effectiveTheme }}>+{m}m</button>
                  ))}
                </div>
              ) : (
                <button onClick={resetTimer} className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-4 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`}><RotateCcw size={12} /><span>Reset</span></button>
              )}
            </div>
          )}
        </div>
      </div>

      <SystemMenu 
        themeColor={ui.effectiveTheme}
        ui={ui}
        arEnabled={arEnabled}
        toggleAR={toggleAR}
        isLightMode={isLightMode}
        toggleLightMode={toggleLightMode}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        aiEnabled={aiEnabled}
        toggleAiEnabled={toggleAiEnabled}
        voiceEnabled={voiceEnabled}
        toggleVoice={toggleVoice}
        displayMode={displayMode}
        toggleMode={toggleMode}
        stealthMode={stealthMode}
        toggleStealthMode={toggleStealthMode}
        activeTheme={activeTheme}
        changeTheme={changeTheme}
        openManual={() => setIsManualOpen(true)}
        requestPermissions={requestPermissions}
      />

      <ManualOverlay 
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        themeColor={ui.effectiveTheme}
        ui={ui}
      />

      <AppLauncher 
        appMode={appMode}
        themeColor={ui.effectiveTheme}
        ui={ui}
        switchAppMode={switchAppMode}
        toggleBtScan={toggleBtScan}
        isScanningBt={scanning}
      />
    </div>
  );
}
