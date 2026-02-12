
import React, { useState, useEffect } from 'react';

const AIBlueprint: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const steps = [
    {
      title: 'שלב 1: מקור הנתונים',
      options: [
        { id: 'leads', label: 'לידים מהפייסבוק', icon: 'fa-users' },
        { id: 'calls', label: 'שיחות טלפון', icon: 'fa-phone' },
        { id: 'emails', label: 'אימיילים נכנסים', icon: 'fa-envelope' }
      ]
    },
    {
      title: 'שלב 2: עיבוד AI',
      options: [
        { id: 'analysis', label: 'ניתוח רגשות וסיווג', icon: 'fa-brain' },
        { id: 'summary', label: 'סיכום והפקת תובנות', icon: 'fa-file-lines' },
        { id: 'translation', label: 'תרגום והתאמה שפתית', icon: 'fa-language' }
      ]
    },
    {
      title: 'שלב 3: פעולת יציאה',
      options: [
        { id: 'whatsapp', label: 'הודעת וואטסאפ אישית', icon: 'fa-comment' },
        { id: 'crm', label: 'עדכון CRM אוטומטי', icon: 'fa-table' },
        { id: 'invoice', label: 'הפקת חשבונית וסליקה', icon: 'fa-file-invoice-dollar' }
      ]
    }
  ];

  const handleSelect = (optionId: string) => {
    const newSelections = [...selections];
    newSelections[activeStep] = optionId;
    setSelections(newSelections);
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setIsSimulating(true);
    }
  };

  const reset = () => {
    setActiveStep(0);
    setSelections([]);
    setIsSimulating(false);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-4xl glass border-white/10 rounded-[3rem] overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors z-20">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className="p-10 md:p-16 text-right">
          {!isSimulating ? (
            <div className="animate-slideUp">
              <span className="text-cyan-500 font-black text-xs uppercase tracking-[0.5em] mb-4 block">Automation Architect</span>
              <h2 className="text-4xl font-black mb-10 text-white leading-tight">{steps[activeStep].title}</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {steps[activeStep].options.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="p-8 glass rounded-3xl border-white/5 hover:border-cyan-500/50 hover:bg-white/5 transition-all text-center group"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${opt.icon} text-2xl text-cyan-400`}></i>
                    </div>
                    <span className="font-bold text-white group-hover:text-cyan-400">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex justify-center gap-2">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= activeStep ? 'w-12 bg-cyan-500' : 'w-4 bg-white/10'}`}></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn text-center flex flex-col items-center">
              <div className="w-32 h-32 relative mb-10">
                <div className="absolute inset-0 border-4 border-cyan-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fa-solid fa-microchip text-4xl text-cyan-500"></i>
                </div>
              </div>

              <h2 className="text-4xl font-black text-white mb-6">הזרקת קוד בוצעה בהצלחה!</h2>
              <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
                המכונה שלך מוכנה. חיברנו את המערכות בצורה אופטימלית לחיסכון של כ-12 שעות שבועיות בתהליך זה.
              </p>

              <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
                <a href="#contact" onClick={onClose} className="flex-1 py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-500 transition-all text-center">
                  הטמע בעסק שלי
                </a>
                <button onClick={reset} className="flex-1 py-5 glass border border-white/10 text-white font-black rounded-2xl hover:bg-white/5 transition-all">
                  תכנן מחדש
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBlueprint;
