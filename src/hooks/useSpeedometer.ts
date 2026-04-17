
import { useState, useEffect } from 'react';
import { AppMode } from '../types';

export function useSpeedometer(appMode: AppMode) {
  const [speedData, setSpeedData] = useState<{ 
    speed: number | null, 
    heading: number | null, 
    maxSpeed: number, 
    latitude: number | null, 
    longitude: number | null, 
    altitude: number | null, 
    accuracy: number | null 
  }>({ 
    speed: null, 
    heading: null, 
    maxSpeed: 0, 
    latitude: null, 
    longitude: null, 
    altitude: null, 
    accuracy: null 
  });

  useEffect(() => {
    let watchId: number;
    if ((appMode === 'speed' || appMode === 'nav') && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const s = pos.coords.speed;
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

  const resetMaxSpeed = () => {
    setSpeedData(prev => ({ ...prev, maxSpeed: 0 }));
  };

  return { speedData, resetMaxSpeed };
}
