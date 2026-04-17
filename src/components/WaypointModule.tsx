
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
      // Haversine formula for distance
      const R = 6371e3; // metres
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

      // Bearing calculation
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
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      {!baseLocation ? (
        <div className="text-center space-y-4 py-8">
          <Target size={48} className="mx-auto opacity-20" style={{ color: themeColor }} />
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60" style={{ color: ui.textMain }}>Nenhum waypoint definido</p>
          <p className="text-[8px] opacity-40 uppercase" style={{ color: ui.textMain }}>Clique no centro para marcar o local atual como BASE</p>
        </div>
      ) : (
        <>
          <div className="relative w-40 h-40 border-2 rounded-full flex items-center justify-center border-dashed opacity-50" style={{ borderColor: themeColor }}>
            {/* Nav Arrow */}
            <motion.div 
               animate={{ rotate: relativeBearing }}
               className="absolute flex flex-col items-center"
               style={{ height: '80%' }}
            >
                <Navigation size={24} style={{ color: themeColor }} fill={themeColor} className="drop-shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
            </motion.div>
            
            <div className="text-center z-10">
              <p className="text-[9px] uppercase tracking-[0.2em] opacity-40" style={{ color: ui.textMain }}>Distância</p>
              <p className="text-2xl font-mono font-bold" style={{ color: ui.textMain }}>
                {distance && distance > 1000 ? `${(distance / 1000).toFixed(1)}KM` : `${Math.round(distance || 0)}M`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-2 rounded border border-white/5 text-center" style={{ backgroundColor: `${themeColor}10` }}>
              <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1" style={{ color: ui.textMain }}>Status</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                <span className="text-[10px] font-bold" style={{ color: themeColor }}>BASE ATIVA</span>
              </div>
            </div>
            <div className="p-2 rounded border border-white/5 text-center" style={{ backgroundColor: `${themeColor}10` }}>
              <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1" style={{ color: ui.textMain }}>Vetor</p>
              <p className="text-[10px] font-bold" style={{ color: ui.textMain }}>{Math.round((bearing || 0) * (100 / 360))}°D MAG</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
