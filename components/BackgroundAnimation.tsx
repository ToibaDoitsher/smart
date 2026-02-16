
import React, { useState, useEffect, useCallback } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  text: string;
  speed: number;
  opacity: number;
  isPopping: boolean;
}

const BUBBLE_TEXTS = ["אוטומציה", "חיסכון $", "AI", "יעילות", "בוטים", "פיתוח", "שקט נפשי"];

const BackgroundAnimation: React.FC<{ isTurbo?: boolean }> = ({ isTurbo }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const playPopSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const spawnBubble = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * 90 + 5,
    y: 110,
    size: Math.random() * 60 + 40,
    text: BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)],
    speed: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.3 + 0.1,
    isPopping: false
  }), []);

  useEffect(() => {
    const initial = Array.from({ length: 5 }, spawnBubble);
    setBubbles(initial);

    const interval = setInterval(() => {
      setBubbles(prev => {
        const updated = prev.map(b => ({
          ...b,
          y: b.y - (isTurbo ? b.speed * 4 : b.speed),
          opacity: b.y < 20 ? b.opacity - 0.01 : b.opacity
        })).filter(b => b.y > -20 && b.opacity > 0);

        if (updated.length < 6) {
          updated.push(spawnBubble());
        }
        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isTurbo, spawnBubble]);

  const handlePop = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, isPopping: true } : b));
    playPopSound();
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
    }, 300);
  };

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#02040a]">
      {/* Neural Network Glows */}
      <div className={`absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse transition-colors duration-1000 ${isTurbo ? 'bg-red-600/10' : 'bg-cyan-600/10'}`}></div>
      <div className={`absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse [animation-delay:2s] transition-colors duration-1000 ${isTurbo ? 'bg-red-900/10' : 'bg-indigo-900/10'}`}></div>
      
      {/* Bubbles System */}
      {bubbles.map(bubble => (
        <div 
          key={bubble.id}
          onMouseEnter={() => !bubble.isPopping && handlePop(bubble.id)}
          className={`absolute flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 pointer-events-auto ${bubble.isPopping ? 'scale-150 opacity-0' : 'scale-100'}`}
          style={{ 
            left: `${bubble.x}%`, 
            top: `${bubble.y}%`, 
            width: bubble.size, 
            height: bubble.size,
            background: isTurbo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(6, 182, 212, 0.1)',
            border: `1px solid ${isTurbo ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
            backdropFilter: 'blur(4px)',
            opacity: bubble.opacity,
            boxShadow: `0 0 20px ${isTurbo ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`
          }}
        >
          {bubble.isPopping ? (
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full animate-ping ${isTurbo ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase text-center text-white/60 tracking-tighter select-none">{bubble.text}</span>
          )}
        </div>
      ))}

      {/* Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Floating Code Blobs */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.05] font-mono text-[9px] select-none transition-colors ${isTurbo ? 'text-red-500' : 'text-cyan-500'}`}>
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
