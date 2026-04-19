
import React from 'react';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface LumenModuleProps {
  lux: number | null;
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
}

export const LumenModule: React.FC<LumenModuleProps> = ({ lux, themeColor, ui, displayMode }) => {
  const displayLux = lux !== null ? lux : 450; // Mock if no sensor
  const isDecimal = displayMode === 'decimal';
  const isDark = displayLux < 50;
  const isBlinding = displayLux > 2000;

  // Decimal conversion: Normalize 1000 lux to 100 LX-D
  const decimalVal = displayLux / 10;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full h-full">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Exposure Meter Circle */}
        <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
        
        <motion.div 
          animate={{ 
            scale: isDark ? [1, 1.1, 1] : 1,
            opacity: isDark ? 1 : (isBlinding ? 0.2 : 0.6)
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isDark ? (
            <Moon size={64} style={{ color: themeColor }} className="drop-shadow-2xl" />
          ) : isBlinding ? (
            <Sun size={64} className="text-white drop-shadow-[0_0_30px_white]" />
          ) : (
            <Sun size={64} style={{ color: themeColor }} />
          )}
        </motion.div>

        {/* Dynamic Scale Around Icon */}
        <svg className="absolute inset-0 w-full h-full">
           <circle 
              cx="96" cy="96" r="80" 
              fill="none" 
              stroke={themeColor} 
              strokeWidth="1" 
              strokeDasharray="4,8"
              opacity="0.2"
           />
        </svg>
      </div>

      <div className="text-center space-y-2">
         <div className="flex items-baseline justify-center space-x-2">
            <h2 className="text-6xl font-mono font-black tracking-tighter" style={{ color: ui.textMain }}>
              {isDecimal ? decimalVal.toFixed(1) : Math.round(displayLux)}
            </h2>
            <span className="text-xl font-bold opacity-30">{isDecimal ? 'LX-D' : 'LUX'}</span>
         </div>
         <p className="text-[10px] uppercase tracking-[0.5em] font-bold" style={{ color: themeColor }}>
            Ambient Luminescence
         </p>
      </div>

      <div className="flex items-center space-x-6">
         <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 opacity-40'}`}>
            <Eye className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">NVG_REQ</span>
         </div>
         <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${isBlinding ? 'bg-orange-950/40 border-orange-500/50 text-orange-400' : 'bg-white/5 border-white/10 opacity-40'}`}>
            <EyeOff className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-widest">FLARE_ALT</span>
         </div>
      </div>
    </div>
  );
};
