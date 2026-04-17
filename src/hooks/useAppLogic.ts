
import { useState, useEffect, useRef } from 'react';
import { AppMode, THEMES, Theme } from '../types';
import { soundEngine } from '../services/sound-engine';
import { getDecimalTime, getDecimalDate } from '../lib/time-utils';
import { vibrate, sendNotification } from '../lib/device-utils';
import { getTacticalBriefing } from '../services/ai-service';
import { useComplications } from './useComplications';
import { useSpeedometer } from './useSpeedometer';
import { useStopwatch } from './useStopwatch';
import { useTimer } from './useTimer';
import { useAudioContext } from './useAudioContext';

export function useAppLogic() {
  const [now, setNow] = useState(new Date());
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [displayMode, setDisplayMode] = useState<'decimal' | 'standard'>('decimal');
  const [appMode, setAppMode] = useState<AppMode>('clock');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lightModeOverride, setLightModeOverride] = useState<boolean | null>(null);
  
  const [arEnabled, setArEnabled] = useState(false);
  const [btDevices, setBtDevices] = useState<{name: string, id: string, rssi?: number}[]>([]);
  const [isScanningBt, setIsScanningBt] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [decryptData, setDecryptData] = useState<{chars: string[]}>({chars: new Array(12).fill('0')});
  const [waterIntake, setWaterIntake] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStart, setSleepStart] = useState<number | null>(null);
  const [lastSleepDuration, setLastSleepDuration] = useState<number>(0);
  
  const [aiBriefing, setAiBriefing] = useState("INICIALIZANDO COMANDO...");
  const [missionLogs, setMissionLogs] = useState<{id: number, text: string, time: string}[]>(() => {
    const saved = localStorage.getItem('mission_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const { battery, sunTimes, hasGps, weather, network, tiltRef } = useComplications(arEnabled);
  const { speedData, resetMaxSpeed } = useSpeedometer(appMode);
  const { swRunning, swTime, swLaps, toggleStopwatch, lapOrResetStopwatch, updateStopwatch } = useStopwatch(soundEnabled, () => soundEngine.playButtonPress());
  const { tmRunning, tmDuration, tmRemaining, addTimerTime, toggleTimer, resetTimer, updateTimer } = useTimer(
    soundEnabled, 
    () => soundEngine.playButtonPress(), 
    () => soundEngine.playAlarm()
  );
  const { decibels, audioLevels, setAudioLevels, analyserRef, startMicMonitoring, stopAudio } = useAudioContext(appMode, micEnabled);

  const lastSecRef = useRef(-1);
  const lastMinRef = useRef(-1);
  const lastHourRef = useRef(-1);
  const lastDayRef = useRef(-1);
  const lastMonthRef = useRef(-1);
  const lastModeRef = useRef(displayMode);

  useEffect(() => {
    let animationFrameId: number;
    let lastRenderTime = 0;
    
    const loop = (timestamp: number) => {
      const newNow = new Date();
      const isHighRefresh = appMode === 'stopwatch' || appMode === 'timer';
      const throttleMs = isHighRefresh ? 16 : 100;
      
      if (appMode === 'decrypt' && timestamp - lastRenderTime >= 50) {
        setDecryptData(prev => ({
          chars: prev.chars.map(c => Math.random() > 0.8 ? '0123456789ABCDEF'[Math.floor(Math.random() * 16)] : c)
        }));
      }

      if (appMode === 'sonar' && analyserRef.current && timestamp - lastRenderTime >= 30) {
        const dataArray = new Uint8Array(60);
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioLevels(Array.from(dataArray));
      }

      if (timestamp - lastRenderTime >= throttleMs) {
        setNow(newNow);
        lastRenderTime = timestamp;
      }
      
      updateStopwatch();
      const finished = updateTimer();
      if (finished) {
        vibrate([200, 100, 200, 100, 200]);
        sendNotification("Timer Finished!", "Your timer has ended.");
      }

      // Sounds
      if (soundEnabled && appMode === 'clock') {
        const dMode = displayMode;
        if (lastModeRef.current !== dMode) {
          lastSecRef.current = -1; lastMinRef.current = -1; lastHourRef.current = -1; lastDayRef.current = -1; lastMonthRef.current = -1;
          lastModeRef.current = dMode;
        }

        let s, m, h, dy, mn;
        if (dMode === 'decimal') {
          const dt = getDecimalTime(newNow);
          const dd = getDecimalDate(newNow);
          s = dt.seconds; m = dt.minutes; h = dt.hours; dy = dd.dayOfMonth; mn = dd.month;
        } else {
          s = newNow.getSeconds(); m = newNow.getMinutes(); h = newNow.getHours(); dy = newNow.getDate(); mn = newNow.getMonth();
        }

        if (lastSecRef.current !== -1) {
          if (lastMonthRef.current !== mn && lastMonthRef.current !== -1) soundEngine.playMonthChange();
          else if (lastDayRef.current !== dy && lastDayRef.current !== -1) soundEngine.playDayChange();
          else if (lastHourRef.current !== h && lastHourRef.current !== -1) soundEngine.playHourChange();
          else if (lastMinRef.current !== m && lastMinRef.current !== -1) soundEngine.playMinuteChange();
          else if (lastSecRef.current !== s) soundEngine.playTick();
        }
        lastSecRef.current = s; lastMinRef.current = m; lastHourRef.current = h; lastDayRef.current = dy; lastMonthRef.current = mn;
      }

      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [appMode, displayMode, soundEnabled, analyserRef, updateStopwatch, updateTimer]);

  const toggleMode = () => {
    vibrate();
    const newMode = displayMode === 'decimal' ? 'standard' : 'decimal';
    setDisplayMode(newMode);
    if (soundEnabled) soundEngine.playToggle(newMode === 'decimal');
  };

  const changeTheme = (theme: Theme) => {
    vibrate();
    setActiveTheme(theme);
    if (soundEnabled) soundEngine.playThemeChange();
  };

  const toggleSound = () => {
    vibrate();
    if (!soundEnabled) {
      soundEngine.init();
      soundEngine.playThemeChange();
    }
    setSoundEnabled(!soundEnabled);
  };

  const switchAppMode = (mode: AppMode) => {
    vibrate();
    setAppMode(mode);
    if (soundEnabled) soundEngine.playButtonPress();
  };

  const toggleMic = () => {
    vibrate();
    if (micEnabled) {
      setMicEnabled(false);
      stopAudio();
    } else {
      setMicEnabled(true);
      startMicMonitoring();
    }
  };

  useEffect(() => {
    localStorage.setItem('mission_logs', JSON.stringify(missionLogs));
  }, [missionLogs]);

  const addMissionLog = (text: string) => {
    if (!text.trim()) return;
    const newLog = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString()
    };
    setMissionLogs(prev => [newLog, ...prev].slice(0, 50));
    vibrate();
    if (soundEnabled) soundEngine.playTick();
  };

  const clearLogs = () => {
    setMissionLogs([]);
    vibrate();
  };

  const fetchBriefing = async () => {
    setAiBriefing("REQUISITANDO DADOS...");
    const briefing = await getTacticalBriefing({
      battery: battery?.level ? Math.round(battery.level * 100) : 100,
      charging: battery?.charging || false,
      weather: weather.temp || 20,
      time: now.toLocaleTimeString(),
      mode: displayMode,
      appMode
    });
    setAiBriefing(briefing.toUpperCase());
    vibrate([50]);
  };

  useEffect(() => {
    const interval = setInterval(fetchBriefing, 60000 * 5); // Cada 5 min
    fetchBriefing();
    return () => clearInterval(interval);
  }, [battery, weather]);

  const handleCenterClick = () => {
    if (appMode === 'clock') toggleMode();
    else if (appMode === 'stopwatch') toggleStopwatch();
    else if (appMode === 'timer') toggleTimer();
    else if (appMode === 'speed') resetMaxSpeed();
    else if (appMode === 'water') {
      vibrate();
      if (soundEnabled) soundEngine.playButtonPress();
      setWaterIntake(w => Math.min(w + 250, 9999));
    }
    else if (appMode === 'sleep') {
      vibrate();
      if (soundEnabled) soundEngine.playButtonPress();
      if (isSleeping) {
        setLastSleepDuration(Date.now() - (sleepStart || Date.now()));
        setIsSleeping(false);
        setSleepStart(null);
      } else {
        setIsSleeping(true);
        setSleepStart(Date.now());
      }
    }
  };

  const toggleLightMode = () => {
    setLightModeOverride(prev => prev === null ? (sunTimes.rise <= now.getHours() && now.getHours() < sunTimes.set ? false : true) : !prev);
    soundEngine.playTick();
  };

  return {
    now, activeTheme, displayMode, appMode, soundEnabled, lightModeOverride,
    arEnabled, setArEnabled, btDevices, setBtDevices, isScanningBt, setIsScanningBt,
    micEnabled, decryptData, waterIntake, setWaterIntake, isSleeping, sleepStart, lastSleepDuration,
    setLastSleepDuration, battery, sunTimes, hasGps, weather, network, tiltRef,
    speedData, swRunning, swTime, swLaps, tmRunning, tmDuration, tmRemaining,
    decibels, audioLevels,
    toggleMode, changeTheme, toggleSound, switchAppMode, toggleMic, handleCenterClick, toggleLightMode,
    toggleStopwatch, lapOrResetStopwatch, addTimerTime, toggleTimer, resetTimer,
    aiBriefing, missionLogs, addMissionLog, clearLogs, fetchBriefing
  };
}
