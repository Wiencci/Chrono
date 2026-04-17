
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
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-8 opacity-10">
            {[1,2,3,4,5].map(i => <div key={i} className="w-full h-[1px]" style={{ backgroundColor: themeColor }} />)}
        </div>

        <div className="text-center z-10">
          <Mountain size={28} style={{ color: themeColor }} className="mx-auto mb-2 opacity-60" />
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-1" style={{ color: ui.textMain }}>Altitude (MSL)</p>
          <h2 className="text-5xl font-mono font-bold tracking-tighter" style={{ color: ui.textMain }}>
            {altitude !== null ? Math.round(altitude) : '---'}
            <span className="text-lg ml-1 opacity-50 font-normal">AM</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col items-center p-3 rounded border border-white/5" style={{ backgroundColor: `${themeColor}10` }}>
          <Wind size={14} style={{ color: themeColor }} className="mb-1 opacity-60" />
          <p className="text-[8px] uppercase tracking-widest opacity-40" style={{ color: ui.textMain }}>Pressão</p>
          <p className="text-xs font-mono font-bold" style={{ color: ui.textMain }}>1013.2<span className="text-[8px] ml-0.5 opacity-50">hPa</span></p>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded border border-white/5" style={{ backgroundColor: `${themeColor}10` }}>
          <Activity size={14} style={{ color: themeColor }} className="mb-1 opacity-60" />
          <p className="text-[8px] uppercase tracking-widest opacity-40" style={{ color: ui.textMain }}>Delta-V</p>
          <p className="text-xs font-mono font-bold" style={{ color: ui.textMain }}>+0.0<span className="text-[8px] ml-0.5 opacity-50">m/s</span></p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: themeColor }}>
           {weather.temp !== null ? `Temperatura externa: ${weather.temp}°D` : 'Analisando condições...'}
        </p>
      </div>
    </div>
  );
};
