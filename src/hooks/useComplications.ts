
import { useState, useEffect, useRef } from 'react';
import { getSunTimes } from '../lib/time-utils';

export function useComplications(arEnabled: boolean) {
  const [battery, setBattery] = useState<{ level: number, charging: boolean } | null>(null);
  const [sunTimes, setSunTimes] = useState<{ rise: number, set: number }>({ rise: 6, set: 18 });
  const [hasGps, setHasGps] = useState(false);
  const [weather, setWeather] = useState<{ temp: number | null }>({ temp: null });
  const [network, setNetwork] = useState<string | null>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Network Status
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const updateNetwork = () => setNetwork(conn?.effectiveType || (navigator.onLine ? 'online' : 'offline'));
    
    if (conn) {
      updateNetwork();
      conn.addEventListener('change', updateNetwork);
    } else {
      updateNetwork();
      window.addEventListener('online', updateNetwork);
      window.addEventListener('offline', updateNetwork);
    }

    // Battery
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        setBattery({ level: b.level, charging: b.charging });
        b.addEventListener('levelchange', () => setBattery(prev => prev ? { ...prev, level: b.level } : null));
        b.addEventListener('chargingchange', () => setBattery(prev => prev ? { ...prev, charging: b.charging } : null));
      });
    }

    // GPS & Weather
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setSunTimes(getSunTimes(latitude, longitude, new Date()));
        setHasGps(true);
        
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

    // Device Orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      let x = e.beta - 45;
      let y = e.gamma;
      x = Math.max(-30, Math.min(30, x));
      y = Math.max(-30, Math.min(30, y));
      tiltRef.current = { x: -x, y: y };
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    return () => {
      if (conn) conn.removeEventListener('change', updateNetwork);
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  return { battery, sunTimes, hasGps, weather, network, tiltRef };
}
