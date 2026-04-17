
import { useState, useEffect, useRef } from 'react';
import { getSunTimes } from '../lib/time-utils';

export function useComplications(arEnabled: boolean) {
  const [battery, setBattery] = useState<{ level: number, charging: boolean } | null>(null);
  const [sunTimes, setSunTimes] = useState<{ rise: number, set: number }>({ rise: 6, set: 18 });
  const [hasGps, setHasGps] = useState(false);
  const [weather, setWeather] = useState<{ temp: number | null }>({ temp: null });
  const [network, setNetwork] = useState<string | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [steps, setSteps] = useState(0);
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const lastStepTime = useRef(0);

  const requestPermissions = async () => {
    // iOS 13+ requires explicit permission for DeviceMotion and Orientation
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          window.addEventListener('devicemotion', handleMotion);
        }
      } catch (e) {
        console.error("Sensor permission request failed", e);
      }
    }
    
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    // Tilt logic
    if (e.beta !== null && e.gamma !== null) {
      let x = e.beta - 45;
      let y = e.gamma;
      x = Math.max(-30, Math.min(30, x));
      y = Math.max(-30, Math.min(30, y));
      tiltRef.current = { x: -x, y: y };
    }

    // Compass logic
    const webkitHeading = (e as any).webkitCompassHeading;
    if (webkitHeading !== undefined) {
      setHeading(webkitHeading);
    } else if (e.alpha !== null) {
      setHeading(360 - e.alpha);
    }
  };

  const handleMotion = (e: DeviceMotionEvent) => {
    if (e.accelerationIncludingGravity) {
      const { x, y, z } = e.accelerationIncludingGravity;
      setMotion({ x: x || 0, y: y || 0, z: z || 0 });

      // Simple step counting logic
      const acc = Math.sqrt((x || 0)**2 + (y || 0)**2 + (z || 0)**2);
      if (acc > 12) { // Threshold for step
        const now = Date.now();
        if (now - lastStepTime.current > 300) { // Min 300ms between steps
          setSteps(s => s + 1);
          lastStepTime.current = now;
        }
      }
    }
  };

  useEffect(() => {
    // Network Status
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const updateNetwork = () => {
      const status = conn?.effectiveType || (navigator.onLine ? 'online' : 'offline');
      setNetwork(status);
    };
    
    updateNetwork();
    if (conn) conn.addEventListener('change', updateNetwork);
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    // Battery
    const updateBattery = (b: any) => {
      setBattery({ level: b.level, charging: b.charging });
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        updateBattery(b);
        b.addEventListener('levelchange', () => updateBattery(b));
        b.addEventListener('chargingchange', () => updateBattery(b));
      });
    }

    // GPS & Weather
    if ('geolocation' in navigator) {
      const geoId = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude, altitude: alt } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setSunTimes(getSunTimes(latitude, longitude, new Date()));
        setHasGps(true);
        if (alt !== null) setAltitude(alt);
        
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          .then(res => res.json())
          .then(data => {
            if (data.current_weather) {
              setWeather({ temp: data.current_weather.temperature });
            }
          })
          .catch(err => console.error('Failed to fetch weather', err));
          
      }, () => {
        setHasGps(false);
        console.warn('GPS denied, using default sun times.');
      }, { enableHighAccuracy: true });

      return () => navigator.geolocation.clearWatch(geoId);
    }

    if (window.DeviceOrientationEvent && typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    if (window.DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      window.addEventListener('devicemotion', handleMotion);
    }
    
    return () => {
      if (conn) conn.removeEventListener('change', updateNetwork);
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return { battery, sunTimes, hasGps, weather, network, tiltRef, heading, altitude, steps, motion, coords, requestPermissions };
}
