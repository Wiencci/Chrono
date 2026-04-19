
import { LucideIcon } from 'lucide-react';

export type AppMode = 'clock' | 'stopwatch' | 'timer' | 'speed' | 'scanner' | 'radar' | 'orbit' | 'nav' | 'sonar' | 'decrypt' | 'water' | 'sleep' | 'zen' | 'level' | 'steps' | 'altimeter' | 'emf' | 'seismo' | 'lumen' | 'thermal' | 'nfc' | 'calendar' | 'astro' | 'analog';

export interface Theme {
  id: string;
  hex: string;
  name: string;
}

export const THEMES: Theme[] = [
  { id: 'neon', hex: '#ccff00', name: 'NEON' },
  { id: 'amber', hex: '#ffb000', name: 'AMBER' },
  { id: 'cyan', hex: '#00e5ff', name: 'CYAN' },
  { id: 'crimson', hex: '#ff003c', name: 'CRIMSON' },
  { id: 'violet', hex: '#bf00ff', name: 'VIOLET' },
  { id: 'emerald', hex: '#00ff88', name: 'EMERALD' },
  { id: 'fusion', hex: '#ff4d00', name: 'FUSION' },
  { id: 'ghost', hex: '#ffffff', name: 'GHOST' },
  { id: 'cobalt', hex: '#2e5bff', name: 'COBALT' }
];

export const DAYS = ['Boot', 'Sync', 'Pulse', 'Link', 'Core', 'Drift', 'Cache', 'Loop', 'Null'];
export const MONTHS = ['Kernel', 'Input', 'Parse', 'Compile', 'Build', 'Flux', 'Mesh', 'Signal', 'Archive', 'Void'];

export interface SoundEngineInterface {
  init(): void;
  playTick(): void;
  playThemeChange(): void;
  playToggle(toDecimal: boolean): void;
  playMinuteChange(): void;
  playHourChange(): void;
  playDayChange(): void;
  playMonthChange(): void;
  playButtonPress(): void;
  playBeep(): void;
  playAlarm(): void;
}
