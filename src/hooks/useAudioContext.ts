
import { useState, useEffect, useRef } from 'react';

export function useAudioContext(appMode: string, micEnabled: boolean) {
  const [decibels, setDecibels] = useState<number | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(60).fill(0));
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAnimRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (micAnimRef.current) cancelAnimationFrame(micAnimRef.current);
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    micStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  };

  useEffect(() => {
    if (appMode === 'sonar') {
      const initSonar = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          source.connect(analyser);
          analyserRef.current = analyser;
        } catch (e) {
          console.error("Microphone access denied for Sonar:", e);
        }
      };
      initSonar();
    } else if (!micEnabled) {
      stopAudio();
    }
    
    return () => {
      // Logic managed by appMode and micEnabled
    };
  }, [appMode, micEnabled]);

  const startMicMonitoring = async () => {
    try {
      // Disable noiseSuppression, echoCancellation and autoGainControl to capture raw environmental ambient noise
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false, 
          autoGainControl: false, 
          noiseSuppression: false 
        } 
      });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.5;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateDb = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
        
        const avg = sum / dataArray.length;
        // Make it more sensitive - raw ambient noise reflects much faster
        // Exponential-like mapping to highlight even small noises
        const rawDb = 30 + (Math.pow(avg / 255, 0.7) * 90); 
        const db = Math.min(120, Math.round(rawDb));
        
        setDecibels(db);
        micAnimRef.current = requestAnimationFrame(updateDb);
      };

      updateDb();
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      micStreamRef.current = stream;
    } catch (err) {
      console.warn("Mic access denied", err);
    }
  };

  return { decibels, audioLevels, setAudioLevels, analyserRef, startMicMonitoring, stopAudio };
}
