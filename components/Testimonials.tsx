
import React from 'react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'מנכ״ל סוכנות נדל״ן',
      text: 'מערכת האוטומציה שקיבלנו חוסכת לנו מעל 40 שעות עבודה בחודש. פשוט מנוע שעובד בשקט.',
      icon: 'fa-building-columns'
    },
    {
      name: 'מנהל תפעול בחברת לוגיסטיקה',
      text: 'החיבור שבוצע בין מערכות המחסן להנהלת החשבונות שינה את פני העסק. אפס טעויות.',
      icon: 'fa-truck-fast'
    },
    {
      name: 'בעלת מותג איקומרס',
      text: 'סוכן ה-AI סוגר לנו מכירות בלילה ונותן מענה מקצועי ללקוחות בתוך שניות. מדהים.',
      icon: 'fa-bag-shopping'
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black mb-4">מה השוק אומר?</h2>
        <div className="w-20 h-1 bg-white mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((rev, i) => (
          <div key={i} className="glass p-10 rounded-[2.5rem] border-white/5 relative group hover:scale-[1.02] transition-all">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
              <i className={`fa-solid ${rev.icon} text-2xl text-cyan-500`}></i>
            </div>
            <p className="text-gray-300 italic mb-8 relative z-10 leading-relaxed text-lg">"{rev.text}"</p>
            <div className="text-right">
              <h4 className="font-black text-white text-sm">{rev.name}</h4>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Verified Client</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
