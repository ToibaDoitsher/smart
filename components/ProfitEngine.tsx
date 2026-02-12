
import React, { useState, useEffect } from 'react';

const MODULES = [
  { id: 'whatsapp', name: 'סוכן וואטסאפ 24/7', savings: 15, cost: 0.2, icon: 'fa-whatsapp' },
  { id: 'crm', name: 'סנכרון CRM אוטומטי', savings: 10, cost: 0.1, icon: 'fa-database' },
  { id: 'leads', name: 'ניהול לידים חכם', savings: 20, cost: 0.3, icon: 'fa-filter' },
  { id: 'invoices', name: 'הפקת חשבוניות אוטו׳', savings: 5, cost: 0.05, icon: 'fa-file-invoice' },
  { id: 'analysis', name: 'ניתוח נתונים ב-AI', savings: 25, cost: 0.4, icon: 'fa-chart-line' },
  { id: 'calendar', name: 'תיאום פגישות אוטומטי', savings: 8, cost: 0.15, icon: 'fa-calendar-check' },
];

const ProfitEngine: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [efficiency, setEfficiency] = useState(0);

  useEffect(() => {
    const selected = MODULES.filter(m => activeModules.includes(m.id));
    const newSavings = selected.reduce((acc, m) => acc + m.savings, 0);
    const newEfficiency = selected.length * 16.6; // Max 100 approx
    
    setTotalSavings(newSavings);
    setEfficiency(newEfficiency);
  }, [activeModules]);

  const toggleModule = (id: string) => {
    setActiveModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-5xl glass border-white/10 rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-full max-h-[800px]">
        {/* Header/Close for mobile */}
        <button onClick={onClose} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors z-20 md:hidden">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        {/* Control Panel (Right) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-l border-white/5 overflow-y-auto order-2 md:order-1 text-right">
          <span className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Simulation Console</span>
          <h2 className="text-3xl font-black mb-8 text-white">בנה את מנוע הרווח שלך</h2>
          <p className="text-gray-400 text-sm mb-10">בחר את המודולים שתרצה להטמיע בעסק וראה את ההשפעה המיידית על היעילות והרווח.</p>
          
          <div className="grid grid-cols-1 gap-4">
            {MODULES.map((mod) => (
              <button 
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                  activeModules.includes(mod.id) 
                    ? 'bg-cyan-500/10 border-cyan-500 text-white' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeModules.includes(mod.id) ? 'bg-cyan-500 text-black' : 'bg-white/10'}`}>
                    <i className={`fa-solid ${mod.icon}`}></i>
                  </div>
                  <span className="font-bold text-sm">{mod.name}</span>
                </div>
                {activeModules.includes(mod.id) && <i className="fa-solid fa-check text-cyan-400"></i>}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizer (Left) */}
        <div className="w-full md:w-1/2 bg-[#05070f] p-8 md:p-12 flex flex-col justify-center items-center relative order-1 md:order-2">
          <button onClick={onClose} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors z-20 hidden md:block">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>

          <div className="w-full space-y-12">
            {/* Main Gauge */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle 
                  cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={502.4}
                  strokeDashoffset={502.4 - (502.4 * efficiency) / 100}
                  className="text-cyan-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white">{Math.round(efficiency)}%</span>
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">יעילות מנוע</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="glass p-6 rounded-2xl border-white/5 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">חיסכון בשעות (חודשי)</span>
                <span className="text-3xl font-black text-white">~{totalSavings * 4}</span>
              </div>
              <div className="bg-cyan-500 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <span className="text-[10px] text-black font-black uppercase tracking-widest mb-1 block">פוטנציאל גידול ברווח</span>
                <span className="text-3xl font-black text-black">+{totalSavings}%</span>
              </div>
            </div>

            <div className="text-center pt-8">
              <a 
                href="#contact" 
                onClick={onClose}
                className={`w-full py-5 block rounded-2xl font-black transition-all ${
                  activeModules.length > 0 ? 'bg-white text-black hover:bg-cyan-400' : 'bg-white/5 text-white/20 pointer-events-none'
                }`}
              >
                הטמעת המערכת בעסק שלי
              </a>
              <p className="text-[9px] text-gray-600 mt-4 uppercase tracking-[0.2em]">* סימולציה מבוססת נתוני לקוחות קודמים</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitEngine;
