
import React, { useState, useEffect } from 'react';
import { Zap, Activity, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface EMFModuleProps {
  mag: { x: number, y: number, z: number, total: number };
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
}

export const EMFModule: React.FC<EMFModuleProps> = ({ mag, themeColor, ui, displayMode }) => {
  const [history, setHistory] = useState<number[]>(new Array(30).fill(0));
  const isDecimal = displayMode === 'decimal';
  
  useEffect(() => {
    // If no real sensor data, simulate micro-fluctuations
    const val = mag.total > 0 ? mag.total : (40 + Math.random() * 5);
    setHistory(prev => [...prev.slice(1), val]);
  }, [mag.total]);

  const rawVal = history[history.length - 1];
  const currentVal = isDecimal ? (rawVal * 1.6) : rawVal; // Hypothetical decimal scale
  const isHigh = rawVal > 60;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4 w-full h-full">
      <div className="relative w-56 h-40 flex items-end justify-center space-x-1 border-b border-white/10 pb-2">
        {history.map((val, i) => (
          <motion.div 
            key={i}
            animate={{ height: `${Math.min((val / 150) * 100, 100)}%` }}
            className="w-1.5 bg-white/10 rounded-t-sm"
            style={{ 
              backgroundColor: i === history.length - 1 && isHigh ? '#ff003c' : (i === history.length - 1 ? themeColor : undefined),
              opacity: 0.2 + (i / history.length) * 0.8
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between w-full max-w-[260px]">
        <div className="flex flex-col">
           <span className="text-[8px] uppercase tracking-widest opacity-40">{isDecimal ? 'EMF_INTENSITY (DEC)' : 'EMF_INTENSITY (MAG)'}</span>
           <div className="flex items-baseline space-x-1">
              <h2 className="text-4xl font-mono font-black" style={{ color: isHigh ? '#ff003c' : ui.textMain }}>
                {currentVal.toFixed(1)}
              </h2>
              <span className="text-xs opacity-40">{isDecimal ? 'μD' : 'μT'}</span>
           </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
           <div className="flex items-center space-x-2 px-2 py-1 rounded bg-white/5 border border-white/5">
              <Zap size={10} className={isHigh ? 'text-red-500 animate-pulse' : 'opacity-40'} />
              <span className="text-[7px] uppercase tracking-tighter">{isHigh ? 'High Interference' : 'Stable Field'}</span>
           </div>
           <div className="text-[6px] font-mono opacity-30 text-right">
              X: {mag.x.toFixed(2)} | Y: {mag.y.toFixed(2)} | Z: {mag.z.toFixed(2)}
           </div>
        </div>
      </div>

      <div className="w-full max-w-[260px] h-8 relative bg-white/5 rounded overflow-hidden border border-white/5">
         <motion.div 
            animate={{ width: `${Math.min((currentVal / 100) * 100, 100)}%` }}
            className="h-full"
            style={{ backgroundColor: isHigh ? '#ff003c40' : `${themeColor}40` }}
         />
         <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] uppercase tracking-[0.4em] font-bold opacity-60">
               Field Density: {isHigh ? 'CRITICAL' : 'NOMINAL'}
            </span>
         </div>
      </div>
    </div>
  );
};
