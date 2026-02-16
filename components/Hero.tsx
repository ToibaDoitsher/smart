
import React, { useEffect, useState, useRef } from 'react';

const Hero: React.FC<{ isTurbo?: boolean }> = ({ isTurbo }) => {
  const words = ["אוטומציה עסקית", "ארכיטקטורת AI", "מערכות אינטגרציה", "ייעול תהליכים"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Star field effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const stars: {x: number, y: number, size: number, speed: number}[] = [];

    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1
      });
    }

    let mouseX = w / 2;
    let mouseY = h / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = isTurbo ? "#ff4444" : "white";
      stars.forEach(s => {
        const dx = (mouseX - w/2) * 0.02;
        const dy = (mouseY - h/2) * 0.02;
        
        ctx.beginPath();
        ctx.arc(s.x + dx, s.y + dy, s.size, 0, Math.PI * 2);
        ctx.fill();
        
        s.y -= isTurbo ? s.speed * 5 : s.speed;
        if (s.y < 0) s.y = h;
      });
      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isTurbo]);

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
    <section className="min-h-screen pt-48 pb-20 flex flex-col items-center text-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none opacity-40" />
      <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] -z-10 rounded-full animate-pulse transition-colors duration-1000 ${isTurbo ? 'bg-red-500/20' : 'bg-cyan-500/10'}`}></div>
      
      <div className="max-w-6xl px-6 relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-full mb-10 animate-fadeIn`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${isTurbo ? 'bg-red-500' : 'bg-cyan-500'}`}></span>
          <span className={`font-black tracking-[0.3em] uppercase text-[9px] transition-colors ${isTurbo ? 'text-red-400' : 'text-cyan-400'}`}>Advanced Enterprise Solutions</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[1] tracking-tighter reveal">
          הופכים כל עסק<br />
          <span className={`bg-gradient-to-r transition-all duration-1000 bg-clip-text text-transparent italic ${isTurbo ? 'from-red-600 via-orange-500 to-yellow-400' : 'from-cyan-400 via-indigo-400 to-purple-500'}`}>
            למכונה חכמה
          </span>
        </h1>

        <div className="text-3xl md:text-5xl font-black text-white min-h-[1.2em] mb-12 flex items-center justify-center">
          <span className={`border-r-8 pr-4 ml-2 h-[0.9em] flex items-center transition-colors ${isTurbo ? 'border-red-500' : 'border-cyan-500'}`}>
            {words[index].substring(0, subIndex)}
          </span>
        </div>

        <p className="max-w-3xl mx-auto text-gray-500 text-xl md:text-2xl mb-16 leading-relaxed font-light reveal">
          אל תבזבזו עוד רגע על עבודה ידנית. אנחנו בונים תשתית AI ואוטומציה המייצרת לכם חופש ומאפשרת להתמקד בניהול – <span className="text-white font-bold">לא בתפעול</span>.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center reveal">
          <a href="#contact" className={`group px-12 py-6 font-black text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl relative overflow-hidden ${isTurbo ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-white text-black hover:bg-cyan-500'}`}>
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
