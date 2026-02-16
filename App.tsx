
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import Stats from './components/Stats';
import ChatWidget from './components/ChatWidget';
import BackgroundAnimation from './components/BackgroundAnimation';
import ContactForm from './components/ContactForm';
import ROICalculator from './components/ROICalculator';
import TechStack from './components/TechStack';
import Testimonials from './components/Testimonials';
import AIAuditTool from './components/AIAuditTool';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [trail, setTrail] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
      setTrail(prev => [{x, y, id: Math.random()}, ...prev.slice(0, 8)]);
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {trail.map((t, i) => (
        <div 
          key={t.id}
          className="fixed top-0 left-0 w-4 h-4 bg-cyan-500/20 rounded-full pointer-events-none z-[9998] blur-sm transition-opacity duration-300"
          style={{ 
            transform: `translate(${t.x - 8}px, ${t.y - 8}px)`,
            opacity: 1 - (i / 10)
          }}
        ></div>
      ))}
      <div 
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/30 rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out hidden md:block"
        style={{ transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})` }}
      ></div>
      <div 
        className="fixed top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ transform: `translate(${position.x - 2}px, ${position.y - 2}px)` }}
      ></div>
    </>
  );
};

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isTurbo, setIsTurbo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative min-h-screen text-white selection:bg-cyan-500/40 overflow-x-hidden bg-[#02040a] cursor-none transition-colors duration-700 ${isTurbo ? 'turbo-mode' : ''}`}>
      <CustomCursor />
      
      {isAuditOpen && <AIAuditTool onClose={() => setIsAuditOpen(false)} />}

      <div 
        className={`fixed top-0 left-0 h-[2px] z-[100] transition-all duration-100 ${isTurbo ? 'bg-red-500 shadow-[0_0_10px_#ff0000]' : 'bg-gradient-to-r from-cyan-500 via-white to-cyan-500'}`}
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <BackgroundAnimation isTurbo={isTurbo} />
      <Navbar onTurboToggle={() => setIsTurbo(!isTurbo)} isTurbo={isTurbo} />
      
      <main className={isTurbo ? 'animate-vibrate-subtle' : ''}>
        <Hero isTurbo={isTurbo} />
        
        <div className="reveal">
          <TechStack />
        </div>

        <div className="reveal">
          <Stats />
        </div>

        <div className="reveal">
          <Services isTurbo={isTurbo} />
        </div>

        <section className="py-24 px-6 max-w-7xl mx-auto reveal">
          <div className="text-center mb-16">
            <span className={`font-black tracking-[0.6em] text-[8px] uppercase block mb-4 opacity-50 ${isTurbo ? 'text-red-500' : 'text-cyan-500'}`}>Operation Protocol</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-right font-sans">תהליך העבודה שלנו</h2>
            <div className={`w-16 h-0.5 mr-0 ml-auto opacity-30 ${isTurbo ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: '01', title: 'אפיון ומיפוי', desc: 'זיהוי נקודות הכשל והזדמנויות לצמיחה מהירה בעסק.' },
              { num: '02', title: 'פיתוח ארכיטקטורה', desc: 'בניית מנועי אוטומציה וסוכני AI המותאמים אישית.' },
              { num: '03', title: 'הטמעה מלאה', desc: 'ליווי צמוד עד שהמערכות עובדות בסנכרון מושלם.' }
            ].map((step, i) => (
              <div key={i} className="glass p-12 rounded-[2rem] relative group border-white/5 text-right hover:bg-white/[0.02] transition-all duration-700">
                <span className={`text-7xl font-black absolute top-8 left-8 transition-all font-sans tracking-tighter ${isTurbo ? 'text-red-500/5 group-hover:text-red-500/10' : 'text-white/[0.02] group-hover:text-cyan-500/10'}`}>{step.num}</span>
                <h3 className={`text-2xl font-black mb-6 transition-colors font-sans ${isTurbo ? 'group-hover:text-red-500' : 'group-hover:text-cyan-400'}`}>{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-sans font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="reveal">
          <ROICalculator />
        </div>

        <div className="reveal">
          <Testimonials />
        </div>

        <div className="reveal">
          <Projects onOpenAudit={() => setIsAuditOpen(true)} />
        </div>

        <section id="contact" className="py-32 px-6 max-w-5xl mx-auto relative reveal">
          <div className={`absolute inset-0 blur-[150px] -z-10 ${isTurbo ? 'bg-red-500/5' : 'bg-cyan-500/[0.02]'}`}></div>
          <ContactForm />
        </section>

        <section className="py-32 bg-[#010206] border-t border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <p className={`text-[8px] font-black uppercase tracking-[1em] mb-12 opacity-40 ${isTurbo ? 'text-red-500' : 'text-cyan-500'}`}>Get in Touch</p>
            <div className="flex flex-col items-center gap-10">
               <div className="reveal">
                  <span className={`text-2xl md:text-3xl font-light block leading-none tracking-[0.1em] transition-all duration-700 cursor-pointer select-all font-sans ${isTurbo ? 'text-red-400 hover:text-red-200' : 'text-white/90 hover:text-cyan-400'}`}>
                    052-7179418
                  </span>
               </div>
               <div className="reveal">
                  <a href="mailto:t025959714@gmail.com" className={`text-[10px] md:text-[11px] font-medium transition-all duration-700 block tracking-[0.3em] uppercase underline-offset-[12px] underline decoration-white/5 font-sans ${isTurbo ? 'text-red-900 hover:text-red-500 hover:decoration-red-500/50' : 'text-white/30 hover:text-white hover:decoration-cyan-500/50'}`}>
                    t025959714@gmail.com
                  </a>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 text-center bg-black relative overflow-hidden border-t border-white/5">
        <p className="font-black tracking-[0.5em] text-[8px] uppercase text-gray-800 font-mono opacity-50">
          Toiby Doitsher &copy; {new Date().getFullYear()} | Core Intelligence
        </p>
      </footer>
      <ChatWidget />

      <style>{`
        .turbo-mode {
          --theme-primary: #ef4444;
          --theme-glow: rgba(239, 68, 68, 0.4);
        }
        @keyframes vibrate-subtle {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(0.5px, 0.5px); }
          50% { transform: translate(-0.5px, 0.5px); }
          75% { transform: translate(0.5px, -0.5px); }
        }
        .animate-vibrate-subtle {
          animation: vibrate-subtle 0.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
