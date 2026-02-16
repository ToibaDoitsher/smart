
import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onTurboToggle?: () => void;
  isTurbo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onTurboToggle, isTurbo }) => {
  const [scrolled, setScrolled] = useState(false);
  const logoUrl = "https://lh3.googleusercontent.com/d/1FG2-XYkO96dX7wpyxq4bi55GRFdk2vp0";
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Magnetic Logo Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      if (dist < 100) {
        const moveX = (e.clientX - centerX) * 0.3;
        const moveY = (e.clientY - centerY) * 0.3;
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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-4 group">
          <div ref={logoRef} className="w-12 h-12 flex items-center justify-center transition-transform duration-300">
             <img 
               src={logoUrl} 
               alt="טויבי דויטשר - מומחית אוטומציה עסקית, פיתוח תוכנה ובינה מלאכותית" 
               className={`w-full h-full object-contain filter brightness-110 contrast-125 transition-all ${isTurbo ? 'hue-rotate-[180deg]' : ''}`}
               onError={(e) => (e.target as HTMLImageElement).src="https://img.icons8.com/fluency/96/artificial-intelligence.png"}
             />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-black tracking-tighter leading-none mb-1 text-white transition-colors ${isTurbo ? 'text-red-500' : ''}`}>טויבי דויטשר</span>
            <span className={`text-[7px] font-black tracking-[0.3em] uppercase opacity-70 transition-colors ${isTurbo ? 'text-red-400' : 'text-cyan-400'}`}>Architectural AI Systems</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.2em]">
          <button 
            onClick={onTurboToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isTurbo ? 'bg-red-500 border-red-400 text-white animate-pulse' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            <i className={`fa-solid ${isTurbo ? 'fa-fire-flame-curved' : 'fa-gauge-high'}`}></i>
            {isTurbo ? 'TURBO ON' : 'TURBO OFF'}
          </button>
          
          <a href="#services" className="hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100">שירותים</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100">תיק עבודות</a>
          <a href="#contact" className={`px-6 py-2.5 rounded-sm transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${isTurbo ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-white text-black hover:bg-cyan-500'}`}>
            אתחל פרויקט
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
