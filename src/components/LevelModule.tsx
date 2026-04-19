
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { formatDecimalDegrees } from '../lib/decimalLogic';

interface LevelModuleProps {
  motion: { x: number, y: number, z: number };
  themeColor: string;
  ui: any;
}

export const LevelModule: React.FC<LevelModuleProps> = ({ motion: m, themeColor, ui }) => {
  const [isStuck, setIsStuck] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (m.x !== 0 || m.y !== 0 || m.z !== 0) {
      setIsStuck(false);
    }
  }, [m.x, m.y, m.z]);

  // Desktop mouse interactivity
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isStuck) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x: x * 2, y: y * 2 });
  };

  // Use sensor data if available, otherwise mouse data
  const effX = isStuck ? mousePos.x : m.x;
  const effY = isStuck ? mousePos.y : m.y;

  const tiltX = effX * 8; 
  const tiltY = effY * 8;
  const rollAngle = (effX * 5);

  const isLevel = Math.abs(effX) < 0.15 && Math.abs(effY) < 0.15;

  // Calculate true angle from acceleration (assuming 1G = 9.8 m/s^2)
  const getTiltAngle = (accel: number) => {
    // Clamp to -9.8 to 9.8 to avoid NaN
    const clamped = Math.max(-9.8, Math.min(9.8, accel));
    const rad = Math.asin(clamped / 9.8);
    // Convert to standard degrees for the centralized decimal formatter
    return (rad * 180) / Math.PI;
  };

  const pitchDeg = getTiltAngle(effX);
  const rollDeg = getTiltAngle(effY);

  return (
    <div 
      className="flex flex-col items-center justify-center p-4 space-y-4 w-full h-full cursor-crosshair"
      onMouseMove={handleContainerMouseMove}
    >
      <div className="relative w-56 h-56 rounded-full overflow-hidden border border-white/5 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
        {/* Dynamic Horizon Line */}
        <motion.div 
          animate={{ rotate: -rollAngle, y: tiltY * 1.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="absolute w-[250%] h-[1px] opacity-30"
          style={{ backgroundColor: themeColor }}
        />
        
        {/* Synthetic Pitch Lines */}
        <motion.div 
          animate={{ rotate: -rollAngle, y: tiltY * 1.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="absolute space-y-6 opacity-10 flex flex-col items-center"
        >
          {[-40, -20, 0, 20, 40].map(p => (
            <div key={p} className="flex items-center space-x-4">
              <div className="w-8 h-[0.5px] bg-white" />
              <span className="text-[5px] font-mono">{p}</span>
              <div className="w-8 h-[0.5px] bg-white" />
            </div>
          ))}
        </motion.div>

        {/* Static Grid */}
        <div className="absolute inset-4 border border-dashed rounded-full opacity-5 pointer-events-none" style={{ borderColor: themeColor }} />
        <div className="absolute w-full h-[0.5px] bg-white/10" />
        <div className="absolute h-full w-[0.5px] bg-white/10" />
        
        {/* Level Bubble (Indicator) */}
        <motion.div 
          animate={{ x: tiltX, y: tiltY }}
          transition={{ type: 'spring', damping: 30, stiffness: 150 }}
          className="absolute w-12 h-12 border-2 rounded-full z-20 flex items-center justify-center"
          style={{ 
            borderColor: isLevel ? themeColor : '#ff003c',
            boxShadow: `0 0 20px ${isLevel ? themeColor : '#ff003c'}40`,
            backgroundColor: `${isLevel ? themeColor : '#ff003c'}15`
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
          {isLevel && (
             <motion.div 
               animate={{ scale: [1, 1.3, 1] }} 
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 rounded-full border border-white opacity-40 shadow-[0_0_10px_white]"
             />
          )}
        </motion.div>

        {/* Central HUD Cross */}
        <div className="absolute w-6 h-6 z-10 pointer-events-none">
           <div className="absolute top-1/2 left-0 w-2 h-[1px] bg-white/40" />
           <div className="absolute top-1/2 right-0 w-2 h-[1px] bg-white/40" />
           <div className="absolute top-0 left-1/2 h-2 w-[1px] bg-white/40" />
           <div className="absolute bottom-0 left-1/2 h-2 w-[1px] bg-white/40" />
        </div>
      </div>

      <div className="flex justify-between w-full max-w-[220px] bg-white/5 p-3 rounded-lg border border-white/5 backdrop-blur-md">
        <div className="text-left">
          <p className="text-[7px] uppercase tracking-widest opacity-40 mb-1">PITCH_AXIS</p>
          <p className="text-xs font-mono font-bold" style={{ color: ui.textMain }}>{formatDecimalDegrees(Math.abs(pitchDeg))}</p>
        </div>
        <div className="text-center px-2 self-end">
           <div className={`w-1 h-1 rounded-full ${isLevel ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        </div>
        <div className="text-right">
          <p className="text-[7px] uppercase tracking-widest opacity-40 mb-1">ROLL_AXIS</p>
          <p className="text-xs font-mono font-bold" style={{ color: ui.textMain }}>{formatDecimalDegrees(Math.abs(rollDeg))}</p>
        </div>
      </div>

      <div className="h-6 flex flex-col items-center justify-center">
        {isStuck ? (
          <div className="flex flex-col items-center space-y-1">
             <div className="flex items-center space-x-1.5 text-amber-500 opacity-80">
                <ShieldAlert size={10} />
                <span className="text-[8px] uppercase tracking-widest font-bold">Aguardando Sensor Inercial</span>
             </div>
             <p className="text-[6px] uppercase opacity-40">Toque no centro para sincronizar ou mova o mouse</p>
          </div>
        ) : isLevel ? (
          <div className="flex items-center space-x-2">
            <RefreshCw size={10} className="animate-spin text-emerald-500 opacity-60" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: themeColor }}>Estabilização Nominal</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 opacity-40">
            <span className="text-[8px] uppercase tracking-widest">Ajustando Orientação...</span>
          </div>
        )}
      </div>
    </div>
  );
};
