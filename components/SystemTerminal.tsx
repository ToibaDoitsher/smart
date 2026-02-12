
import React, { useState, useEffect, useRef } from 'react';

const SystemTerminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing AEGIS Protocol...", "[AUTH] Identity Verified: Toiby_Admin", "[CORE] Neural Engine Active"]);
  const [load, setLoad] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  const potentialLogs = [
    "[INFO] Inbound Lead detected from WebHook_A12",
    "[AI] Analyzing Business Logic for Optimization...",
    "[AUTO] Connecting Gmail API to CRM Monday.com",
    "[CORE] Profitability calculation: +24% projected",
    "[INFO] Scaling AI Agent resources to 4vCPU",
    "[SUCCESS] Automation flow #45 completed in 0.4s",
    "[DATA] Scraping competitors for market edge...",
    "[AUTH] Encrypting client database with SHA-512",
    "[SYSTEM] All systems nominal. 24/7 Mode engaged."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = potentialLogs[Math.floor(Math.random() * potentialLogs.length)];
      setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${newLog}`]);
      setLoad(Math.floor(Math.random() * 40) + 60);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-4 md:p-10 font-mono animate-fadeIn">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline"></div>
      
      <div className="w-full max-w-7xl h-full flex flex-col glass border-cyan-500/30 overflow-hidden relative">
        <div className="bg-cyan-500/10 p-4 border-b border-cyan-500/30 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-cyan-400 text-xs font-black tracking-widest uppercase">AEGIS Control Terminal v4.0.2</span>
          </div>
          <button onClick={onClose} className="text-cyan-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 grid md:grid-cols-3 gap-6 p-6 overflow-hidden">
          {/* Left Column: Logs */}
          <div className="md:col-span-2 bg-black/60 rounded-xl border border-white/5 p-6 flex flex-col">
            <h4 className="text-cyan-500 text-[10px] mb-4 uppercase tracking-[0.3em]">Live Feed logs</h4>
            <div className="flex-1 overflow-y-auto space-y-2 text-[11px] md:text-sm text-gray-400">
              {logs.map((log, i) => (
                <div key={i} className="animate-fadeIn">{log}</div>
              ))}
              <div ref={logEndRef}></div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-6">
            <div className="bg-black/60 p-8 rounded-xl border border-white/5">
              <h4 className="text-cyan-500 text-[10px] mb-4 uppercase tracking-[0.3em]">System Load</h4>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${load}%` }}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Processing:</span>
                <span className="text-cyan-400">{load}% Capacity</span>
              </div>
            </div>

            <div className="bg-black/60 p-8 rounded-xl border border-white/5 flex flex-col items-center">
              <h4 className="text-cyan-500 text-[10px] mb-6 uppercase tracking-[0.3em]">Neural Status</h4>
              <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <i className="fa-solid fa-brain text-4xl text-cyan-500 animate-pulse"></i>
              </div>
              <span className="mt-6 text-green-400 text-xs animate-pulse">THINKING...</span>
            </div>

            <div className="flex-1 bg-gradient-to-br from-cyan-600/20 to-indigo-900/20 p-8 rounded-xl border border-cyan-500/20">
               <h4 className="text-white text-xs font-black uppercase mb-4 tracking-widest italic">Profit Vector</h4>
               <p className="text-gray-400 text-xs leading-relaxed">
                 The system is currently simulating a 450% ROI increase for client #928 by optimizing the entire workflow from lead-gen to delivery. All systems operating 24/7.
               </p>
               <button className="mt-8 w-full py-3 bg-white text-black font-black text-[10px] uppercase rounded-lg hover:bg-cyan-400 transition-colors">Deploy Update</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SystemTerminal;
