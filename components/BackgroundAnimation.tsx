
import React from 'react';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#02040a]">
      {/* Neural Network Glows */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
      
      {/* Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Floating Code Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] font-mono text-[9px] select-none text-cyan-500">
        <div className="absolute top-[15%] left-[5%] animate-float">01011001 01010100</div>
        <div className="absolute top-[40%] right-[10%] animate-float [animation-delay:3s]">AI_AGENT_STATUS: ACTIVE</div>
        <div className="absolute bottom-[30%] left-[20%] animate-float [animation-delay:5s]">WEB_HOOK_LISTEN: 8080</div>
        <div className="absolute bottom-[10%] right-[30%] animate-float [animation-delay:1s]">ROI_OPTIMIZATION_IN_PROGRESS</div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BackgroundAnimation;
