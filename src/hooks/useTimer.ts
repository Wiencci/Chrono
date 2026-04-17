
import { useState, useRef } from 'react';

export function useTimer(soundEnabled: boolean, playButtonPress: () => void, playAlarm: () => void) {
  const [tmRunning, setTmRunning] = useState(false);
  const [tmDuration, setTmDuration] = useState(0);
  const [tmRemaining, setTmRemaining] = useState(0);
  
  const tmEndTimeRef = useRef(0);

  const addTimerTime = (mins: number) => {
    if (soundEnabled) playButtonPress();
    const ms = mins * 60000;
    setTmDuration(prev => prev + ms);
    setTmRemaining(prev => prev + ms);
  };

  const toggleTimer = () => {
    if (tmRemaining <= 0) return;
    if (soundEnabled) playButtonPress();
    if (tmRunning) {
      setTmRunning(false);
    } else {
      setTmRunning(true);
      tmEndTimeRef.current = Date.now() + tmRemaining;
    }
  };

  const resetTimer = () => {
    if (soundEnabled) playButtonPress();
    setTmRunning(false);
    setTmDuration(0);
    setTmRemaining(0);
  };

  const updateTimer = () => {
    if (tmRunning) {
      const remaining = tmEndTimeRef.current - Date.now();
      if (remaining <= 0) {
        setTmRemaining(0);
        setTmRunning(false);
        if (soundEnabled) playAlarm();
        return true; // Timer finished
      } else {
        setTmRemaining(remaining);
      }
    }
    return false;
  };

  return { tmRunning, tmDuration, tmRemaining, addTimerTime, toggleTimer, resetTimer, updateTimer };
}
