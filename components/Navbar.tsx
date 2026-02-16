
import React, { useState, useEffect, useRef } from 'react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  // Correctly formatted Drive link for direct image display
  const logoUrl = "https://lh3.googleusercontent.com/d/1FG2-XYkO96dX7wpyxq4bi55GRFdk2vp0";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      if (dist < 100) {
        const moveX = (e.clientX - centerX) * 0.2;
        const moveY = (e.clientY - centerY) * 0.2;
        logoRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        logoRef.current.style.transform = `translate(0, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-4 group">
          <div ref={logoRef} className="w-12 h-12 flex items-center justify-center transition-transform duration-300">
             <img 
               src={logoUrl} 
               alt="Toiby Doitsher Logo" 
               className="w-full h-full object-contain filter brightness-110"
               onError={(e) => {
                 // Fallback if Drive link fails
                 (e.target as HTMLImageElement).src = "https://img.icons8.com/fluency/96/artificial-intelligence.png";
               }}
             />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-black tracking-tighter leading-none mb-1 text-white">טויבי דויטשר</span>
            <span className="text-[7px] font-black tracking-[0.3em] uppercase text-cyan-400">Architectural AI Systems</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.2em]">
          <a href="#services" className="hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100">שירותים</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100">תיק עבודות</a>
          <a href="#contact" className="px-6 py-2.5 bg-white text-black rounded-sm hover:bg-cyan-500 transition-all shadow-lg">
            אתחל פרויקט
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
