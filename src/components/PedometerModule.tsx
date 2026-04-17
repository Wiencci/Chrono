
import React from 'react';
import { Footprints, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface PedometerModuleProps {
  steps: number;
  themeColor: string;
  ui: any;
}

export const PedometerModule: React.FC<PedometerModuleProps> = ({ steps, themeColor, ui }) => {
  const distanceKm = (steps * 0.76) / 1000; // Average step length
  const calories = steps * 0.04;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4">
      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-32 h-32 border rounded-full opacity-20"
          style={{ borderColor: themeColor }}
        />
        
        <div className="text-center z-10">
          <Footprints size={32} style={{ color: themeColor }} className="mx-auto mb-2 opacity-80" />
          <h2 className="text-4xl font-mono font-bold tracking-tighter" style={{ color: ui.textMain }}>
            {steps.toLocaleString()}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">Passos Totais</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full">
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-2">
            <TrendingUp size={12} style={{ color: themeColor }} />
            <span className="text-[9px] uppercase tracking-widest opacity-60">Distância</span>
          </div>
          <p className="text-lg font-mono">{distanceKm.toFixed(2)}<span className="text-[10px] ml-1 opacity-50">KM</span></p>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-2">
            <motion.div 
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="w-2 h-2 rounded-full" 
               style={{ backgroundColor: themeColor }} 
            />
            <span className="text-[9px] uppercase tracking-widest opacity-60">Energia</span>
          </div>
          <p className="text-lg font-mono">{calories.toFixed(0)}<span className="text-[10px] ml-1 opacity-50">CAL</span></p>
        </div>
      </div>
      
      <div className="w-full h-[1px] opacity-20" style={{ backgroundColor: themeColor }} />
      
      <p className="text-[8px] uppercase tracking-[0.2em] opacity-50 text-center max-w-[200px]">
        Otimizando eficiência de movimento para missões prolongadas.
      </p>
    </div>
  );
};
