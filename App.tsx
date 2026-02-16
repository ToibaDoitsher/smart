
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
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden md:block"
        style={{ transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isClicking ? 0.8 : (isPointer ? 1.2 : 1)})`, mixBlendMode: 'difference' }}
      ></div>
      <div 
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ transform: `translate(${position.x - 2}px, ${position.y - 2}px)`, mixBlendMode: 'difference' }}
      ></div>
    </>
  );
};

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

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
    <div className="relative min-h-screen text-white bg-[#02040a] selection:bg-cyan-500/30 overflow-x-hidden">
      <CustomCursor />
      
      {isAuditOpen && <AIAuditTool onClose={() => setIsAuditOpen(false)} />}

      <div 
        className="fixed top-0 left-0 h-[3px] bg-cyan-500 z-[100] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <BackgroundAnimation />
      <Navbar />
      
      <main className="relative z-10 bg-transparent">
        <Hero />
        
        <div className="reveal bg-transparent">
          <TechStack />
        </div>

        <div className="reveal bg-transparent">
          <Stats />
        </div>

        <div className="reveal bg-transparent">
          <Services />
        </div>

        <section className="py-24 px-6 max-w-7xl mx-auto reveal bg-transparent">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-right">תהליך העבודה שלנו</h2>
            <div className="w-16 h-1 bg-cyan-500 mr-0 ml-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-right">
            {[
              { title: 'אפיון ומיפוי', desc: 'זיהוי נקודות הכשל והזדמויות לצמיחה מהירה בעסק.' },
              { title: 'פיתוח ארכיטקטורה', desc: 'בניית מנועי אוטומציה וסוכני AI המותאמים אישית.' },
              { title: 'הטמעה מלאה', desc: 'ליווי צמוד עד שהמערכות עובדות בסנכרון מושלם.' }
            ].map((step, i) => (
              <div key={i} className="glass p-12 rounded-[2rem] border-white/5 hover:bg-white/[0.03] transition-all duration-500">
                <h3 className="text-2xl font-black mb-6 text-cyan-400">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="reveal bg-transparent">
          <ROICalculator />
        </div>

        <div className="reveal bg-transparent">
          <Testimonials />
        </div>

        <div className="reveal bg-transparent">
          <Projects onOpenAudit={() => setIsAuditOpen(true)} />
        </div>

        <section id="contact" className="py-32 px-6 max-w-5xl mx-auto relative reveal bg-transparent">
          <ContactForm />
        </section>

        <section className="py-32 bg-transparent">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="text-3xl font-light tracking-widest text-white/90">
                052-7179418
              </span>
              <a href="mailto:t025959714@gmail.com" className="text-sm text-white/40 hover:text-white transition-colors tracking-widest uppercase underline underline-offset-8 decoration-white/10">
                t025959714@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 text-center bg-black/40 border-t border-white/5">
        <p className="font-black tracking-[0.5em] text-[8px] uppercase text-gray-700">
          Toiby Doitsher &copy; {new Date().getFullYear()} | Core Intelligence
        </p>
      </footer>
      <ChatWidget />
    </div>
  );
};

export default App;
