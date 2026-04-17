import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Clock, Gauge, Scan, Shield, Cpu, Activity } from 'lucide-react';

interface ManualOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
  ui: any;
}

export const ManualOverlay: React.FC<ManualOverlayProps> = ({ isOpen, onClose, themeColor, ui }) => {
  const specs = [
    {
      title: 'CRONOMETRAGEM DECIMAL',
      icon: Clock,
      content: 'O sistema utiliza o padrão revolucionário de 10 horas por dia, 100 minutos por hora e 100 segundos por minuto. Cada segundo decimal equivale a 0.864 segundos padrão.'
    },
    {
      title: 'CALENDÁRIO DE MISSÃO',
      icon: Activity,
      content: 'Ano dividido em 10 Camadas (Layers) de ~36 dias. Cada camada possui 4 Ciclos (Weeks) de 9 dias: Boot, Sync, Pulse, Link, Core, Drift, Cache, Loop, Null.'
    },
    {
      title: 'HUD TÁTICA (TELEMETRY)',
      icon: Gauge,
      content: 'Barra superior monitora: Estágio de Bateria, Clima Local, Conectividade Satélite, Rede GPS, Atividade Acústica (dB) e Janela Solar (Rise/Set).'
    },
    {
      title: 'PROTOCOLO STEALTH',
      icon: Shield,
      content: 'Ao ser ativado, a HUD entra em modo de baixa emissão. Reduz contraste, silencia logs visuais desnecessários e foca em leitura monocromática.'
    },
    {
      title: 'MÓDULOS OMNI',
      icon: Cpu,
      content: 'Integra Altimetria (+30k ft), Odometria (Passos/Kcal), Navegação por Waypoints (Haversine Path) e Nivelamento por Giroscópio Digital.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border ${ui.bgClock} ${ui.borderClock} shadow-2xl flex flex-col font-['Share_Tech_Mono',_monospace]`}
          >
            <div className={`p-4 border-b ${ui.dividerBorder} flex justify-between items-center`}>
              <div className="flex items-center space-x-2">
                <Info size={18} style={{ color: themeColor }} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Especificações do Sistema v7.0</h2>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {specs.map((spec, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <spec.icon size={20} style={{ color: themeColor }} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">{spec.title}</h3>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-400 pl-11">
                    {spec.content}
                  </p>
                </div>
              ))}
            </div>

            <div className={`p-4 border-t ${ui.dividerBorder} bg-black/20 text-center`}>
              <span className="text-[9px] uppercase tracking-tighter opacity-40">End of Briefing // Tactical HUD Override Active</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
