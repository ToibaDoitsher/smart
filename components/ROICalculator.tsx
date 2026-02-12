
import React, { useState } from 'react';

const ROICalculator: React.FC = () => {
  const [hours, setHours] = useState(10);
  const [wage, setWage] = useState(100);

  const monthlySavingsHours = hours * 4;
  const monthlySavingsMoney = monthlySavingsHours * wage;
  const yearlySavings = monthlySavingsMoney * 12;

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <div className="glass p-10 md:p-16 rounded-[3rem] border-cyan-500/20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4">כמה זמן וכסף תחסכי?</h2>
          <p className="text-gray-400">חשבי את פוטנציאל החיסכון בעסק שלך בעזרת אוטומציה חכמה</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-cyan-400 uppercase tracking-widest">
                שעות עבודה ידניות בשבוע: {hours}
              </label>
              <input 
                type="range" min="1" max="100" value={hours} 
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-cyan-400 uppercase tracking-widest">
                עלות שעת עבודה (₪): {wage}
              </label>
              <input 
                type="range" min="50" max="1000" step="10" value={wage} 
                onChange={(e) => setWage(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 flex flex-col gap-6 text-center">
            <div>
              <span className="block text-gray-500 text-sm font-bold mb-1">חיסכון חודשי מוערך</span>
              <span className="text-4xl font-black text-white">₪{monthlySavingsMoney.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div>
              <span className="block text-cyan-400 text-sm font-bold mb-1">חיסכון שנתי מצטבר</span>
              <span className="text-5xl font-black text-cyan-400 glow-text">₪{yearlySavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
