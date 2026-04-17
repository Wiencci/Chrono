
import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Eye } from 'lucide-react';
import { Theme, THEMES } from '../types';

interface ThemeControlsProps {
  arEnabled: boolean;
  isLightMode: boolean;
  soundEnabled: boolean;
  activeTheme: Theme;
  themeColor: string;
  ui: any;
  toggleAR: () => void;
  toggleLightMode: () => void;
  toggleSound: () => void;
  changeTheme: (theme: Theme) => void;
}

export const ThemeControls: React.FC<ThemeControlsProps> = ({
  arEnabled,
  isLightMode,
  soundEnabled,
  activeTheme,
  themeColor,
  ui,
  toggleAR,
  toggleLightMode,
  toggleSound,
  changeTheme
}) => {
  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-wrap justify-end gap-3 sm:gap-6 z-20 max-w-[40vw]">
      <button 
        onClick={toggleAR}
        className={`${ui.textMuted} hover:${isLightMode && !arEnabled ? 'text-black' : 'text-white'} transition-colors relative`}
        title={arEnabled ? "Desativar Visão AR" : "Ativar Visão AR"}
      >
        {arEnabled ? <Eye size={20} style={{ color: themeColor, filter: `drop-shadow(0 0 5px ${themeColor})` }} /> : <Eye size={20} className="opacity-50" />}
        {arEnabled && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }}></span>}
      </button>

      <button 
        onClick={toggleLightMode}
        className={`${ui.textMuted} hover:${isLightMode && !arEnabled ? 'text-black' : 'text-white'} transition-colors`}
        title={isLightMode ? "Ativar Modo Escuro" : "Ativar Modo Claro"}
      >
        {isLightMode ? <Sun size={20} style={{ color: themeColor, filter: `drop-shadow(0 0 5px ${themeColor})` }} /> : <Moon size={20} />}
      </button>

      <button 
        onClick={toggleSound}
        className={`${ui.textMuted} hover:${isLightMode ? 'text-black' : 'text-white'} transition-colors`}
        title={soundEnabled ? "Desativar Som" : "Ativar Som"}
      >
        {soundEnabled ? <Volume2 size={20} style={{ color: themeColor, filter: `drop-shadow(0 0 5px ${themeColor})` }} /> : <VolumeX size={20} />}
      </button>
      
      <div className="flex space-x-2 sm:space-x-3">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => changeTheme(theme)}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 ${activeTheme.id === theme.id ? 'scale-125' : 'scale-100 opacity-50 hover:opacity-100'}`}
            style={{ 
              backgroundColor: theme.hex, 
              borderColor: activeTheme.id === theme.id ? '#fff' : 'transparent',
              boxShadow: activeTheme.id === theme.id ? `0 0 15px ${theme.hex}` : 'none'
            }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};
