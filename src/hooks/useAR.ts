
import { useState, useRef } from 'react';
import { soundEngine } from '../services/sound-engine';

export function useAR(soundEnabled: boolean) {
  const [arEnabled, setArEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        alert("Não foi possível acessar a câmera para o modo AR.");
      }
    }
  };

  return { arEnabled, videoRef, toggleAR };
}
