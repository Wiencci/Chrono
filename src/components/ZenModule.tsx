
import React from 'react';
import { Wind, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ZenModuleProps {
  isActive: boolean;
  phase: 'inspire' | 'hold' | 'expire' | 'wait';
  timer: number;
  toggleZen: () => void;
  themeColor: string;
  ui: any;
  speakAI: (text: string) => void;
  voiceEnabled: boolean;
}

export const ZenModule: React.FC<ZenModuleProps> = ({ 
    isActive, phase, timer, toggleZen,
    themeColor, ui 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full h-full mt-2">
      <div 
        onClick={toggleZen}
        className="relative w-64 h-64 flex items-center justify-center cursor-pointer group"
      >
        {/* Background Atmospheric Layers */}
        <AnimatePresence>
            {isActive && (
                <motion.div
                    key="atmospheric-bg"
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

        {/* Central Breathing Ring */}
        <div 
            className={`relative z-10 w-28 h-28 rounded-full border flex flex-col items-center justify-center transition-all duration-1000 ${isActive ? 'bg-black/60 border-opacity-100 shadow-2xl backdrop-blur-xl' : 'bg-white/5 border-opacity-10'}`}
            style={{ 
                borderColor: themeColor,
                boxShadow: isActive ? `0 0 40px ${themeColor}40` : 'none'
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
                  <Wind size={24} style={{ color: themeColor }} className="mb-2 opacity-100 animate-pulse" />
                  {/* Highlighted text for better contrast */}
                  <span className="text-[11px] font-black tracking-[0.3em] brightness-125 select-none" style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}80` }}>{phase.toUpperCase()}</span>
                  <span className="text-4xl font-mono font-black text-white drop-shadow-lg select-none">{timer}</span>
                </>
              ) : (
                <>
                  <Volume2 size={24} className="opacity-20 mb-2" />
                  <span className={`text-[8px] opacity-40 uppercase tracking-[0.2em] font-bold text-center ${ui.textMuted}`}>Protocolo Zen</span>
                  <span className="text-[7px] opacity-30 uppercase mt-1">Clique para Iniciar</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[9px] uppercase tracking-[0.4em] font-black brightness-110" style={{ color: themeColor }}>Frequência Delta Ativa</p>
        <p className={`text-[7px] opacity-60 uppercase tracking-widest ${ui.textMuted}`}>Estabilização neural em curso</p>
      </div>
    </div>
  );
};
