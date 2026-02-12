
import React, { useState, useEffect, useRef } from 'react';

const CountUp: React.FC<{ end: number, suffix?: string, duration?: number }> = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.5 });
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

const Stats: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="glass rounded-[3rem] p-12 md:p-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col gap-2 relative">
          <span className="text-4xl md:text-6xl font-black text-cyan-400 glow-text">
            <CountUp end={50} suffix="+" />
          </span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">פרויקטים מוצלחים</span>
        </div>

        <div className="flex flex-col gap-2 relative">
          <span className="text-4xl md:text-6xl font-black text-cyan-400 glow-text">
            <CountUp end={1000} suffix="+" />
          </span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">שעות שנחסכו</span>
        </div>

        <div className="flex flex-col gap-2 relative">
          <span className="text-4xl md:text-6xl font-black text-cyan-400 glow-text">
            <CountUp end={100} suffix="%" />
          </span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">דיוק מערכות</span>
        </div>

        <div className="flex flex-col gap-2 relative">
          <span className="text-4xl md:text-6xl font-black text-cyan-400 glow-text">
            <CountUp end={24} suffix="/7" />
          </span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">המכונה עובדת עבורכם</span>
        </div>
      </div>
    </section>
  );
};

export default Stats;
