import React, { useState } from 'react';
import { Plus, Eye, Sun, Moon, Volume2, VolumeX, Brain, MessageSquare, RefreshCw, ShieldAlert, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme, THEMES } from '../types';

export interface SystemMenuProps {
  themeColor: string;
  ui: any;
  arEnabled: boolean;
  toggleAR: () => void;
  isLightMode: boolean;
  toggleLightMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  aiEnabled: boolean;
  toggleAiEnabled: () => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  displayMode: 'decimal' | 'standard';
  toggleMode: () => void;
  stealthMode: boolean;
  toggleStealthMode: () => void;
  activeTheme: Theme;
  changeTheme: (theme: Theme) => void;
  openManual: () => void;
  requestPermissions: () => void;
}

export const SystemMenu: React.FC<SystemMenuProps> = ({
  themeColor, ui, arEnabled, toggleAR, isLightMode, toggleLightMode,
  soundEnabled, toggleSound, aiEnabled, toggleAiEnabled, voiceEnabled,
  toggleVoice, displayMode, toggleMode, stealthMode, toggleStealthMode,
  activeTheme, changeTheme, openManual, requestPermissions
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { id: 'stealth', icon: ShieldAlert, label: 'STEALTH PROTOCOL', onClick: toggleStealthMode, active: stealthMode },
    { id: 'ar', icon: Eye, label: 'AR SCANNERS', onClick: toggleAR, active: arEnabled },
    { id: 'sync', icon: RefreshCw, label: 'SYNC HARDWARE', onClick: requestPermissions, active: false },
    { id: 'ai', icon: Brain, label: 'AI CORE LINK', onClick: toggleAiEnabled, active: aiEnabled },
    { id: 'voice', icon: MessageSquare, label: 'VOICE SYNTH', onClick: toggleVoice, active: voiceEnabled },
    { id: 'sound', icon: soundEnabled ? Volume2 : VolumeX, label: 'HAPTIC AUDIO', onClick: toggleSound, active: soundEnabled },
    { id: 'light', icon: isLightMode ? Sun : Moon, label: 'PHOTON THEME', onClick: toggleLightMode, active: isLightMode },
    { id: 'info', icon: Info, label: 'SYSTEM SPECS', onClick: () => { openManual(); setIsOpen(false); }, active: false },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`mb-4 w-64 p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex flex-col gap-2 origin-bottom-right ${ui.bgClock}`}
            style={{ borderColor: `${themeColor}40`, boxShadow: `0 10px 40px -10px ${themeColor}40` }}
          >
            <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: themeColor }}>
              System Config
            </div>

            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                      tool.onClick();
                      if(tool.id === 'stealth') setIsOpen(false); // Close on stealth to see effect
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 group ${tool.active ? 'bg-black/20' : 'hover:bg-black/10'}`}
                  style={{
                    borderColor: tool.active ? `${themeColor}60` : 'transparent',
                    color: tool.active ? themeColor : ui.textMain
                  }}
                >
                  <Icon size={16} className={tool.active ? 'animate-pulse' : 'opacity-60 group-hover:opacity-100'} style={{ color: tool.active ? themeColor : ui.iconMuted }} />
                  <span className="text-xs font-mono font-bold tracking-widest" style={{ color: tool.active ? themeColor : ui.textMain }}>
                      {tool.label}
                  </span>
                </button>
              );
            })}

            <div className="w-full h-px my-2 opacity-20" style={{ backgroundColor: themeColor }} />

            <div className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: themeColor }}>
              Core Override
            </div>
            <div className="flex gap-3 justify-center">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                      changeTheme(theme);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${activeTheme.id === theme.id ? 'scale-125' : 'scale-100 opacity-60 hover:opacity-100 hover:scale-110'}`}
                  style={{
                    backgroundColor: theme.hex,
                    borderColor: activeTheme.id === theme.id ? '#fff' : 'transparent',
                    boxShadow: activeTheme.id === theme.id ? `0 0 15px ${theme.hex}` : 'none'
                  }}
                  title={theme.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95 ${ui.btnBg}`}
        style={{ borderColor: isOpen ? themeColor : `${themeColor}50`, color: themeColor }}
        title="Menu"
      >
        <motion.div animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <Plus size={28} />
        </motion.div>
      </button>
    </div>
  );
};
