
import { useState, useRef } from 'react';

export function useStopwatch(soundEnabled: boolean, playButtonPress: () => void) {
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [swLaps, setSwLaps] = useState<number[]>([]);
  
  const swStartTimeRef = useRef(0);
  const swAccumulatedRef = useRef(0);

  const toggleStopwatch = () => {
    if (soundEnabled) playButtonPress();
    if (swRunning) {
      setSwRunning(false);
      swAccumulatedRef.current += Date.now() - swStartTimeRef.current;
    } else {
      setSwRunning(true);
      swStartTimeRef.current = Date.now();
    }
  };

  const lapOrResetStopwatch = () => {
    if (soundEnabled) playButtonPress();
    if (swRunning) {
      setSwLaps(prev => [swTime, ...prev].slice(0, 5));
    } else {
      setSwTime(0);
      swAccumulatedRef.current = 0;
      setSwLaps([]);
    }
  };

  const updateStopwatch = () => {
    if (swRunning) {
      setSwTime(swAccumulatedRef.current + (Date.now() - swStartTimeRef.current));
    }
  };

  return { swRunning, swTime, swLaps, toggleStopwatch, lapOrResetStopwatch, updateStopwatch };
}
