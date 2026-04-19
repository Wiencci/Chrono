
import React from 'react';
import { Mountain, Wind, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface AltimeterModuleProps {
  altitude: number | null;
  themeColor: string;
  weather: { temp: number | null };
  ui: any;
}

export const AltimeterModule: React.FC<AltimeterModuleProps> = ({ altitude, themeColor, weather, ui }) => {
  const displayAltitude = altitude !== null ? Math.round(altitude) : 1240; 
  const tapeOffset = (displayAltitude % 100);

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 w-full h-full">
      <div className="flex items-center justify-between w-full h-64 px-4">
        {/* Left Side: Vertical Tape for Scale */}
        <div className="w-12 h-64 relative overflow-hidden flex flex-col items-end">
           <div className="absolute right-0 h-full w-[1px] opacity-20" style={{ backgroundColor: themeColor }} />
           
           <div 
             className="absolute right-0 w-full transition-all duration-300 ease-linear"
             style={{ top: `calc(50% - 32px + ${tapeOffset * 0.64}px)` }}
           >
             {Array.from({ length: 20 }).map((_, i) => {
               const baseVal = Math.floor(displayAltitude / 100) * 100;
               const val = baseVal + (10 - i) * 100;
               return (
                 <div key={i} className="flex items-center h-16 -mr-1">
                    <span className="text-[7px] font-mono mr-1 opacity-40">{val}</span>
                    <div className={`h-[1px] ${val % 500 === 0 ? 'w-3' : 'w-1'} bg-white opacity-20`} />
                 </div>
               );
             })}
           </div>

           {/* Current Altitude Indicator on Tape */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-10">
              <div className="w-0 h-0 border-y-4 border-y-transparent border-r-8" style={{ borderRightColor: themeColor }} />
           </div>
        </div>

        {/* Center: Big Digital Readout */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-1">
          <div className="p-1 px-3 border rounded text-[9px] uppercase tracking-widest opacity-60 mb-2" style={{ borderColor: `${themeColor}40`, color: themeColor }}>
            RADAR_ALT_ACTIVE
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40" style={{ color: ui.textMain }}>Altitude (MSL)</p>
          <div className="relative">
             <h2 className="text-6xl font-mono font-black tracking-tight" style={{ color: ui.textMain, filter: `drop-shadow(0 0 10px ${themeColor}20)` }}>
               {displayAltitude}
             </h2>
             <span className="absolute -right-8 bottom-2 text-sm font-bold opacity-30">AM</span>
          </div>
          <div className="flex items-center space-x-2 pt-2">
             <div className="h-[2px] w-12 bg-white/5 relative overflow-hidden">
                <motion.div 
                   animate={{ x: [-48, 48] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0 w-1/2"
                   style={{ backgroundColor: themeColor }}
                />
             </div>
             <span className="text-[7px] uppercase tracking-widest opacity-40">Scanning Peak</span>
          </div>
        </div>

        {/* Right Side: Small Vertical Gauges */}
        <div className="w-12 h-full flex flex-col justify-center space-y-8 opacity-40">
           <div className="space-y-1">
              <p className="text-[6px] uppercase text-right">Temp</p>
              <div className="h-12 w-1.5 bg-white/5 rounded-full ml-auto relative overflow-hidden">
                 <div className="absolute bottom-0 w-full bg-white opacity-50" style={{ height: '40%' }} />
              </div>
           </div>
           <div className="space-y-1">
              <p className="text-[6px] uppercase text-right">Press</p>
              <div className="h-12 w-1.5 bg-white/5 rounded-full ml-auto relative overflow-hidden">
                 <div className="absolute bottom-0 w-full bg-white opacity-50" style={{ height: '65%' }} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[240px]">
        <div className="flex items-center space-x-2 p-2 rounded bg-white/5 border border-white/5">
          <Wind size={12} className="opacity-40" />
          <div>
             <p className="text-[7px] uppercase opacity-40 leading-none">Vento (Est)</p>
             <p className="text-[10px] font-mono leading-none mt-1">12<span className="text-[7px] opacity-40">DK/H</span></p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded bg-white/5 border border-white/5">
          <Activity size={12} className="opacity-40" />
          <div>
             <p className="text-[7px] uppercase opacity-40 leading-none">VARIO</p>
             <p className="text-[10px] font-mono leading-none mt-1">+1.2<span className="text-[7px] opacity-40">m/s</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
