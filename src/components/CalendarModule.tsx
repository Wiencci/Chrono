
import React from 'react';
import { motion } from 'motion/react';
import { DAYS, MONTHS } from '../types';
import { toDecimalDate, isLeapYear } from '../lib/decimalLogic';

interface CalendarModuleProps {
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({ themeColor, ui, displayMode }) => {
  const now = new Date();
  const dDate = toDecimalDate(now);
  
  const leap = isLeapYear(dDate.year);
  const monthLengths = [36, 37, 36, 37, 36, 37, 36, 37, 36, leap ? 38 : 37];
  const currentMonthLength = monthLengths[dDate.month - 1];
  
  const yearProgress = (dDate.dayOfYear / (leap ? 366 : 365)) * 100;
  const monthProgress = (dDate.dayOfMonth / currentMonthLength) * 100;

  const daysArray = Array.from({ length: currentMonthLength }, (_, i) => i + 1);
  const dowArray = Array.from({ length: 9 }, (_, i) => i + 1);
  const monthsArray = Array.from({ length: 10 }, (_, i) => i + 1);

  // Calculates the negative rotation needed to put the current element at the top (0 degrees)
  const dayAngleOffset = -((dDate.dayOfMonth - 1) / currentMonthLength) * 360;
  const dowAngleOffset = -((dDate.dayOfWeek - 1) / 9) * 360;
  const monthAngleOffset = -((dDate.month - 1) / 10) * 360;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden">
      <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">
        
        {/* Ambient Mayan Glow */}
        <div className="absolute inset-0 rounded-full opacity-10 blur-2xl pointer-events-none" style={{ backgroundColor: themeColor }} />

        <svg className="absolute inset-0 w-full h-full drop-shadow-md z-10" viewBox="0 0 400 400">
          
          <defs>
            <path id="dowArc" d="M 65,200 A 135,135 0 0,1 335,200" />
            <path id="monthArc" d="M 100,200 A 100,100 0 0,1 300,200" />
          </defs>

          {/* Top Fixed Indicator (The Eye) */}
          <g style={{ filter: `drop-shadow(0 0 6px ${themeColor})` }} z-index="50">
            <path d="M 175,5 L 225,5" stroke={themeColor} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 200,5 L 200,12" stroke={themeColor} strokeWidth="3" fill="none" />
            <polygon points="193,12 207,12 200,22" fill={themeColor} />
            <line x1="200" y1="22" x2="200" y2="105" stroke={themeColor} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />
          </g>

          {/* Ring 3 (Outer): Days of the Month Wheel */}
          <motion.g 
            initial={{ rotate: dayAngleOffset - 90 }} 
            animate={{ rotate: dayAngleOffset }} 
            transition={{ type: "spring", damping: 12, stiffness: 40 }}
            style={{ transformOrigin: '200px 200px' }}
          >
            <circle cx="200" cy="200" r="185" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1.5" opacity="0.4" />
            <circle cx="200" cy="200" r="155" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1.5" opacity="0.4" />
            
            {daysArray.map((d, i) => {
              const angle = (i / currentMonthLength) * 360;
              const isCurrent = d === dDate.dayOfMonth;
              
              return (
                <g key={`day-${d}`} transform={`rotate(${angle}, 200, 200)`}>
                  <line x1="200" y1="15" x2="200" y2="21" stroke={isCurrent ? themeColor : (ui?.textMuted || "#555")} strokeWidth={isCurrent ? "2" : "1"} opacity={isCurrent ? 1 : 0.5} />
                  <line x1="200" y1="39" x2="200" y2="45" stroke={isCurrent ? themeColor : (ui?.textMuted || "#555")} strokeWidth={isCurrent ? "2" : "1"} opacity={isCurrent ? 1 : 0.5} />
                  <text x="200" y="34" textAnchor="middle" fontSize={isCurrent ? "14" : "10"} fontWeight={isCurrent ? "900" : "bold"} fill={isCurrent ? ui.textMain : ui.textMuted} opacity={isCurrent ? 1 : 0.6} style={isCurrent ? { filter: `drop-shadow(0 0 5px ${themeColor}80)` } : {}}>
                    {d}
                  </text>
                </g>
              );
            })}
          </motion.g>

          {/* Ring 2 (Middle): Days of the Week Wheel */}
          <motion.g 
            initial={{ rotate: dowAngleOffset + 90 }} 
            animate={{ rotate: dowAngleOffset }} 
            transition={{ type: "spring", damping: 13, stiffness: 38, delay: 0.1 }}
            style={{ transformOrigin: '200px 200px' }}
          >
            {/* Thick background track */}
            <circle cx="200" cy="200" r="135" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="30" opacity="0.05" />
            
            <circle cx="200" cy="200" r="150" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.4" />
            <circle cx="200" cy="200" r="120" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.4" />
            
            {dowArray.map((d, i) => {
              const angle = (i / 9) * 360;
              const isCurrent = d === dDate.dayOfWeek;
              return (
                <g key={`dow-${d}`} transform={`rotate(${angle}, 200, 200)`}>
                  <line x1="200" y1="50" x2="200" y2="56" stroke={isCurrent ? themeColor : (ui?.textMuted || "#555")} strokeWidth={isCurrent ? "2" : "1"} opacity={isCurrent ? 1 : 0.5} />
                  <line x1="200" y1="74" x2="200" y2="80" stroke={isCurrent ? themeColor : (ui?.textMuted || "#555")} strokeWidth={isCurrent ? "2" : "1"} opacity={isCurrent ? 1 : 0.5} />
                  <text 
                    fill={isCurrent ? ui.textMain : ui.textMuted} 
                    fontWeight={isCurrent ? "900" : "bold"} 
                    fontSize={isCurrent ? "11" : "8"}
                    letterSpacing={isCurrent ? "8" : "6"}
                    opacity={isCurrent ? 1 : 0.4} 
                    style={isCurrent ? { filter: `drop-shadow(0 0 5px ${themeColor}80)` } : {}} 
                    className="uppercase"
                  >
                    <textPath href="#dowArc" startOffset="50%" textAnchor="middle" dominantBaseline="central">
                      {DAYS[d - 1]}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </motion.g>

          {/* Ring 1 (Inner): 10 Months Wheel */}
          <motion.g 
            initial={{ rotate: monthAngleOffset - 90 }} 
            animate={{ rotate: monthAngleOffset }} 
            transition={{ type: "spring", damping: 14, stiffness: 35, delay: 0.2 }}
            style={{ transformOrigin: '200px 200px' }}
          >
            <circle cx="200" cy="200" r="115" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.4" />
            <circle cx="200" cy="200" r="85" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.4" />
            
            {monthsArray.map((m, i) => {
              const angle = (i / 10) * 360;
              const isCurrent = m === dDate.month;
              return (
                <g key={`month-${m}`} transform={`rotate(${angle}, 200, 200)`}>
                  <line x1="200" y1="85" x2="200" y2="91" stroke={ui?.textMuted || "#555"} strokeWidth="1" opacity={isCurrent ? 1 : 0.4} />
                  <line x1="200" y1="109" x2="200" y2="115" stroke={ui?.textMuted || "#555"} strokeWidth="1" opacity={isCurrent ? 1 : 0.4} />
                  <text 
                    fill={isCurrent ? ui.textMain : ui.textMuted} 
                    fontWeight={isCurrent ? "900" : "bold"} 
                    fontSize={isCurrent ? "9" : "6"}
                    letterSpacing={isCurrent ? "6" : "4"}
                    opacity={isCurrent ? 1 : 0.4} 
                    style={isCurrent ? { filter: `drop-shadow(0 0 5px ${themeColor}80)` } : {}} 
                    className="uppercase"
                  >
                    <textPath href="#monthArc" startOffset="50%" textAnchor="middle" dominantBaseline="central">
                      {MONTHS[m - 1]}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </motion.g>

          {/* Center Core HUD */}
          <circle cx="200" cy="200" r="75" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="1" opacity="0.7" />
          <circle cx="200" cy="200" r="68" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="4 8" opacity="0.4" className="animate-[spin_40s_linear_infinite]" />
          <circle cx="200" cy="200" r="54" fill="none" stroke={ui?.borderClock || "#333"} strokeWidth="0.5" opacity="0.5" strokeDasharray="2 4" />
          
          <text x="200" y="145" textAnchor="middle" fontSize="8" fill={ui.textMuted} letterSpacing="4" opacity="0.8" className="font-bold">MISSION YR</text>
          <text x="200" y="190" textAnchor="middle" fontSize="36" fontWeight="900" fill={ui.textMain} letterSpacing="1" style={{ filter: `drop-shadow(0 0 10px ${themeColor}80)` }}>
            {dDate.year}
          </text>

          {/* In-Core Telemetry Arcs (MO FLUX & YR PATH) */}
          <g transform="rotate(-90 200 200)">
             {/* Year Progress Arc */}
             <circle cx="200" cy="200" r="46" fill="none" stroke={ui?.textMuted || "white"} strokeWidth="1.5" opacity="0.1" />
             <circle 
                cx="200" cy="200" r="46" fill="none" stroke={themeColor} strokeWidth="2" strokeLinecap="round" opacity="0.8"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={(2 * Math.PI * 46) * (1 - (yearProgress / 100))}
                style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 4px ${themeColor})` }}
             />
             
             {/* Month Progress Arc */}
             <circle cx="200" cy="200" r="40" fill="none" stroke={ui?.textMuted || "white"} strokeWidth="1.5" opacity="0.1" />
             <circle 
                cx="200" cy="200" r="40" fill="none" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={(2 * Math.PI * 40) * (1 - (monthProgress / 100))}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
             />
          </g>

          {/* Labels for Arcs */}
          <g opacity="0.8">
            <text x="200" y="240" textAnchor="middle" fontSize="5" fill={ui.textMuted} letterSpacing="2" className="uppercase font-bold">YR: {yearProgress.toFixed(1)}%</text>
            <text x="200" y="250" textAnchor="middle" fontSize="4" fill={ui.textMuted} letterSpacing="2" className="uppercase font-bold">MO: {monthProgress.toFixed(1)}%</text>
          </g>

        </svg>
      </div>
    </div>
  );
};
