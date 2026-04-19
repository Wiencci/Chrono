
import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface SeismoModuleProps {
  seismoData: number[];
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
}

export const SeismoModule: React.FC<SeismoModuleProps> = ({ seismoData, themeColor, ui, displayMode }) => {
  const currentAcc = seismoData[seismoData.length - 1];
  const isDecimal = displayMode === 'decimal';
  const baseline = 9.80665; 
  const deviation = Math.abs(currentAcc - baseline);
  const isVibrating = deviation > 0.5;

  const displayVal = isDecimal ? (currentAcc * 10.197) : currentAcc; // 9.8 -> 100.0

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full h-full">
      <div className="relative w-full h-48 border border-white/5 bg-black/20 rounded overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path 
            fill="none"
            stroke={themeColor}
            strokeWidth="1.5"
            d={`M ${seismoData.map((val, i) => `${(i / (seismoData.length - 1)) * 400},${50 - (val - baseline) * 20}`).join(' L ')}`}
            className="transition-all duration-100 ease-linear"
          />
          {/* Horizontal Grid Lines */}
          <line x1="0" y1="50" x2="400" y2="50" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4,4" />
        </svg>
        <div className="absolute top-2 right-2 flex items-center space-x-2">
           <div className={`w-2 h-2 rounded-full ${isVibrating ? 'bg-red-500 animate-ping' : 'bg-emerald-500 opacity-40'}`} />
           <span className="text-[7px] uppercase tracking-widest opacity-60">Monitor: {isDecimal ? 'G-DECIMAL' : 'G-FORCE'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[300px]">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col items-center">
           <Activity size={16} style={{ color: themeColor }} className="mb-2 opacity-60" />
           <span className="text-[7px] uppercase opacity-40 mb-1">{isDecimal ? 'Magnitude (G-D)' : 'Magnitude (G)'}</span>
           <h3 className="text-2xl font-mono font-black">{displayVal.toFixed(isDecimal ? 1 : 3)}</h3>
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col items-center">
           <AlertTriangle size={16} className={`mb-2 ${isVibrating ? 'text-amber-500' : 'opacity-20'}`} />
           <span className="text-[7px] uppercase opacity-40 mb-1">Structural Risk</span>
           <h3 className="text-2xl font-mono font-black">{isVibrating ? 'CAUTION' : 'STABLE'}</h3>
        </div>
      </div>

      <div className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30 text-center">
         Calibration: 9.806m/s² (Earth Gravity)
      </div>
    </div>
  );
};
