
import React, { useState } from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<typeof SERVICES[0] | null>(null);

  const articlesContent: Record<string, string> = {
    'automation': 'אוטומציה היא לא רק חיבור בין כלים, היא בניית ארכיטקטורה עסקית חדשה. בעזרת Make (לשעבר Integromat), אנחנו יוצרים זרימות נתונים שסוגרות את הפער שבין המכירות לשירות הלקוחות. דמיינו שכל ליד שמגיע מהפייסבוק נכנס אוטומטית ל-CRM, מקבל הודעת וואטסאפ אישית, ובו זמנית נפתח לו כרטיס במערכת המשימות. זה לא עתידני, זה הכרחי.',
    'ai': 'הטמעת בינה מלאכותית (LLMs) בעסק מאפשרת לכם לקרוא אלפי מסמכים בשניות, לסכם ישיבות וליצור תוכן שיווקי מותאם אישית. אנחנו משתמשים במודלים של OpenAI וגוגל כדי להפוך מידע גולמי לתובנות עסקיות. סוכן ה-AI שלנו יכול לנתח דוחות רווח והפסד או לכתוב הצעות מחיר מורכבות על בסיס היסטוריית הלקוח.',
    'api': 'סוכני השיחה של הדור החדש הם לא הבוטים הטיפשים שאתם מכירים. מדובר בסוכנים בעלי הקשר (Context-Aware) שמכירים את כל הידע הארגוני שלכם. הם יודעים לענות על שאלות טכניות, לקבוע תורים ולבצע מכירות בתוך הוואטסאפ או האתר, תוך שהם שומרים על טון דיבור אנושי ומקצועי לחלוטין.'
  };

  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black mb-4">הפתרונות שלנו</h2>
        <div className="w-24 h-2 bg-white mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SERVICES.map((service) => (
          <div key={service.id} className="glass p-10 rounded-[2.5rem] relative group border-white/5 hover:border-cyan-500/30 transition-all duration-500">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${service.color} flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${service.icon} text-white text-2xl`}></i>
            </div>
            <h3 className="text-2xl font-black mb-4">{service.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-8">{service.description}</p>
            <button 
              onClick={() => setActiveArticle(service)}
              className="px-6 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white text-xs font-black uppercase tracking-widest text-white hover:text-black transition-all"
            >
              קרא עוד
            </button>
          </div>
        ))}
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setActiveArticle(null)}></div>
          <div className="glass max-w-2xl w-full p-12 rounded-[3rem] border-white/10 relative z-10 animate-slideUp">
            <button onClick={() => setActiveArticle(null)} className="absolute top-8 left-8 text-2xl text-gray-500 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${activeArticle.color} flex items-center justify-center mb-10 shadow-2xl`}>
              <i className={`fa-solid ${activeArticle.icon} text-3xl text-white`}></i>
            </div>
            <h2 className="text-4xl font-black mb-6">{activeArticle.title}</h2>
            <div className="w-12 h-1 bg-cyan-500 mb-8"></div>
            <p className="text-xl text-gray-300 leading-relaxed">
              {articlesContent[activeArticle.id]}
            </p>
            <a href="#contact" onClick={() => setActiveArticle(null)} className="inline-block mt-10 px-8 py-4 bg-cyan-500 text-black font-black rounded-xl">בואו נדבר על זה</a>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
