import React, { useEffect, useState, useRef } from 'react';

interface AnalogDecimalModuleProps {
  themeColor: string;
  ui: any;
}

export const AnalogDecimalModule: React.FC<AnalogDecimalModuleProps> = ({ themeColor, ui }) => {
  const [now, setNow] = useState(Date.now());
  const reqRef = useRef<number>();

  useEffect(() => {
    // requesting smooth animation frame for sweep hands
    const loop = () => {
      setNow(Date.now());
      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current!);
  }, []);

  // Compute precise decimal time (Continuous/Sweep)
  const date = new Date(now);
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const msSinceMidnight = now - startOfDay;
  
  const totalDecimalSeconds = msSinceMidnight / 864; // 864 ms per decimal second
  const dHours = totalDecimalSeconds / 10000;
  const dMins = (totalDecimalSeconds / 100) % 100;
  const dSecs = totalDecimalSeconds % 100;

  // Degrees for 360 circle
  const hourAngle = (dHours / 10) * 360;
  const minAngle = (dMins / 100) * 360;
  const secAngle = (dSecs / 100) * 360;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Subtle Outer Glow */}
        <div className="absolute inset-0 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: themeColor }} />
        
        <svg className="absolute inset-0 w-full h-full drop-shadow-lg" viewBox="0 0 200 200">
          {/* Base Rings */}
          <circle cx="100" cy="100" r="95" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.5" />
          <circle cx="100" cy="100" r="30" fill="none" stroke={themeColor} strokeWidth="0.5" opacity="0.1" strokeDasharray="2 4" />

          {/* Clock Face Ticks (No Numbers) */}
          {Array.from({ length: 100 }).map((_, i) => {
            const isMajor = i % 10 === 0;
            const isMid = i % 5 === 0 && !isMajor;
            const angle = (i / 100) * 360;
            const rad = (angle - 90) * (Math.PI / 180);
            const outer = 95;
            const inner = isMajor ? 80 : isMid ? 86 : 91;
            
            return (
              <line
                key={i}
                x1={100 + inner * Math.cos(rad)}
                y1={100 + inner * Math.sin(rad)}
                x2={100 + outer * Math.cos(rad)}
                y2={100 + outer * Math.sin(rad)}
                stroke={isMajor ? themeColor : (ui?.textMuted || '#888')}
                strokeWidth={isMajor ? 2.5 : 1}
                opacity={isMajor ? 1 : isMid ? 0.6 : 0.2}
                style={isMajor ? { filter: `drop-shadow(0 0 4px ${themeColor})` } : {}}
              />
            );
          })}
          
          {/* Hour Hand */}
          <g transform={`rotate(${hourAngle}, 100, 100)`}>
            {/* Hand Body */}
            <rect x="97" y="50" width="6" height="50" rx="3" fill={ui?.textMain || "white"} opacity="0.95" />
            <rect x="99" y="55" width="2" height="30" fill={themeColor} opacity="0.5" />
          </g>

          {/* Minute Hand */}
          <g transform={`rotate(${minAngle}, 100, 100)`}>
            <rect x="98.5" y="25" width="3" height="75" rx="1.5" fill={ui?.textMain || "white"} opacity="0.8" />
          </g>

          {/* Second Hand (Sweep) */}
          <g transform={`rotate(${secAngle}, 100, 100)`}>
            {/* Tail */}
            <line x1="100" y1="120" x2="100" y2="100" stroke={themeColor} strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            {/* Needle */}
            <line x1="100" y1="100" x2="100" y2="15" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${themeColor})` }}/>
            {/* Locator Ring on Needle */}
            <circle cx="100" cy="30" r="3" fill="none" stroke={themeColor} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 4px ${themeColor})` }}/>
          </g>

          {/* Center Hub */}
          <circle cx="100" cy="100" r="5" fill={ui?.bgClock || "#000"} stroke={ui?.textMain || "white"} strokeWidth="1.5" />
          <circle cx="100" cy="100" r="1.5" fill={themeColor} style={{ filter: `drop-shadow(0 0 4px ${themeColor})` }} />
        </svg>
      </div>
    </div>
  );
};
