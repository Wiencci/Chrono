
import React from 'react';
import { motion } from 'motion/react';

interface LevelModuleProps {
  motion: { x: number, y: number, z: number };
  themeColor: string;
  ui: any;
}

export const LevelModule: React.FC<LevelModuleProps> = ({ motion: m, themeColor, ui }) => {
  // Normalize values for visualization
  // Gravity is ~9.8 on Z when flat. 
  // Let's use x and y for tilt.
  const tiltX = m.x * 5; // Scaling for effect
  const tiltY = m.y * 5;

  const isLevel = Math.abs(m.x) < 0.2 && Math.abs(m.y) < 0.2;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      <div className="relative w-48 h-48 border-2 rounded-full flex items-center justify-center" style={{ borderColor: ui.dividerBorder }}>
        {/* Crosshair */}
        <div className="absolute w-full h-[1px] bg-white opacity-10" />
        <div className="absolute h-full w-[1px] bg-white opacity-10" />
        
        {/* Target Circle */}
        <div className="w-8 h-8 border-2 rounded-full z-0" style={{ borderColor: themeColor, opacity: 0.3 }} />

        {/* Level Bubble */}
        <motion.div 
          animate={{ x: tiltX, y: tiltY }}
          transition={{ type: 'spring', damping: 20 }}
          className="absolute w-6 h-6 rounded-full shadow-lg z-10"
          style={{ 
            backgroundColor: isLevel ? themeColor : '#ff003c',
            boxShadow: `0 0 20px ${isLevel ? themeColor : '#ff003c'}80` 
          }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 bg-white opacity-40 rounded-full" />
        </motion.div>

        {/* Precision Rings */}
        <div className="absolute w-24 h-24 border rounded-full opacity-5" style={{ borderColor: themeColor }} />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full text-center">
        <div className="space-y-1">
          <p className="text-[8px] uppercase tracking-widest opacity-50" style={{ color: ui.textMain }}>Pitch (X)</p>
          <p className="text-sm font-mono" style={{ color: ui.textMain }}>{(m.x * (100 / 90)).toFixed(1)}°D</p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] uppercase tracking-widest opacity-50" style={{ color: ui.textMain }}>Roll (Y)</p>
          <p className="text-sm font-mono" style={{ color: ui.textMain }}>{(m.y * (100 / 90)).toFixed(1)}°D</p>
        </div>
      </div>

      {isLevel && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: themeColor }}
        >
          SISTEMA NIVELADO
        </motion.p>
      )}
    </div>
  );
};
