
import { useState, useEffect, useRef } from 'react';
import { getSunTimes } from '../lib/decimalLogic';

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
  const [mag, setMag] = useState({ x: 0, y: 0, z: 0, total: 0 });
  const [lux, setLux] = useState<number | null>(null);
  const [seismoData, setSeismoData] = useState<number[]>(new Array(40).fill(0));
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const lastStepTime = useRef(0);

  const requestPermissions = async () => {
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
    if (e.beta !== null && e.gamma !== null) {
      let x = e.beta - 45;
      let y = e.gamma;
      x = Math.max(-30, Math.min(30, x));
      y = Math.max(-30, Math.min(30, y));
      tiltRef.current = { x: -x, y: y };
    }

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
      const lx = x || 0;
      const ly = y || 0;
      const lz = z || 0;
      setMotion({ x: lx, y: ly, z: lz });
      const acc = Math.sqrt(lx**2 + ly**2 + lz**2);
      setSeismoData(prev => [...prev.slice(1), acc]);
      if (acc > 12) {
        const now = Date.now();
        if (now - lastStepTime.current > 300) {
          setSteps(s => s + 1);
          lastStepTime.current = now;
        }
      }
    }
  };

  useEffect(() => {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const updateNetwork = () => {
      const status = conn?.effectiveType || (navigator.onLine ? 'online' : 'offline');
      setNetwork(status);
    };
    
    updateNetwork();
    if (conn) conn.addEventListener('change', updateNetwork);
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

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

    if ('geolocation' in navigator) {
      const geoId = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude, altitude: alt } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setSunTimes(getSunTimes(latitude, longitude, new Date()));
        setHasGps(true);
        if (alt !== null) setAltitude(alt);
      }, () => {
        setHasGps(false);
      }, { enableHighAccuracy: true });

      return () => navigator.geolocation.clearWatch(geoId);
    }

    if (window.DeviceOrientationEvent && typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    if (window.DeviceMotionEvent && typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      window.addEventListener('devicemotion', handleMotion);
    }

    let ms: any, ls: any;
    if ('Magnetometer' in window) {
      try {
        ms = new (window as any).Magnetometer({ frequency: 10 });
        ms.onreading = () => setMag({ x: ms.x, y: ms.y, z: ms.z, total: Math.sqrt(ms.x**2 + ms.y**2 + ms.z**2) });
        ms.start();
      } catch {}
    }
    if ('AmbientLightSensor' in window) {
      try {
        ls = new (window as any).AmbientLightSensor();
        ls.onreading = () => setLux(ls.illuminance);
        ls.start();
      } catch {}
    }
    
    return () => {
      if (conn) conn.removeEventListener('change', updateNetwork);
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      if (ms) ms.stop();
      if (ls) ls.stop();
    };
  }, []);

  useEffect(() => {
    if (!coords) return;
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true`);
        const data = await res.json();
        if (isMounted && data.current_weather) {
          setWeather({ temp: data.current_weather.temperature });
        }
      } catch (err) {}
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 1000 * 60 * 15);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [coords?.lat, coords?.lng]);

  return { battery, sunTimes, hasGps, weather, network, tiltRef, heading, altitude, steps, motion, mag, lux, seismoData, coords, requestPermissions };
}
