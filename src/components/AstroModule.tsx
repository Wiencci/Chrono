import React, { useState, useEffect } from 'react';
import { Satellite, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDecimalDegrees } from '../lib/decimalLogic';

interface AstroModuleProps {
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
}

export const AstroModule: React.FC<AstroModuleProps> = ({ themeColor, ui, displayMode }) => {
  const [neos, setNeos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNEO = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        // Using NASA public DEMO_KEY. In production, a real key is needed if rate limits are hit.
        const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`);
        const data = await res.json();
        const todayNeos = data.near_earth_objects[today] || [];
        
        // Sort by closest distance
        todayNeos.sort((a: any, b: any) => {
          const distA = a.close_approach_data?.[0]?.miss_distance?.lunar || "999";
          const distB = b.close_approach_data?.[0]?.miss_distance?.lunar || "999";
          return parseFloat(distA) - parseFloat(distB);
        });
        
        setNeos(todayNeos.slice(0, 5)); // Keep top 5 closest
        setLoading(false);
      } catch (err) {
        console.error("NASA API Error", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchNEO();
  }, []);

  const isDecimal = displayMode === 'decimal';

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 w-full h-full">
      <div className="relative w-40 h-40 flex items-center justify-center my-4 mt-8">
        {/* Earth in the center */}
        <div className="absolute w-8 h-8 rounded-full bg-blue-500/20 border justify-center items-center flex" style={{ borderColor: themeColor }}>
           <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>

        {/* Radar Rings */}
        <div className="absolute inset-0 border border-white/10 rounded-full" />
        <div className="absolute inset-4 border border-white/5 rounded-full" />
        <div className="absolute inset-10 border border-white/5 border-dashed rounded-full" />

        {/* Radar Scanner Line */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
        >
           <div className="w-1/2 h-[1px] bg-white/40 absolute top-1/2 right-1/2 origin-right" style={{ boxShadow: `0 0 10px ${themeColor}` }} />
        </motion.div>

        {/* Render NEOs as blips on the radar */}
        {!loading && !error && neos.map((neo, i) => {
           // Simulate angle based on index, and distance based on lunar distance
           const angle = (i * 72) * (Math.PI / 180);
           const distStr = neo.close_approach_data?.[0]?.miss_distance?.lunar || "0";
           const distScale = Math.min(parseFloat(distStr) / 10, 1) * 80; // Scale to radar 80px max
           
           const isHazardous = neo.is_potentially_hazardous_asteroid;
           
           return (
             <motion.div 
               key={neo.id}
               initial={{ scale: 0 }}
               animate={{ scale: [0, 1.5, 1] }}
               transition={{ duration: 0.5, delay: i * 0.2 }}
               className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
               style={{ 
                 left: 80 + Math.cos(angle) * distScale, 
                 top: 80 + Math.sin(angle) * distScale,
                 backgroundColor: isHazardous ? '#ff003c' : themeColor,
                 boxShadow: `0 0 8px ${isHazardous ? '#ff003c' : themeColor}`
               }}
             />
           )
        })}
      </div>

      <div className="w-full flex-1 max-h-32 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
        {loading ? (
          <div className={`flex flex-col items-center justify-center p-4 space-y-2 opacity-50 ${ui.textMain}`}>
             <RefreshCw size={16} className="animate-spin" />
             <span className="text-[8px] uppercase tracking-widest">Interpolating Telemetry...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 space-x-2 text-red-500 bg-red-500/10 rounded-lg">
             <AlertTriangle size={14} />
             <span className="text-[8px] uppercase tracking-widest font-bold">Uplink Failure</span>
          </div>
        ) : neos.length > 0 ? (
          neos.map((neo, i) => {
            const isHazardous = neo.is_potentially_hazardous_asteroid;
            const velocityKms = parseFloat(neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || "0");
            const missDistKm = parseFloat(neo.close_approach_data?.[0]?.miss_distance?.kilometers || "0");
            const sizeMeters = (neo.estimated_diameter?.meters?.estimated_diameter_min + neo.estimated_diameter?.meters?.estimated_diameter_max) / 2;

            return (
              <div key={neo.id} className={`flex items-center justify-between p-2 rounded-lg border bg-black/40 ${isHazardous ? 'border-red-500/30' : ui.borderClock}`}>
                 <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                       {isHazardous ? <AlertTriangle size={10} className="text-red-500 animate-pulse" /> : <ShieldCheck size={10} style={{ color: themeColor }} />}
                       <span className={`text-[9px] font-bold font-mono tracking-wider truncate max-w-[80px] ${ui.textMain}`}>{neo.name}</span>
                    </div>
                    <span className={`text-[7px] uppercase opacity-40 ${ui.textMuted}`}>
                      Ø {isDecimal ? (sizeMeters / 10).toFixed(0) : Math.round(sizeMeters)}{isDecimal ? 'mD' : 'm'}
                    </span>
                 </div>
                 
                 <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-mono opacity-80 decoration-white/20 underline decoration-dashed underline-offset-2 ${ui.textMain}`}>
                      {isDecimal ? (velocityKms * 3.6).toFixed(1) : velocityKms.toFixed(1)} {isDecimal ? 'DKH' : 'KM/S'}
                    </span>
                    <span className={`text-[7px] font-mono opacity-50 ${ui.textMuted}`}>
                       DIST: {isDecimal ? (missDistKm / 1000000).toFixed(2) : (missDistKm / 1000000).toFixed(2)}{isDecimal ? ' MD' : 'M KM'}
                    </span>
                 </div>
              </div>
            );
          })
        ) : (
          <div className={`text-center p-4 opacity-50 text-[8px] uppercase tracking-widest ${ui.textMain}`}>
            ALL CLEAR. NO NEO THREATS DETECTED.
          </div>
        )}
      </div>
    </div>
  );
};
