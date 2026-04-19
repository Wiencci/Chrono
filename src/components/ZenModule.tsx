
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
            const sequence: Record<string, typeof phase> = {
              'inspire': 'hold',
              'hold': 'expire',
              'expire': 'wait',
              'wait': 'inspire'
            };
            setPhase(sequence[phase]);
            return 4;
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
    <div className="flex flex-col items-center justify-center space-y-8 w-full h-full">
      <div 
        onClick={toggleZen}
        className="relative w-64 h-64 flex items-center justify-center cursor-pointer group"
      >
        {/* Background Atmospheric Layers */}
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                        scale: phase === 'inspire' || phase === 'hold' ? 1.4 : 0.7,
                        opacity: phase === 'hold' ? 0.4 : 0.2
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: themeColor, filter: 'blur(40px)' }}
                />
            )}
        </AnimatePresence>

        {/* Pulse Ring */}
        <motion.div 
           animate={{ 
             scale: isActive ? [1, 1.1, 1] : 1,
             opacity: isActive ? [0.1, 0.3, 0.1] : 0.05
           }}
           transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
           className="absolute inset-0 border-2 rounded-full"
           style={{ borderColor: themeColor }}
        />

        <div 
            className={`relative z-10 w-32 h-32 rounded-full border flex flex-col items-center justify-center transition-all duration-1000 ${isActive ? 'bg-black/40 border-opacity-100' : 'bg-white/5 border-opacity-10'}`}
            style={{ 
                borderColor: themeColor,
                boxShadow: isActive ? `0 0 40px ${themeColor}20` : 'none'
            }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={phase + isActive}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center"
            >
              {isActive ? (
                <>
                  <Wind size={24} style={{ color: themeColor }} className="mb-2 opacity-80" />
                  <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: themeColor }}>{phase.toUpperCase()}</span>
                  <span className="text-3xl font-mono font-black" style={{ color: ui.textMain }}>{timer}</span>
                </>
              ) : (
                <>
                  <Volume2 size={24} className="opacity-20 mb-2" />
                  <span className="text-[8px] opacity-40 uppercase tracking-[0.2em] font-bold text-center">Protocolo Zen</span>
                  <span className="text-[7px] opacity-30 uppercase mt-1">Clique para Iniciar</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center space-x-4 opacity-20">
           <div className={`w-8 h-[1px] ${phase === 'inspire' ? 'opacity-100' : 'opacity-30'}`} style={{ backgroundColor: themeColor }} />
           <div className={`w-8 h-[1px] ${phase === 'hold' ? 'opacity-100' : 'opacity-30'}`} style={{ backgroundColor: themeColor }} />
           <div className={`w-8 h-[1px] ${phase === 'expire' ? 'opacity-100' : 'opacity-30'}`} style={{ backgroundColor: themeColor }} />
           <div className={`w-8 h-[1px] ${phase === 'wait' ? 'opacity-100' : 'opacity-30'}`} style={{ backgroundColor: themeColor }} />
        </div>
        <p className="text-[8px] uppercase tracking-[0.4em] font-bold pt-4" style={{ color: themeColor }}>Frequência Delta Ativa</p>
        <p className="text-[7px] opacity-40 uppercase tracking-widest">Estabilização neural em curso</p>
      </div>
    </div>
  );
};
