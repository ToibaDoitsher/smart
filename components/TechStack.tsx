
import React from 'react';

const TechStack: React.FC = () => {
  const tools = [
    { name: 'Make', icon: 'fa-solid fa-diagram-project' },
    { name: 'Zapier', icon: 'fa-solid fa-bolt-lightning' },
    { name: 'OpenAI', icon: 'fa-solid fa-brain' },
    { name: 'Python', icon: 'fa-brands fa-python' },
    { name: 'Monday', icon: 'fa-solid fa-table-list' },
    { name: 'Airtable', icon: 'fa-solid fa-database' },
    { name: 'Gemini', icon: 'fa-solid fa-sparkles' },
    { name: 'React', icon: 'fa-brands fa-react' },
  ];

  return (
    <div className="py-16 bg-black/40 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500/60">Technology Ecosystem</p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-32 items-center">
          {[...tools, ...tools].map((tool, i) => (
            <div key={i} className="flex items-center gap-4 group opacity-30 hover:opacity-100 transition-opacity">
              <i className={`${tool.icon} text-3xl text-white group-hover:text-cyan-400`}></i>
              <span className="text-xl font-black tracking-tighter group-hover:text-cyan-400">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TechStack;
