
import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Milestone, Target } from 'lucide-react';
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
  const isDecimal = displayMode === 'decimal';
  
  const leap = isLeapYear(dDate.year);
  const monthLengths = [36, 37, 36, 37, 36, 37, 36, 37, 36, leap ? 38 : 37];
  const currentMonthLength = monthLengths[dDate.month - 1];
  
  const yearProgress = (dDate.dayOfYear / (leap ? 366 : 365)) * 100;
  const monthProgress = (dDate.dayOfMonth / currentMonthLength) * 100;

  // Grid for the current month
  const days = Array.from({ length: currentMonthLength }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-start p-4 space-y-4 w-full h-full overflow-y-auto scrollbar-hide">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <CalendarIcon size={16} style={{ color: themeColor }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: themeColor }}>
            Tactical Chronology
          </span>
        </div>
        <div className="px-2 py-0.5 rounded border border-white/10 bg-white/5">
          <span className="text-[8px] font-mono opacity-60">MISSION_YEAR: {dDate.year}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[7px] uppercase tracking-widest opacity-40">Year Cycle</span>
              <span className="text-[9px] font-mono">{yearProgress.toFixed(1)}%</span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${yearProgress}%` }}
                className="h-full" 
                style={{ backgroundColor: themeColor }} 
              />
           </div>
        </div>
        <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[7px] uppercase tracking-widest opacity-40">Month Flux</span>
              <span className="text-[9px] font-mono">{monthProgress.toFixed(1)}%</span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${monthProgress}%` }}
                className="h-full" 
                style={{ backgroundColor: themeColor }} 
              />
           </div>
        </div>
      </div>

      {/* Decimal Month View */}
      <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.2em] opacity-40">Section Override</span>
            <h3 className="text-xl font-mono font-black tracking-tighter" style={{ color: ui.textMain }}>
              {MONTHS[dDate.month - 1]} <span className="text-[10px] opacity-20 font-normal">/ {dDate.month.toString().padStart(2, '0')}</span>
            </h3>
          </div>
          <div className="flex space-x-1">
             <div className="p-1 rounded bg-white/5 opacity-20 hover:opacity-100 cursor-not-allowed"><ChevronLeft size={14} /></div>
             <div className="p-1 rounded bg-white/5 opacity-20 hover:opacity-100 cursor-not-allowed"><ChevronRight size={14} /></div>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-9 gap-1 mb-2">
          {DAYS.map(day => (
            <span key={day} className="text-[6px] text-center font-bold opacity-30 uppercase">{day.slice(0, 3)}</span>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-9 gap-1">
          {days.map(day => {
            const isToday = day === dDate.dayOfMonth;
            return (
              <motion.div 
                key={day}
                whileHover={{ scale: 1.1 }}
                className={`aspect-square flex items-center justify-center rounded-sm text-[8px] font-mono border transition-all duration-300
                  ${isToday ? 'bg-current text-black font-black' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}
                `}
                style={{ 
                  backgroundColor: isToday ? themeColor : undefined,
                  borderColor: isToday ? themeColor : undefined,
                  color: isToday ? '#000' : (day % 9 === 0 ? themeColor : ui.textMain)
                }}
              >
                {day}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Useful Shortcuts / Milestones */}
      <div className="w-full space-y-2">
         <div className="text-[8px] uppercase tracking-widest opacity-40 px-1">Upcoming Milestones</div>
         
         <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3">
               <div className="p-2 rounded-lg bg-white/5">
                  <Milestone size={14} style={{ color: themeColor }} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] uppercase tracking-widest opacity-40">Next Month Sync</span>
                  <span className="text-[10px] font-mono font-bold">{MONTHS[dDate.month % 10]}</span>
               </div>
            </div>
            <div className="text-right">
               <span className="text-[8px] opacity-40 uppercase">Remaining</span>
               <p className="text-xs font-mono">{currentMonthLength - dDate.dayOfMonth} DAYS</p>
            </div>
         </div>

         <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3">
               <div className="p-2 rounded-lg bg-white/5">
                  <Target size={14} style={{ color: themeColor }} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] uppercase tracking-widest opacity-40">Year Conclusion</span>
                  <span className="text-[10px] font-mono font-bold">BOOT_YEAR_{dDate.year + 1}</span>
               </div>
            </div>
            <div className="text-right">
               <span className="text-[8px] opacity-40 uppercase">Remaining</span>
               <p className="text-xs font-mono">{(leap ? 366 : 365) - dDate.dayOfYear} DAYS</p>
            </div>
         </div>
      </div>

      <div className="text-[7px] uppercase tracking-[0.4em] opacity-20 text-center pt-4">
        Time-Sync Status: LOCKED_TO_UTC_CORE
      </div>
    </div>
  );
};
