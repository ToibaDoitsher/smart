
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  // Direct link for Google Drive image using the ID provided
  const logoUrl = "https://lh3.googleusercontent.com/d/1FG2-XYkO96dX7wpyxq4bi55GRFdk2vp0";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/90 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-4 group">
          <div className="w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
             <img 
               src={logoUrl} 
               alt="Toiby Doitsher Logo" 
               className="w-full h-full object-contain filter brightness-110 contrast-125"
               onError={(e) => (e.target as HTMLImageElement).src="https://img.icons8.com/fluency/96/artificial-intelligence.png"}
             />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none mb-1 text-white">טויבי דויטשר</span>
            <span className="text-[7px] text-cyan-400 font-black tracking-[0.3em] uppercase opacity-70">Architectural AI Systems</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.2em]">
          <a href="#services" className="hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100">שירותים</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors opacity-60 hover:opacity-100">תיק עבודות</a>
          <a href="#contact" className="px-6 py-2.5 bg-white text-black rounded-sm hover:bg-cyan-500 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            אתחל פרויקט
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
