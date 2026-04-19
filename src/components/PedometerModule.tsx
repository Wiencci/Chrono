
import React from 'react';
import { Footprints, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface PedometerModuleProps {
  steps: number;
  themeColor: string;
  ui: any;
}

export const PedometerModule: React.FC<PedometerModuleProps> = ({ steps, themeColor, ui }) => {
  const distanceKm = (steps * 0.76) / 1000; 
  const calories = steps * 0.04;
  const goal = 10000;
  const progress = Math.min(steps / goal, 1);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full h-full pb-16">
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Dynamic Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
           <circle cx="104" cy="104" r="90" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
           <motion.circle 
              cx="104" cy="104" r="90" 
              fill="none" 
              stroke={themeColor} 
              strokeWidth="3" 
              strokeDasharray={2 * Math.PI * 90}
              initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 90) * (1 - progress) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 10px ${themeColor}40)` }}
           />
        </svg>

        <div className="text-center z-10 flex flex-col items-center">
          <motion.div 
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="mb-1"
          >
            <Footprints size={28} style={{ color: themeColor }} className="opacity-80" />
          </motion.div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-1">Membro Inferior</p>
          <h2 className="text-5xl font-mono font-black tracking-tighter" style={{ color: ui.textMain }}>
            {steps.toLocaleString()}
          </h2>
          <div className="mt-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] opacity-40 uppercase tracking-widest">
             Progresso: {(progress * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[260px]">
        <div className="flex flex-col items-center p-3 rounded bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <TrendingUp size={14} style={{ color: themeColor }} className="mb-2 opacity-60" />
          <span className="text-[7px] uppercase tracking-widest opacity-40 mb-1">Efetivação Dist.</span>
          <p className="text-sm font-mono font-bold">{distanceKm.toFixed(3)}<span className="text-[8px] ml-1 opacity-40 font-normal">KM</span></p>
        </div>

        <div className="flex flex-col items-center p-3 rounded bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-3 h-3 rounded-full mb-2" 
             style={{ backgroundColor: themeColor }} 
          />
          <span className="text-[7px] uppercase tracking-widest opacity-40 mb-1">Metabolismo</span>
          <p className="text-sm font-mono font-bold">{calories.toFixed(1)}<span className="text-[8px] ml-1 opacity-40 font-normal">KCAL</span></p>
        </div>
      </div>
      
      <div className="text-[8px] uppercase tracking-[0.2em] opacity-30 text-center flex items-center space-x-2">
         <div className="w-1 h-1 rounded-full bg-white opacity-20" />
         <span>Bio-Sync Sincronizado</span>
         <div className="w-1 h-1 rounded-full bg-white opacity-20" />
      </div>
    </div>
  );
};
