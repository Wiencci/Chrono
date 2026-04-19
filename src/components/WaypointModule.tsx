
import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface WaypointModuleProps {
  baseLocation: { lat: number, lng: number } | null;
  currentLocation: { lat: number, lng: number } | null;
  heading: number | null;
  themeColor: string;
  ui: any;
}

export const WaypointModule: React.FC<WaypointModuleProps> = ({ baseLocation, currentLocation, heading, themeColor, ui }) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);

  useEffect(() => {
    if (baseLocation && currentLocation) {
      const R = 6371e3; 
      const φ1 = (currentLocation.lat * Math.PI) / 180;
      const φ2 = (baseLocation.lat * Math.PI) / 180;
      const Δφ = ((baseLocation.lat - currentLocation.lat) * Math.PI) / 180;
      const Δλ = ((baseLocation.lng - currentLocation.lng) * Math.PI) / 180;

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      setDistance(d);

      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x = Math.cos(φ1) * Math.sin(φ2) -
                Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      const θ = Math.atan2(y, x);
      const brng = ((θ * 180) / Math.PI + 360) % 360;
      setBearing(brng);
    }
  }, [baseLocation, currentLocation]);

  const relativeBearing = bearing !== null && heading !== null ? (bearing - heading + 360) % 360 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 w-full h-full relative">
      {!baseLocation ? (
        <div className="text-center space-y-4 py-8">
          <div className="relative">
            <Target size={48} className="mx-auto opacity-20" style={{ color: themeColor }} />
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border rounded-full"
              style={{ borderColor: themeColor }}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: themeColor }}>WPT_NULL</p>
            <p className="text-[8px] opacity-40 uppercase tracking-widest leading-relaxed px-8">Nenhum marcador de base detectado no setor.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 w-full">
          {/* Main Radar Screen */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Background Grid Rings */}
            <div className="absolute inset-0 border border-white/5 rounded-full" />
            <div className="absolute inset-8 border border-white/5 rounded-full" />
            <div className="absolute inset-16 border border-white/5 rounded-full" />
            <div className="absolute w-full h-[1px] bg-white opacity-5" />
            <div className="absolute h-full w-[1px] bg-white opacity-5" />

            {/* Sweep Animation */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 rounded-full"
               style={{ background: `conic-gradient(from 0deg, ${themeColor}20, transparent 40deg)` }}
            />
            
            {/* Navigation Needle */}
            <motion.div 
               animate={{ rotate: relativeBearing }}
               className="absolute w-full h-full flex flex-col items-center justify-start py-2 z-20"
            >
                <div className="w-0 h-0 border-x-4 border-x-transparent border-b-8 mb-1" style={{ borderBottomColor: themeColor }} />
                <div className="w-[1px] h-full bg-gradient-to-b from-white/40 to-transparent opacity-40" />
            </motion.div>

            {/* Distance Readout (HUD Overlay) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-1 border border-white/10 rounded-full backdrop-blur-sm z-30">
               <p className="text-xs font-mono font-bold tracking-tight">
                  {distance && distance > 1000 ? `${(distance / 1000).toFixed(1)}KM` : `${Math.round(distance || 0)}M`}
               </p>
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
            <div className="bg-white/5 p-2 rounded flex flex-col items-center border border-white/5">
               <span className="text-[7px] uppercase opacity-40">BRG / DEC</span>
               <span className="text-[10px] font-mono font-bold">{((bearing || 0) / 3.6).toFixed(1)}°D</span>
            </div>
            <div className="bg-white/5 p-2 rounded flex flex-col items-center border border-white/5">
               <span className="text-[7px] uppercase opacity-40">TRK / ERR</span>
               <span className="text-[10px] font-mono font-bold">±0.04°</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
             <span className="text-[8px] uppercase tracking-[0.3em] font-bold" style={{ color: themeColor }}>BASE: RECEPTOR_OK</span>
          </div>
        </div>
      )}
    </div>
  );
};
