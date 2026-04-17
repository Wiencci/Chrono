
import React from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIBriefingProps {
  briefing: string;
  themeColor: string;
  isLightMode: boolean;
  onRefresh: () => void;
}

export const AIBriefing: React.FC<AIBriefingProps> = ({ briefing, themeColor, isLightMode, onRefresh }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg">
      <div 
        onClick={onRefresh}
        className={`px-4 py-2 rounded-md border backdrop-blur-md cursor-pointer group transition-all duration-500 flex items-center space-x-3 overflow-hidden ${isLightMode ? 'bg-white/80 border-stone-200' : 'bg-black/60 border-neutral-800 hover:border-neutral-600'}`}
        style={{ boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 0 10px ${themeColor}10` }}
      >
        <Terminal size={14} style={{ color: themeColor }} className="shrink-0 animate-pulse" />
        
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p 
              key={briefing}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className={`text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold leading-tight truncate ${isLightMode ? 'text-stone-600' : 'text-neutral-400'}`}
            >
              <span className="opacity-50 mr-2">ADVISOR:</span>
              <span style={{ color: themeColor }}>{briefing}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-1 h-1 rounded-full animate-ping shrink-0" style={{ backgroundColor: themeColor }} />
      </div>
    </div>
  );
};
