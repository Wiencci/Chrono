
import React, { useEffect, useState } from 'react';
import { Wind, Volume2, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ZenModuleProps {
  themeColor: string;
  ui: any;
  speakAI: (text: string) => void;
  voiceEnabled: boolean;
}

export const ZenModule: React.FC<ZenModuleProps> = ({ themeColor, ui, speakAI, voiceEnabled }) => {
  const [phase, setPhase] = useState<'inspire' | 'hold' | 'expire' | 'wait'>('inspire');
  const [timer, setTimer] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            if (phase === 'inspire') {
                setPhase('hold');
                return 4;
            } else if (phase === 'hold') {
                setPhase('expire');
                return 4;
            } else if (phase === 'expire') {
                setPhase('wait');
                return 4;
            } else {
                setPhase('inspire');
                return 4;
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleZen = () => {
    const next = !isActive;
    setIsActive(next);
    if (next) {
        setPhase('inspire');
        setTimer(4);
        if (voiceEnabled) speakAI("Ritual de centralização iniciado. Foque na respiração.");
    } else {
        if (voiceEnabled) speakAI("Sessão encerrada. Equilíbrio restabelecido.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div 
        onClick={toggleZen}
        className="relative w-40 h-40 flex items-center justify-center cursor-pointer group"
      >
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                        scale: phase === 'inspire' ? 1.5 : phase === 'expire' ? 0.8 : phase === 'hold' ? 1.5 : 0.8,
                        opacity: 0.3
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: themeColor }}
                />
            )}
        </AnimatePresence>

        <div 
            className={`relative z-10 w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700 ${isActive ? 'border-opacity-100 animate-pulse' : 'border-opacity-20'}`}
            style={{ 
                borderColor: themeColor,
                boxShadow: isActive ? `0 0 30px ${themeColor}40` : 'none'
            }}
        >
          {isActive ? (
            <>
                <Wind size={24} style={{ color: themeColor }} className={phase === 'inspire' ? 'animate-bounce' : ''} />
                <span className="text-[10px] mt-1 font-bold" style={{ color: themeColor }}>{phase.toUpperCase()}</span>
                <span className="text-lg font-mono" style={{ color: ui.textMain }}>{timer}</span>
            </>
          ) : (
            <>
                <UserCheck size={24} style={{ color: ui.textVeryMuted }} />
                <span className="text-[8px] mt-1 opacity-40 uppercase tracking-widest text-center" style={{ color: ui.textMain }}>Inicie Protocolo</span>
            </>
          )}
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-[8px] uppercase tracking-[0.3em] font-bold" style={{ color: themeColor }}>Módulo Zen v1.0</h3>
        <p className="text-[7px] opacity-60 uppercase" style={{ color: ui.textMain }}>Frequência Delta Ativa</p>
      </div>
    </div>
  );
};
