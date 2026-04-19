
import React from 'react';
import { motion } from 'motion/react';

interface LevelModuleProps {
  motion: { x: number, y: number, z: number };
  themeColor: string;
  ui: any;
}

export const LevelModule: React.FC<LevelModuleProps> = ({ motion: m, themeColor, ui }) => {
  // Normalize values for visualization
  const tiltX = m.x * 6; 
  const tiltY = m.y * 6;
  const rollAngle = (m.x * 3);

  const isLevel = Math.abs(m.x) < 0.2 && Math.abs(m.y) < 0.2;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 w-full">
      <div className="relative w-56 h-56 rounded-full overflow-hidden border border-white/5 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
        {/* Dynamic Horizon Line */}
        <motion.div 
          animate={{ rotate: -rollAngle, y: tiltY * 1.5 }}
          className="absolute w-[200%] h-[1px] opacity-20"
          style={{ backgroundColor: themeColor }}
        />

        {/* Static Grid */}
        <div className="absolute inset-4 border border-dashed rounded-full opacity-5" style={{ borderColor: themeColor }} />
        <div className="absolute w-full h-[1px] bg-white/5" />
        <div className="absolute h-full w-[1px] bg-white/5" />
        
        {/* Pitch Indicators */}
        <div className="absolute flex flex-col items-center justify-center space-y-4 opacity-10">
          {[-20, -10, 0, 10, 20].map(p => (
            <div key={p} className="flex flex-col items-center">
               <div className="w-12 h-[1px] bg-white" />
               <span className="text-[6px] mt-0.5">{p}°</span>
            </div>
          ))}
        </div>

        {/* Level Bubble (Indicator) */}
        <motion.div 
          animate={{ x: tiltX, y: tiltY }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute w-10 h-10 border-2 rounded-full z-20 flex items-center justify-center"
          style={{ 
            borderColor: isLevel ? themeColor : '#ff003c',
            boxShadow: `0 0 15px ${isLevel ? themeColor : '#ff003c'}40`,
            backgroundColor: `${isLevel ? themeColor : '#ff003c'}10`
          }}
        >
          <div className="w-1 h-1 rounded-full bg-white opacity-80" />
        </motion.div>

        {/* Fixed Center Reticle */}
        <div className="absolute w-4 h-4 border border-white opacity-20 rounded-sm rotate-45" />
      </div>

      <div className="flex justify-between w-full max-w-[200px] border-t pt-4" style={{ borderColor: ui.dividerBorder }}>
        <div className="text-left">
          <p className="text-[7px] uppercase tracking-widest opacity-40">Pitch / Dev</p>
          <p className="text-xs font-mono font-bold" style={{ color: ui.textMain }}>{(m.x * (100 / 90)).toFixed(2)}°D</p>
        </div>
        <div className="text-right">
          <p className="text-[7px] uppercase tracking-widest opacity-40">Roll / Dev</p>
          <p className="text-xs font-mono font-bold" style={{ color: ui.textMain }}>{(m.y * (100 / 90)).toFixed(2)}°D</p>
        </div>
      </div>

      <div className="h-4 flex items-center justify-center">
        {isLevel ? (
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="flex items-center space-x-2"
          >
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: themeColor }}>Status: Nominal</span>
          </motion.div>
        ) : (
          <span className="text-[8px] uppercase tracking-widest opacity-30">Calibration Active</span>
        )}
      </div>
    </div>
  );
};
