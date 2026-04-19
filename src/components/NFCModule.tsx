
import React, { useState } from 'react';
import { Radio, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { toDecimalTime } from '../lib/decimalLogic';

interface NFCLog {
  text: string;
  timestamp: Date;
}

interface NFCModuleProps {
  themeColor: string;
  ui: any;
  displayMode: 'standard' | 'decimal';
}

export const NFCModule: React.FC<NFCModuleProps> = ({ themeColor, ui, displayMode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<NFCLog[]>([]);

  const addLog = (text: string) => {
    setLogs(prev => [{ text, timestamp: new Date() }, ...prev]);
  };

  const startNFCScan = async () => {
    if (!('NDEFReader' in window)) {
      addLog("NFC_ERR: HARDWARE_NOT_SUPPORTED");
      return;
    }

    try {
      setIsScanning(true);
      addLog("SISTEMA: BUSCANDO TAGS...");
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      
      ndef.onreading = (event: any) => {
        const { serialNumber } = event;
        addLog(`TAG_ID: ${serialNumber || 'UNKNOWN'} DETECTADO`);
      };

    } catch (error) {
      setIsScanning(false);
      addLog("NFC_ERR: FALHA AO INICIALIZAR");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full h-full">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Scanning Rings */}
        <div className={`absolute inset-0 border-2 rounded-full border-dashed ${isScanning ? 'animate-[spin_5s_linear_infinite]' : 'opacity-20'}`} style={{ borderColor: themeColor }} />
        <div className={`absolute inset-6 border border-white/10 rounded-full ${isScanning ? 'animate-pulse' : 'opacity-10'}`} />
        
        <motion.div 
          animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="z-10"
        >
          <Radio size={56} style={{ color: themeColor }} className={isScanning ? 'opacity-100' : 'opacity-20'} />
        </motion.div>

        {isScanning && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-2 rounded-full"
            style={{ borderColor: themeColor }}
          />
        )}
      </div>

      <div className="w-full max-w-[300px] flex flex-col space-y-4">
        <button 
          onClick={startNFCScan}
          disabled={isScanning}
          className={`w-full py-4 rounded-lg font-bold uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center space-x-3 border-2 ${isScanning ? 'bg-white/5 border-white/10 opacity-50' : `hover:bg-${themeColor}/10`}`}
          style={{ 
            borderColor: isScanning ? 'transparent' : `${themeColor}60`,
            color: isScanning ? 'white' : themeColor,
            boxShadow: isScanning ? 'none' : `0 0 20px ${themeColor}20`
          }}
        >
          <Search size={16} />
          <span>{isScanning ? 'SCANNING_NDEF' : 'INICIAR_VARREDURA_NFC'}</span>
        </button>

        <div className="bg-black/40 border border-white/5 rounded p-3 h-32 overflow-y-auto font-mono text-[9px] space-y-1">
          {logs.length === 0 ? (
            <div className="flex items-center space-x-2 opacity-20">
               <ShieldCheck size={10} />
               <span>AGARDANDO COMANDO...</span>
            </div>
          ) : logs.map((log, i) => {
            const timeStr = displayMode === 'decimal' 
              ? (() => {
                  const d = toDecimalTime(log.timestamp);
                  const pad = (n: number) => n.toString().padStart(2, '0');
                  return `${pad(d.hours)}:${pad(d.minutes)}:${pad(d.seconds)}`;
                })()
              : log.timestamp.toLocaleTimeString();

            return (
              <div key={i} className="flex items-center space-x-2">
                 <span className="opacity-30">[{timeStr}]</span>
                 <span className={log.text.startsWith('NFC_ERR') ? 'text-red-500' : (log.text.startsWith('TAG') ? 'text-green-500' : 'white')}>{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[7px] uppercase tracking-widest opacity-30">
         Security Protocol: ISO/IEC 14443
      </div>
    </div>
  );
};
