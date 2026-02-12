
import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const words = ["אוטומציה עסקית", "ארכיטקטורת AI", "מערכות אינטגרציה", "ייעול תהליכים"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2500);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <section className="min-h-screen pt-48 pb-20 flex flex-col items-center text-center relative">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] -z-10 rounded-full"></div>
      
      <div className="max-w-6xl px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-full mb-10 animate-fadeIn">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
          <span className="text-cyan-400 font-black tracking-[0.3em] uppercase text-[9px]">Advanced Enterprise Solutions</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[1] tracking-tighter">
          הופכים כל עסק<br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
            למכונה חכמה
          </span>
        </h1>

        <div className="text-3xl md:text-5xl font-black text-white min-h-[1.2em] mb-12 flex items-center justify-center">
          <span className="border-r-8 border-cyan-500 pr-4 ml-2 h-[0.9em] flex items-center">
            {words[index].substring(0, subIndex)}
          </span>
        </div>

        <p className="max-w-3xl mx-auto text-gray-500 text-xl md:text-2xl mb-16 leading-relaxed font-light">
          אל תבזבזו עוד רגע על עבודה ידנית. אנחנו בונים תשתית AI ואוטומציה המייצרת לכם חופש ומאפשרת להתמקד בניהול – <span className="text-white font-bold">לא בתפעול</span>.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a href="#contact" className="group px-12 py-6 bg-white text-black font-black text-xl rounded-2xl hover:bg-cyan-500 transition-all hover:scale-105 active:scale-95 shadow-xl">
            התחילו לחסוך זמן
          </a>
          <a href="#projects" className="px-12 py-6 glass border border-white/10 rounded-2xl font-black text-xl hover:bg-white/5 transition-all">
            פורטפוליו מערכות
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
