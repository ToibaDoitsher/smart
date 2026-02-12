
import React from 'react';
import { PROJECTS } from '../constants';

interface ProjectsProps {
  onOpenAudit: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onOpenAudit }) => {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">הזרקת קוד למציאות</h2>
        <p className="text-gray-500 font-mono text-sm">> פרויקטים נבחרים וכלים אינטראקטיביים</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {PROJECTS.map((project, idx) => {
          const isAudit = project.link === 'ai-audit';
          const Wrapper = isAudit ? 'button' : 'a';
          const props = isAudit ? { onClick: onOpenAudit } : { href: project.link, target: "_blank", rel: "noopener noreferrer" };

          return (
            <Wrapper key={idx} {...(props as any)} className="group relative block w-full text-right h-[400px] md:h-[450px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black transition-transform duration-500 hover:-translate-y-2">
              <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="absolute top-8 right-8 z-20 flex gap-3">
                <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-[9px] font-black text-cyan-400 uppercase tracking-widest border border-white/10">
                  {project.category}
                </span>
                {isAudit && (
                  <span className="bg-cyan-500 text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    HOT TOOL
                  </span>
                )}
              </div>

              <div className="absolute bottom-10 left-10 right-10 z-20">
                <h3 className="text-3xl font-black text-white mb-4 leading-tight group-hover:text-cyan-400 transition-colors drop-shadow-2xl tracking-tighter">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm mb-8 max-w-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {isAudit 
                    ? 'קבלו תכנית עבודה מלאה לאוטומציה של העסק שלכם, מבוססת על מנוע הבינה המלאכותית של טויבי.' 
                    : 'יישום מלא של סוכני AI ואינטגרציות API מורכבות לשיפור ה-ROI ב-300%.'}
                </p>
                <div className="inline-flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-[0.3em] group-hover:text-cyan-400 transition-all">
                  <span className="h-px w-8 bg-cyan-500 group-hover:w-16 transition-all"></span>
                  {isAudit ? 'צרו תכנית עבודה' : 'כניסה למערכת'}
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
