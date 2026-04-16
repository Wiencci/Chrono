import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Battery, Activity, Clock, RefreshCw, Volume2, VolumeX, Play, Square, Flag, Timer, RotateCcw, MapPin, Zap, Bell, Gauge, Navigation, Thermometer, Wifi, WifiOff, Mic, MicOff, Sunrise, Sunset, Eye, Scan, Bluetooth, Camera, Orbit, Globe, Compass, Radio, Hash, Droplet, Bed } from 'lucide-react';

declare global {
  interface Navigator {
    bluetooth: any;
  }
}

// --- Sound Engine (Web Audio API) ---
class SoundEngine {
  ctx: AudioContext | null = null;
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playThemeChange() {
    if (!this.ctx) return;
    const playBlip = (timeOffset: number, freq: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + timeOffset);
      gain.gain.setValueAtTime(0.02, this.ctx!.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + timeOffset + 0.1);
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2500;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(this.ctx!.currentTime + timeOffset);
      osc.stop(this.ctx!.currentTime + timeOffset + 0.1);
    };
    playBlip(0, 1200);
    playBlip(0.08, 1600);
  }

  playToggle(toDecimal: boolean) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    if (toDecimal) {
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.4);
      filter.frequency.setValueAtTime(500, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, this.ctx.currentTime + 0.4);
    } else {
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);
      filter.frequency.setValueAtTime(3000, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.4);
    }
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playMinuteChange() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playHourChange() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(880, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(); osc2.start();
    osc1.stop(this.ctx.currentTime + 1.0); osc2.stop(this.ctx.currentTime + 1.0);
  }

  playDayChange() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 2);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 2);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);
  }

  playMonthChange() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc1.type = 'square';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65.41, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(65.8, this.ctx.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, this.ctx.currentTime + 1.5);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 4);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 5);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(); osc2.start();
    osc1.stop(this.ctx.currentTime + 5); osc2.stop(this.ctx.currentTime + 5);
  }

  playButtonPress() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playBeep() {
    this.playButtonPress();
  }

  playAlarm() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 1.0);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 1.5);
    osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 2.0);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);
  }
}

const soundEngine = new SoundEngine();

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
  const msSinceMidnight = date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
  const totalDecimalSeconds = msSinceMidnight / 864;
  const hours = Math.floor(totalDecimalSeconds / 10000);
  const minutes = Math.floor((totalDecimalSeconds % 10000) / 100);
  const seconds = Math.floor(totalDecimalSeconds % 100);
  return { hours, minutes, seconds, totalDecimalSeconds };
}

// Approximate Sunrise/Sunset calculation
function getSunTimes(lat: number, lng: number, date: Date) {
  const rad = Math.PI / 180;
  const d = getDayOfYear(date);
  const declination = 23.45 * Math.sin(rad * (360 / 365) * (d - 81));
  const eqTime = 9.87 * Math.sin(2 * rad * (360 / 365) * (d - 81)) - 7.53 * Math.cos(rad * (360 / 365) * (d - 81)) - 1.5 * Math.sin(rad * (360 / 365) * (d - 81));
  let cosHA = -Math.tan(rad * lat) * Math.tan(rad * declination);
  cosHA = Math.max(-1, Math.min(1, cosHA)); // Clamp to prevent NaN
  const hourAngle = Math.acos(cosHA) / rad;
  const sunrise = 12 - (hourAngle / 15) - (lng / 15) - (eqTime / 60);
  const sunset = 12 + (hourAngle / 15) - (lng / 15) - (eqTime / 60);
  const tzOffset = date.getTimezoneOffset() / 60;
  return { rise: sunrise - tzOffset, set: sunset - tzOffset };
}

type AppMode = 'clock' | 'stopwatch' | 'timer' | 'speed' | 'scanner' | 'radar' | 'orbit' | 'nav' | 'sonar' | 'decrypt' | 'water' | 'sleep';

export default function App() {
  const [now, setNow] = useState(new Date());
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [displayMode, setDisplayMode] = useState<'decimal' | 'standard'>('decimal');
  const [appMode, setAppMode] = useState<AppMode>('clock');
  const tiltRef = useRef({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lightModeOverride, setLightModeOverride] = useState<boolean | null>(null);
  
  // AR & Camera State
  const [arEnabled, setArEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Bluetooth State
  const [btDevices, setBtDevices] = useState<{name: string, id: string, rssi?: number}[]>([]);
  const [isScanningBt, setIsScanningBt] = useState(false);

  // Real-world Complications State
  const [battery, setBattery] = useState<{ level: number, charging: boolean } | null>(null);
  const [sunTimes, setSunTimes] = useState<{ rise: number, set: number }>({ rise: 6, set: 18 }); // Default 6am-6pm
  const [hasGps, setHasGps] = useState(false);
  const [weather, setWeather] = useState<{ temp: number | null }>({ temp: null });
  const [network, setNetwork] = useState<string | null>(null);
  const [decibels, setDecibels] = useState<number | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);

  // Refs for audio cleanup
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAnimRef = useRef<number | null>(null);

  // Stopwatch State
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [swLaps, setSwLaps] = useState<number[]>([]);
  
  // Timer State
  const [tmRunning, setTmRunning] = useState(false);
  const [tmDuration, setTmDuration] = useState(0);
  const [tmRemaining, setTmRemaining] = useState(0);

  // Speedometer State
  const [speedData, setSpeedData] = useState<{ speed: number | null, heading: number | null, maxSpeed: number, latitude: number | null, longitude: number | null, altitude: number | null, accuracy: number | null }>({ speed: null, heading: null, maxSpeed: 0, latitude: null, longitude: null, altitude: null, accuracy: null });

  // Sonar State
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(60).fill(0));

  // Decrypt State
  const [decryptData, setDecryptData] = useState<{chars: string[]}>({chars: new Array(12).fill('0')});

  // Water & Sleep State
  const [waterIntake, setWaterIntake] = useState(0);
  const waterGoal = 2000;
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStart, setSleepStart] = useState<number | null>(null);
  const [lastSleepDuration, setLastSleepDuration] = useState<number>(0);

  // Refs for animation loop
  const clockRef = useRef<HTMLDivElement>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const displayModeRef = useRef(displayMode);
  const lastModeRef = useRef(displayMode);
  
  const swRunningRef = useRef(swRunning);
  const swStartTimeRef = useRef(0);
  const swAccumulatedRef = useRef(0);
  
  const tmRunningRef = useRef(tmRunning);
  const tmEndTimeRef = useRef(0);

  const lastSecRef = useRef(-1);
  const lastMinRef = useRef(-1);
  const lastHourRef = useRef(-1);
  const lastDayRef = useRef(-1);
  const lastMonthRef = useRef(-1);

  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);
  useEffect(() => { displayModeRef.current = displayMode; }, [displayMode]);
  useEffect(() => { swRunningRef.current = swRunning; }, [swRunning]);
  useEffect(() => { tmRunningRef.current = tmRunning; }, [tmRunning]);

  // Speedometer GPS Watcher
  useEffect(() => {
    let watchId: number;
    if ((appMode === 'speed' || appMode === 'nav') && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const s = pos.coords.speed; // m/s
          const h = pos.coords.heading;
          setSpeedData(prev => ({
            speed: s,
            heading: h,
            maxSpeed: s !== null && s > prev.maxSpeed ? s : prev.maxSpeed,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitude: pos.coords.altitude,
            accuracy: pos.coords.accuracy
          }));
        },
        (err) => console.warn('Speedometer GPS error:', err),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [appMode]);

  // Initialize Complications (Battery & GPS & Network)
  useEffect(() => {
    // Network Status
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      setNetwork(conn.effectiveType || 'online');
      conn.addEventListener('change', () => setNetwork(conn.effectiveType || 'online'));
    } else {
      setNetwork(navigator.onLine ? 'online' : 'offline');
      window.addEventListener('online', () => setNetwork('online'));
      window.addEventListener('offline', () => setNetwork('offline'));
    }

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        setBattery({ level: b.level, charging: b.charging });
        b.addEventListener('levelchange', () => setBattery(prev => prev ? { ...prev, level: b.level } : null));
        b.addEventListener('chargingchange', () => setBattery(prev => prev ? { ...prev, charging: b.charging } : null));
      });
    }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setSunTimes(getSunTimes(latitude, longitude, new Date()));
        setHasGps(true);
        
        // Fetch weather
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          .then(res => res.json())
          .then(data => {
            if (data.current_weather) {
              setWeather({ temp: data.current_weather.temperature });
            }
          })
          .catch(err => console.error('Failed to fetch weather', err));
          
      }, () => {
        console.warn('GPS denied, using default sun times.');
      });
    }

    // Device Orientation for 3D Tilt
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // beta is front-to-back tilt (-180 to 180)
      // gamma is left-to-right tilt (-90 to 90)
      let x = e.beta - 45; // Center around typical holding angle
      let y = e.gamma;
      
      // Clamp values for subtle effect
      x = Math.max(-30, Math.min(30, x));
      y = Math.max(-30, Math.min(30, y));
      
      if (clockRef.current) {
        tiltRef.current = { x: -x, y: y };
        clockRef.current.style.transform = `rotateX(${-x}deg) rotateY(${y}deg)`;
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const vibrate = (ms: number | number[] = 50) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Ignore
      }
    }
  };

  const requestNotification = () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const toggleMic = async () => {
    vibrate();
    if (micEnabled) {
      setMicEnabled(false);
      setDecibels(null);
      if (micAnimRef.current) cancelAnimationFrame(micAnimRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateDb = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        // Map 0-255 to roughly 30-100 dB for visual effect
        const db = Math.round(30 + (avg / 255) * 70);
        setDecibels(db);
        micAnimRef.current = requestAnimationFrame(updateDb);
      };

      updateDb();
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      micStreamRef.current = stream;
      setMicEnabled(true);
    } catch (err) {
      console.warn("Mic access denied", err);
    }
  };

  // Main Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastRenderTime = 0;
    
    const updateTime = (timestamp: number) => {
      const newNow = new Date();
      
      // If we are in clock/speed/scanner/radar mode, we only need to update the UI
      // a few times per second (e.g., 5-10 fps). For stopwatch/timer, we need ~60fps.
      const isHighRefresh = appMode === 'stopwatch' || appMode === 'timer';
      const throttleMs = isHighRefresh ? 16 : 100; // ~60fps vs ~10fps
      
      // Decrypt Logic
      if (appMode === 'decrypt') {
         if (timestamp - lastRenderTime >= 50) { // faster refresh for matrix effect
            setDecryptData(prev => ({
              chars: prev.chars.map((c, i) => Math.random() > 0.8 ? '0123456789ABCDEF'[Math.floor(Math.random() * 16)] : c)
            }));
         }
      }

      // Sonar Logic
      if (appMode === 'sonar' && analyserRef.current) {
         if (timestamp - lastRenderTime >= 30) {
            const dataArray = new Uint8Array(60); // Match ring circumference
            analyserRef.current.getByteFrequencyData(dataArray);
            // Array from instead of subarray
            setAudioLevels(Array.from(dataArray));
         }
      }

      if (timestamp - lastRenderTime >= throttleMs) {
        setNow(newNow);
        lastRenderTime = timestamp;
      }
      
      // Stopwatch Logic
      if (swRunningRef.current) {
        setSwTime(swAccumulatedRef.current + (Date.now() - swStartTimeRef.current));
      }

      // Timer Logic
      if (tmRunningRef.current) {
        const remaining = tmEndTimeRef.current - Date.now();
        if (remaining <= 0) {
          setTmRemaining(0);
          setTmRunning(false);
          tmRunningRef.current = false;
          vibrate([200, 100, 200, 100, 200]);
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("Timer Finished!", { body: "Your timer has ended." });
          }
          if (soundEnabledRef.current) soundEngine.playAlarm();
        } else {
          setTmRemaining(remaining);
        }
      }

      // Clock Ticking & Transition Sounds
      if (soundEnabledRef.current && appMode === 'clock') {
        const currentMode = displayModeRef.current;
        let currentSec = -1, currentMin = -1, currentHour = -1, currentDay = -1, currentMonth = -1;
        
        if (lastModeRef.current !== currentMode) {
          lastSecRef.current = -1; lastMinRef.current = -1; lastHourRef.current = -1; lastDayRef.current = -1; lastMonthRef.current = -1;
          lastModeRef.current = currentMode;
        }
        
        if (currentMode === 'decimal') {
          const msSinceMidnight = newNow.getHours() * 3600000 + newNow.getMinutes() * 60000 + newNow.getSeconds() * 1000 + newNow.getMilliseconds();
          const totalDecimalSeconds = msSinceMidnight / 864;
          currentSec = Math.floor(totalDecimalSeconds % 100);
          currentMin = Math.floor((totalDecimalSeconds % 10000) / 100);
          currentHour = Math.floor(totalDecimalSeconds / 10000);
          const dDate = getDecimalDate(newNow);
          currentDay = dDate.dayOfMonth;
          currentMonth = dDate.month;
        } else {
          currentSec = newNow.getSeconds();
          currentMin = newNow.getMinutes();
          currentHour = newNow.getHours();
          currentDay = newNow.getDate();
          currentMonth = newNow.getMonth();
        }
        
        if (lastSecRef.current !== -1) {
          if (lastMonthRef.current !== currentMonth && lastMonthRef.current !== -1) soundEngine.playMonthChange();
          else if (lastDayRef.current !== currentDay && lastDayRef.current !== -1) soundEngine.playDayChange();
          else if (lastHourRef.current !== currentHour && lastHourRef.current !== -1) soundEngine.playHourChange();
          else if (lastMinRef.current !== currentMin && lastMinRef.current !== -1) soundEngine.playMinuteChange();
          else if (lastSecRef.current !== currentSec) soundEngine.playTick();
        }
        
        lastSecRef.current = currentSec; lastMinRef.current = currentMin; lastHourRef.current = currentHour; lastDayRef.current = currentDay; lastMonthRef.current = currentMonth;
      }

      animationFrameId = requestAnimationFrame(updateTime);
    };
    updateTime(performance.now());
    return () => cancelAnimationFrame(animationFrameId);
  }, [appMode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / rect.height) * 30;
    const tiltY = (x / rect.width) * 30;
    tiltRef.current = { x: tiltX, y: tiltY };
    clockRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!clockRef.current) return;
    tiltRef.current = { x: 0, y: 0 };
    clockRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  const toggleMode = () => {
    vibrate();
    const newMode = displayMode === 'decimal' ? 'standard' : 'decimal';
    setDisplayMode(newMode);
    if (soundEnabled) soundEngine.playToggle(newMode === 'decimal');
  };

  const changeTheme = (theme: typeof THEMES[0]) => {
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

  // Sonar Mic Handling
  useEffect(() => {
    if (appMode === 'sonar') {
      const initSonar = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;
          const ctx = new AudioContext();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128; // 64 frequency bins
          source.connect(analyser);
          analyserRef.current = analyser;
        } catch (e) {
          console.error("Microphone access denied for Sonar:", e);
        }
      };
      initSonar();
    } else {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    }
    
    return () => {
      // Don't kill audio automatically on unmount if it's just a re-render, 
      // but managed by appMode it's handled above in the else block.
    };
  }, [appMode]);

  // Bluetooth Scanner Web API
  const toggleBtScan = async () => {
    if (!navigator.bluetooth) {
      alert("Web Bluetooth API is not supported in this browser.");
      return;
    }
    
    if (isScanningBt) {
      setIsScanningBt(false);
      return;
    }

    try {
      setIsScanningBt(true);
      if (soundEnabled) soundEngine.playTick();
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
      
      setBtDevices(prev => {
        if (!prev.find(d => d.id === device.id)) {
          return [...prev, { name: device.name || 'Unknown Device', id: device.id, rssi: Math.floor(Math.random() * -50) - 40 }];
        }
        return prev;
      });
      setIsScanningBt(false);
      if (soundEnabled) soundEngine.playBeep();
    } catch (e) {
      console.warn("Bluetooth scan cancelled or failed", e);
      setIsScanningBt(false);
    }
  };

  // AR Camera Controls
  const toggleAR = async () => {
    if (arEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setArEnabled(false);
      if (soundEnabled) soundEngine.playTick();
    } else {
      try {
        // First try to get the environment camera, fallback to any camera if that fails
        let stream;
        try {
           stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch (e) {
           stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setArEnabled(true);
        if (soundEnabled) soundEngine.playBeep();
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Não foi possível acessar a câmera para o modo AR. Verifique as permissões de câmera do seu navegador.");
      }
    }
  };

  // Stopwatch Controls
  const toggleStopwatch = () => {
    vibrate();
    if (soundEnabled) soundEngine.playButtonPress();
    if (swRunning) {
      setSwRunning(false);
      swAccumulatedRef.current += Date.now() - swStartTimeRef.current;
    } else {
      setSwRunning(true);
      swStartTimeRef.current = Date.now();
    }
  };
  const lapOrResetStopwatch = () => {
    vibrate();
    if (soundEnabled) soundEngine.playButtonPress();
    if (swRunning) {
      setSwLaps(prev => [swTime, ...prev].slice(0, 5)); // Keep last 5 laps
    } else {
      setSwTime(0);
      swAccumulatedRef.current = 0;
      setSwLaps([]);
    }
  };

  // Timer Controls
  const addTimerTime = (mins: number) => {
    vibrate();
    if (soundEnabled) soundEngine.playButtonPress();
    const ms = mins * 60000;
    setTmDuration(prev => prev + ms);
    setTmRemaining(prev => prev + ms);
  };
  const toggleTimer = () => {
    vibrate();
    requestNotification();
    if (soundEnabled) soundEngine.playButtonPress();
    if (tmRemaining <= 0) return;
    if (tmRunning) {
      setTmRunning(false);
    } else {
      setTmRunning(true);
      tmEndTimeRef.current = Date.now() + tmRemaining;
    }
  };
  const resetTimer = () => {
    vibrate();
    if (soundEnabled) soundEngine.playButtonPress();
    setTmRunning(false);
    setTmDuration(0);
    setTmRemaining(0);
  };

  const resetMaxSpeed = () => {
    vibrate();
    if (soundEnabled) soundEngine.playButtonPress();
    setSpeedData(prev => ({ ...prev, maxSpeed: 0 }));
  };

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

  // Clock Calculations
  const decimalTime = getDecimalTime(now);
  const decimalDate = getDecimalDate(now);
  const currentStandardHour = now.getHours() + now.getMinutes() / 60;
  const isDay = currentStandardHour >= sunTimes.rise && currentStandardHour < sunTimes.set;
  const isLightMode = lightModeOverride !== null ? lightModeOverride : isDay;

  const toggleLightMode = () => {
    setLightModeOverride(!isLightMode);
    soundEngine.playTick(); // Tick sound for UI interaction
  };
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const pad3 = (n: number) => n.toString().padStart(3, '0');
  const themeColor = activeTheme.hex;

  // Planet Orbits Calculation (J2000 epoch: Jan 1, 2000 12:00 UTC)
  const daysSinceJ2000 = (now.getTime() - 946728000000) / 86400000;
  const planets = {
    mercury: ((daysSinceJ2000 / 87.969) * 360) % 360,
    venus: ((daysSinceJ2000 / 224.701) * 360) % 360,
    earth: ((daysSinceJ2000 / 365.256) * 360) % 360,
  };

  // Theme UI mapping
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

  // SVG Ring calculations based on App Mode
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
    offsetHours = circHours - (((swTime / 60000) % 60) / 60) * circHours; // Minutes
    offsetMins = circMins - (((swTime / 1000) % 60) / 60) * circMins; // Seconds
    offsetSecs = circSecs - ((swTime % 1000) / 1000) * circSecs; // Milliseconds
  } else if (appMode === 'timer') {
    const progress = tmDuration > 0 ? tmRemaining / tmDuration : 0;
    offsetHours = circHours - progress * circHours;
    offsetMins = circMins - ((tmRemaining % 60000) / 60000) * circMins; // Seconds progress
    offsetSecs = circSecs; // Unused in timer
  } else if (appMode === 'speed') {
    const speedKmh = (speedData.speed || 0) * 3.6;
    const maxSpeedKmh = speedData.maxSpeed * 3.6;
    offsetHours = circHours - Math.min(speedKmh / 200, 1) * circHours; // 0 to 200 km/h
    offsetMins = circMins - (maxSpeedKmh > 0 ? Math.min(speedKmh / maxSpeedKmh, 1) : 0) * circMins; // Relative to max speed
    offsetSecs = circSecs; // Unused in speed
  } else if (appMode === 'scanner' || appMode === 'radar') {
    offsetHours = circHours;
    offsetMins = circMins;
    offsetSecs = circSecs;
  }

  return (
    <div className={`min-h-screen ${ui.bgApp} flex flex-col items-center justify-center ${ui.textMain} font-['Share_Tech_Mono',_monospace] selection:bg-white selection:text-black p-4 overflow-hidden transition-colors duration-1000 relative`}>
      
      {/* AR Background Video */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${arEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ filter: `sepia(100%) hue-rotate(${activeTheme.id === 'cyber' ? 180 : activeTheme.id === 'matrix' ? 90 : activeTheme.id === 'blood' ? -50 : activeTheme.id === 'gold' ? 0 : 220}deg) saturate(200%) brightness(50%)` }}
      />
      
      {/* AR Scanlines Overlay */}
      {arEnabled && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)', backgroundSize: '100% 4px' }}></div>
      )}

      {/* Title */}
      <div className="text-center mb-6 sm:mb-8 max-w-md z-10 mt-12 sm:mt-0">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          DECIMAL<span style={{ color: themeColor, textShadow: `0 0 15px ${themeColor}` }}>CHRONO</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-[0.3em]">
          {appMode === 'clock' ? 'Sistema de Tempo Alternativo' : appMode === 'stopwatch' ? 'Cronômetro de Precisão' : appMode === 'timer' ? 'Purga de Sistema (Timer)' : appMode === 'speed' ? 'Telemetria de Velocidade' : appMode === 'scanner' ? 'Módulo de Reconhecimento' : 'Radar de Proximidade BLE'}
        </p>
      </div>

      {/* Controls (Theme & Sound & Light Mode & AR) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-wrap justify-end gap-3 sm:gap-6 z-20 max-w-[40vw]">
        
        <button 
          onClick={toggleAR}
          className={`${ui.textMuted} hover:${isLightMode && !arEnabled ? 'text-black' : 'text-white'} transition-colors relative`}
          title={arEnabled ? "Desativar Visão AR" : "Ativar Visão AR"}
        >
          {arEnabled ? <Eye size={20} style={{ color: themeColor, filter: `drop-shadow(0 0 5px ${themeColor})` }} /> : <Eye size={20} className="opacity-50" />}
          {arEnabled && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }}></span>}
        </button>

        <button 
          onClick={toggleLightMode}
          className={`${ui.textMuted} hover:${isLightMode && !arEnabled ? 'text-black' : 'text-white'} transition-colors`}
          title={isLightMode ? "Ativar Modo Escuro" : "Ativar Modo Claro"}
        >
          {isLightMode ? <Sun size={20} style={{ color: themeColor, filter: `drop-shadow(0 0 5px ${themeColor})` }} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={toggleSound}
          className={`${ui.textMuted} hover:${isLightMode ? 'text-black' : 'text-white'} transition-colors`}
          title={soundEnabled ? "Desativar Som" : "Ativar Som"}
        >
          {soundEnabled ? <Volume2 size={20} style={{ color: themeColor, filter: `drop-shadow(0 0 5px ${themeColor})` }} /> : <VolumeX size={20} />}
        </button>
        
        <div className="flex space-x-2 sm:space-x-3">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => changeTheme(theme)}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 ${activeTheme.id === theme.id ? 'scale-125' : 'scale-100 opacity-50 hover:opacity-100'}`}
              style={{ 
                backgroundColor: theme.hex, 
                borderColor: activeTheme.id === theme.id ? (arEnabled ? '#fff' : '#fff') : 'transparent',
                boxShadow: activeTheme.id === theme.id ? `0 0 15px ${theme.hex}` : 'none'
              }}
              title={theme.name}
            />
          ))}
        </div>
      </div>

      {/* Main Clock Container with 3D Tilt */}
      <div 
        className="relative perspective-[1000px] z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={clockRef}
          className={`relative w-[350px] h-[350px] sm:w-[460px] sm:h-[460px] rounded-full border-[12px] sm:border-[14px] ${ui.borderClock} ${ui.bgClock} flex items-center justify-center transition-transform duration-100 ease-out`}
          style={{ 
            boxShadow: ui.clockShadow,
            transition: 'background-color 1s ease, border-color 1s ease, transform 0.1s ease-out'
          }}
        >
          {/* Circular Mode Selector (Contouring the top of the clock) */}
          {[
            { id: 'clock', icon: Clock, label: 'CHRONO' },
            { id: 'stopwatch', icon: Timer, label: 'SW' },
            { id: 'timer', icon: Bell, label: 'TIMER' },
            { id: 'speed', icon: Gauge, label: 'SPEED' },
            { id: 'scanner', icon: Scan, label: 'SCAN' },
            { id: 'radar', icon: Bluetooth, label: 'RADAR' },
            { id: 'orbit', icon: Orbit, label: 'ORBIT' },
            { id: 'nav', icon: Compass, label: 'NAV' },
            { id: 'sonar', icon: Radio, label: 'SONAR' },
            { id: 'decrypt', icon: Hash, label: 'DECRYPT' },
            { id: 'water', icon: Droplet, label: 'WATER' },
            { id: 'sleep', icon: Bed, label: 'SLEEP' }
          ].map((m, i, arr) => {
            const angle = -Math.PI / 2 + (i - (arr.length - 1) / 2) * (Math.PI / 12); // Spread across the top arc with tighter spacing
            const radius = 56; // % distance, pushing them just outside the border
            const top = 50 + radius * Math.sin(angle);
            const left = 50 + radius * Math.cos(angle);
            return (
              <button
                key={m.id}
                onClick={() => switchAppMode(m.id as AppMode)}
                className={`absolute z-50 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-transparent transition-all duration-300 ${appMode === m.id ? 'bg-black/80 backdrop-blur-md scale-110' : `hover:bg-black/40 ${ui.bgApp}`}`}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: 'translate(-50%, -50%)',
                  ...(appMode === m.id ? { 
                    borderColor: themeColor, 
                    color: themeColor, 
                    boxShadow: `0 0 15px ${themeColor}60` 
                  } : {
                    color: isLightMode && !arEnabled ? '#666' : '#999'
                  })
                }}
                title={m.label}
              >
                <m.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )
          })}
          
          {/* Background texture */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-[#0a0a0a] to-[#000] rounded-full"></div>

          {/* Outer tick marks */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 400 400">
            {Array.from({ length: (appMode === 'clock' && displayMode === 'decimal') ? 100 : 60 }).map((_, i) => {
              const total = (appMode === 'clock' && displayMode === 'decimal') ? 100 : 60;
              const angle = (i / total) * 360;
              const rad = (angle - 90) * (Math.PI / 180);
              const isMajor = (appMode === 'clock' && displayMode === 'decimal') ? i % 10 === 0 : i % 5 === 0;
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
                  stroke={isMajor ? themeColor : ui.tickMuted} 
                  strokeWidth={isMajor ? "3" : "1.5"} 
                  style={isMajor ? { filter: `drop-shadow(0 0 4px ${themeColor})` } : { transition: 'stroke 1s ease' }}
                />
              );
            })}
          </svg>

          {/* Rings */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 z-20 pointer-events-none" viewBox="0 0 400 400">
            {/* Outer Ring (Hours / SW Mins / Timer Progress) */}
            <circle cx="200" cy="200" r={radiusHours} fill="none" stroke={ui.ringBg} strokeWidth="8" style={{ transition: 'stroke 1s ease' }} />
            <circle cx="200" cy="200" r={radiusHours} fill="none" stroke={themeColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circHours} strokeDashoffset={offsetHours}
              style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}
              className={appMode === 'stopwatch' ? '' : 'transition-all duration-75 ease-linear'} />

            {/* Middle Ring (Mins / SW Secs / Timer Secs) */}
            <circle cx="200" cy="200" r={radiusMins} fill="none" stroke={ui.ringBg} strokeWidth="6" style={{ transition: 'stroke 1s ease' }} />
            <circle cx="200" cy="200" r={radiusMins} fill="none" stroke={themeColor} strokeWidth="6" strokeLinecap="round" strokeOpacity={appMode === 'decrypt' ? "0.2" : "0.7"}
              strokeDasharray={circMins} strokeDashoffset={offsetMins}
              style={{ filter: `drop-shadow(0 0 6px ${themeColor}60)` }}
              className={appMode === 'stopwatch' ? '' : 'transition-all duration-75 ease-linear'} />

            {/* Inner Ring (Secs / SW Ms / Unused) */}
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
                  {/* The Moon */}
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
                       const barHeight = 10 + (val / 255) * 50; // max 60 height
                       // We map around radius 160
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
                <circle cx="200" cy="200" r={radiusHours - 10} fill="none" stroke="#2563eb" strokeWidth="20" opacity="0.1" />
                <circle cx="200" cy="200" r={radiusHours - 10} fill="none" stroke="#3b82f6" strokeWidth="20" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * (radiusHours - 10)} 
                  strokeDashoffset={2 * Math.PI * (radiusHours - 10) * (1 - Math.min(waterIntake / waterGoal, 1))}
                  style={{ transition: 'stroke-dashoffset 1s ease-out', filter: 'drop-shadow(0 0 10px #3b82f6)' }}
                />
              </g>
            )}

            {/* Sleep Breathing Ring */}
            {appMode === 'sleep' && isSleeping && (
              <circle cx="200" cy="200" r="150" fill="none" stroke="#6366f1" strokeWidth="4" 
                className="animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" 
                opacity="0.3"
              />
            )}
          </svg>

          {/* Center Action Button / Celestial Body */}
          <button 
            onClick={handleCenterClick}
            className={`absolute z-40 w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center ${ui.btnBg} border-2 ${ui.btnBorder} shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:scale-105 ${ui.btnHoverBorder} transition-all duration-300 group cursor-pointer`}
            title={appMode === 'clock' ? "Alternar Modo" : appMode === 'speed' ? "Zerar Max Speed" : appMode === 'water' ? "+250ml" : appMode === 'sleep' ? "Dormir/Acordar" : "Ação Central"}
          >
            {appMode === 'clock' ? (
               isDay ? (
                 <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                    <Sun className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:rotate-45 transition-transform duration-500" />
                 </div>
               ) : (
                 <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                    <Moon className="w-7 h-7 sm:w-9 sm:h-9 text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.4)] group-hover:-rotate-12 transition-transform duration-500" />
                 </div>
               )
            ) : appMode === 'stopwatch' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  {swRunning ? <Square className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" /> : <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" />}
               </div>
            ) : appMode === 'timer' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  {tmRunning ? <Square className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" /> : <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} fill="currentColor" />}
               </div>
            ) : appMode === 'speed' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  <Navigation className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})`, transform: `rotate(${speedData.heading || 0}deg)` }} fill="currentColor" />
               </div>
            ) : appMode === 'scanner' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  <Scan className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />
               </div>
            ) : appMode === 'radar' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  <Bluetooth className={`w-7 h-7 sm:w-9 sm:h-9 ${isScanningBt ? 'animate-pulse' : ''}`} style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />
               </div>
            ) : appMode === 'nav' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  <Compass className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})`, transform: `rotate(${-(speedData.heading || 0)}deg)` }} />
               </div>
            ) : appMode === 'sonar' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: `${themeColor}20` }}></div>
                  <Radio className="w-7 h-7 sm:w-9 sm:h-9 animate-pulse" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />
               </div>
            ) : appMode === 'decrypt' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${themeColor}20` }}></div>
                   <Hash className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />
               </div>
            ) : appMode === 'water' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${themeColor}20` }}></div>
                   <Droplet className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: themeColor, filter: `drop-shadow(0 0 10px ${themeColor})` }} />
               </div>
            ) : appMode === 'sleep' ? (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-xl" style={{ backgroundColor: isSleeping ? '#4f46e540' : `${themeColor}20` }}></div>
                   <Bed className={`w-7 h-7 sm:w-9 sm:h-9 ${isSleeping ? 'animate-pulse' : ''}`} style={{ color: isSleeping ? '#818cf8' : themeColor, filter: `drop-shadow(0 0 10px ${isSleeping ? '#818cf8' : themeColor})` }} />
               </div>
            ) : (
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/20 rounded-full blur-xl animate-[pulse_4s_ease-in-out_infinite]"></div>
                  <Sun className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-[spin_20s_linear_infinite]" />
               </div>
            )}
             
             {/* Hover indicator */}
             <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/10 scale-110 transition-all duration-300"></div>
          </button>

          {/* Top Text: Time / SW / Timer / Speed */}
          <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none" viewBox="0 0 400 400">
            <defs>
              <path id="topArc" d="M 125,200 A 75,75 0 0,1 275,200" />
              <path id="bottomArc" d="M 125,200 A 75,75 0 0,0 275,200" />
              <path id="topArcLabel" d="M 100,200 A 100,100 0 0,1 300,200" />
              <path id="bottomArcLabel" d="M 100,200 A 100,100 0 0,0 300,200" />
            </defs>

            {/* Top Main Text */}
            <text fill="transparent" stroke={themeColor} strokeWidth="1.2" fontSize="26" fontWeight="bold" letterSpacing="3" style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}>
              <textPath href="#topArc" startOffset="50%" textAnchor="middle" dominantBaseline="alphabetic">
                {appMode === 'clock' && (
                  <>
                    {displayMode === 'decimal' ? pad(decimalTime.hours) : pad(now.getHours())}
                    <tspan className="animate-pulse">:</tspan>
                    {displayMode === 'decimal' ? pad(decimalTime.minutes) : pad(now.getMinutes())}
                    <tspan className="animate-pulse">:</tspan>
                    <tspan stroke="#555" style={{ filter: 'none' }}>{displayMode === 'decimal' ? pad(decimalTime.seconds) : pad(now.getSeconds())}</tspan>
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
                {appMode === 'speed' && (
                  <>
                    {((speedData.speed || 0) * 8.64).toFixed(1)}
                  </>
                )}
                {appMode === 'scanner' && 'READY'}
                {appMode === 'radar' && btDevices.length.toString().padStart(2, '0')}
                {appMode === 'orbit' && 'ORBITAL'}
                {appMode === 'nav' && (speedData.latitude !== null ? `${Math.abs(speedData.latitude).toFixed(4)}° ${speedData.latitude >= 0 ? 'N' : 'S'}` : 'SEARCHING...')}
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
                    <>
                      {pad(Math.floor(lastSleepDuration / 3600000))}:{pad(Math.floor((lastSleepDuration % 3600000) / 60000))}
                    </>
                  ) : 'RESTING')}
              </textPath>
            </text>

            {/* Top Label */}
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

            {/* Bottom Main Text */}
            <text fill="transparent" stroke={themeColor} strokeWidth="1" fontSize="16" fontWeight="bold" letterSpacing="3" style={{ filter: `drop-shadow(0 0 8px ${themeColor}80)` }}>
              <textPath href="#bottomArc" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
                {appMode === 'clock' && (
                  displayMode === 'decimal' 
                    ? `${MONTHS[decimalDate.month - 1]} • ${DAYS[decimalDate.dayOfWeek - 1]}` 
                    : now.toLocaleDateString('pt-BR')
                )}
                {appMode === 'speed' && (
                  `${(speedData.maxSpeed * 8.64).toFixed(1)} MAX`
                )}
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

            {/* Bottom Label */}
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

          {/* Bottom Panel for SW / Timer / Speed / Water */}
          {appMode === 'stopwatch' && (
            <div className="absolute bottom-[12%] z-30 flex flex-col items-center w-full px-12">
              <div className="flex space-x-4 mb-3">
                <button onClick={lapOrResetStopwatch} className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-3 py-1 rounded transition-colors ${ui.controlBtnBorder}`}>
                  {swRunning ? <><Flag size={10} /><span>Lap</span></> : <><RotateCcw size={10} /><span>Reset</span></>}
                </button>
              </div>
              <div className={`flex flex-col w-full text-[9px] ${ui.textMuted} space-y-1 max-h-[40px] overflow-hidden`}>
                {swLaps.map((lap, i) => (
                  <div key={i} className={`flex justify-between w-full border-b ${ui.dividerBorder} pb-0.5`}>
                    <span>LAP {swLaps.length - i}</span>
                    <span style={{ color: themeColor }}>{pad(Math.floor(lap / 60000))}:{pad(Math.floor((lap % 60000) / 1000))}.{pad3(lap % 1000)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {appMode === 'timer' && (
            <div className="absolute bottom-[14%] z-30 flex flex-col items-center w-full px-12">
              {!tmRunning && tmRemaining === 0 ? (
                <div className="flex space-x-2">
                  {[1, 5, 15].map(m => (
                    <button key={m} onClick={() => addTimerTime(m)} className={`text-[10px] border px-3 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`} style={{ color: themeColor }}>
                      +{m}m
                    </button>
                  ))}
                </div>
              ) : (
                <button onClick={resetTimer} className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-4 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`}>
                  <RotateCcw size={12} /><span>Reset</span>
                </button>
              )}
            </div>
          )}

          {appMode === 'water' && (
            <div className="absolute bottom-[16%] z-30 flex flex-col items-center w-full px-12">
               <button onClick={() => setWaterIntake(0)} className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-4 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`}>
                 <RotateCcw size={12} /><span>Reset</span>
               </button>
            </div>
          )}

          {appMode === 'sleep' && lastSleepDuration > 0 && !isSleeping && (
            <div className="absolute bottom-[16%] z-30 flex flex-col items-center w-full px-12">
               <button onClick={() => setLastSleepDuration(0)} className={`flex items-center space-x-1 text-[10px] uppercase tracking-widest border px-4 py-1.5 rounded transition-colors ${ui.controlBtnBorder}`}>
                 <RotateCcw size={12} /><span>Reset</span>
               </button>
            </div>
          )}

          {/* Hexagonal Real-World Complications */}
          {/* Top Left: Battery */}
          <div className="absolute top-[20%] left-[6%] sm:left-[8%] z-30 flex flex-col items-center opacity-70">
             {battery?.charging ? <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} /> : <Battery className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} />}
             <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={battery?.charging ? { color: themeColor } : {}}>{battery ? `${Math.round(battery.level * 100)}%` : '---'}</span>
          </div>

          {/* Bottom Left: Network */}
          <div className="absolute bottom-[20%] left-[6%] sm:left-[8%] z-30 flex flex-col items-center opacity-70">
             {network === 'offline' ? <WifiOff className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} /> : <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} />}
             <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={network !== 'offline' ? { color: themeColor } : {}}>{network ? network.toUpperCase() : '---'}</span>
          </div>

          {/* Center Left: Sun Times */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[2%] sm:left-[4%] z-30 flex flex-col items-center opacity-70">
             {isDay ? <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} /> : <Sunrise className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} />}
             <span className="text-[8px] sm:text-[9px]" style={{ color: themeColor }}>
               {displayMode === 'decimal' 
                 ? ((isDay ? sunTimes.set : sunTimes.rise) / 2.4).toFixed(2)
                 : `${Math.floor(isDay ? sunTimes.set : sunTimes.rise).toString().padStart(2, '0')}:${Math.floor(((isDay ? sunTimes.set : sunTimes.rise) % 1) * 60).toString().padStart(2, '0')}`}
             </span>
          </div>

          {/* Top Right: Weather */}
          <div className="absolute top-[20%] right-[6%] sm:right-[8%] z-30 flex flex-col items-center opacity-70">
             <Thermometer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} style={weather.temp !== null ? { color: themeColor } : {}} />
             <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={weather.temp !== null ? { color: themeColor } : {}}>{weather.temp !== null ? `${Math.round(weather.temp)}°C` : '---'}</span>
          </div>

          {/* Bottom Right: Mic */}
          <button onClick={toggleMic} className={`absolute bottom-[20%] right-[6%] sm:right-[8%] z-30 flex flex-col items-center opacity-70 hover:opacity-100 ${ui.textMuted} transition-opacity`}>
             {micEnabled ? <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" style={{ color: themeColor }} /> : <MicOff className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} />}
             <span className="text-[8px] sm:text-[9px]" style={micEnabled ? { color: themeColor } : {}}>{decibels !== null ? `${decibels}dB` : 'MIC'}</span>
          </button>

          {/* Center Right: GPS */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[2%] sm:right-[4%] z-30 flex flex-col items-center opacity-70">
             <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${ui.iconMuted} mb-1`} style={hasGps ? { color: themeColor } : {}} />
             <span className={`text-[8px] sm:text-[9px] ${ui.textMuted}`} style={hasGps ? { color: themeColor } : {}}>{hasGps ? 'GPS' : 'OFF'}</span>
          </div>

        </div>
      </div>
      
      {/* Footer Legend */}
      <div className="mt-8 sm:mt-12 flex flex-col items-center space-y-4 z-10">
        {appMode === 'clock' && (
          <button 
            onClick={toggleMode}
            className="flex items-center space-x-2 text-neutral-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] border border-neutral-800 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-colors"
          >
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
