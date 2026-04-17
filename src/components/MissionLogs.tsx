
import React, { useState } from 'react';
import { ScrollText, Plus, X, Trash2, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MissionLogsProps {
  logs: { id: number, text: string, time: string }[];
  addLog: (text: string) => void;
  clearLogs: () => void;
  analyzeLogs: () => void;
  themeColor: string;
  ui: any;
}

export const MissionLogs: React.FC<MissionLogsProps> = ({ logs, addLog, clearLogs, analyzeLogs, themeColor, ui }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addLog(inputText);
      setInputText('');
    }
  };

  return (
    <div className="fixed bottom-24 left-6 z-[100] flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom left" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`w-[280px] h-[350px] mb-4 flex flex-col rounded-xl border backdrop-blur-xl ${ui.bgClock} ${ui.borderClock} shadow-2xl overflow-hidden origin-bottom-left`}
            style={{ boxShadow: `0 10px 40px -10px ${themeColor}40` }}
          >
            <div className={`p-3 border-b ${ui.dividerBorder} flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <ScrollText size={14} style={{ color: themeColor }} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Log de Missão</span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={analyzeLogs} 
                  className={`${ui.iconMuted} hover:text-white transition-colors flex items-center space-x-1`}
                  title="Análise de Inteligência"
                >
                  <Brain size={14} style={{ color: logs.length > 0 ? themeColor : undefined }} />
                </button>
                <button onClick={clearLogs} className={ui.iconMuted}>
                  <Trash2 size={14} className="hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-30 text-[9px] uppercase">Vazio</div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="border-l-2 pl-3 py-1" style={{ borderColor: themeColor }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] opacity-40">{log.time}</span>
                    </div>
                    <p className={`text-[10px] leading-relaxed ${ui.textMain}`}>{log.text.toUpperCase()}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSubmit} className={`p-2 border-t ${ui.dividerBorder} flex space-x-2`}>
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="REGISTRO..."
                className={`flex-1 bg-transparent text-[10px] uppercase font-bold outline-none px-2 ${ui.textMain}`}
              />
              <button type="submit" style={{ backgroundColor: themeColor }} className="p-1.5 rounded text-black">
                <Plus size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-xl ${isOpen ? 'rotate-90' : ''} ${ui.btnBg} ${ui.btnBorder} ${ui.btnHoverBorder}`}
      >
        {isOpen ? <X size={20} /> : <ScrollText size={20} style={{ color: themeColor }} />}
      </button>
    </div>
  );
};
