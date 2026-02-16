
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  text: string;
  opacity: number;
}

const BUBBLE_TEXTS = ["אוטומציה", "חיסכון $", "AI", "יעילות", "בוטים", "פיתוח", "CRM"];

const BackgroundAnimation: React.FC<{ isTurbo?: boolean }> = ({ isTurbo }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnNode = useCallback(() => ({
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
    size: Math.random() * 40 + 20,
    text: BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)],
    opacity: Math.random() * 0.4 + 0.1
  }), []);

  useEffect(() => {
    setNodes(Array.from({ length: 15 }, spawnNode));

    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => {
      setIsMouseDown(false);
      // Explode effect on mouse up
      setNodes(prev => prev.map(n => {
        const dx = n.x - mousePos.x;
        const dy = n.y - mousePos.y;
        const dist = Math.hypot(dx, dy);
        const force = 15;
        return {
          ...n,
          vx: (dx / dist) * force,
          vy: (dy / dist) * force
        };
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => {
        let { x, y, vx, vy } = n;

        if (isMouseDown) {
          // Gravity Well effect
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const dist = Math.hypot(dx, dy);
          vx += (dx / dist) * 0.5;
          vy += (dy / dist) * 0.5;
          vx *= 0.95; // Friction
          vy *= 0.95;
        } else {
          // Normal floating movement
          vx *= 0.99;
          vy *= 0.99;
          if (isTurbo) { vx *= 1.05; vy *= 1.05; }
        }

        x += vx;
        y += vy;

        // Bounce off walls
        if (x < 0 || x > window.innerWidth) vx *= -1;
        if (y < 0 || y > window.innerHeight) vy *= -1;

        return { ...n, x, y, vx, vy };
      }));
    }, 16);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearInterval(interval);
    };
  }, [isMouseDown, mousePos, isTurbo, spawnNode]);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-20 overflow-hidden bg-[#02040a]">
      {/* Background Glows */}
      <div className={`absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] transition-colors duration-1000 ${isTurbo ? 'bg-red-600/10' : 'bg-cyan-600/10'}`}></div>
      <div className={`absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[150px] transition-colors duration-1000 ${isTurbo ? 'bg-red-900/10' : 'bg-indigo-900/10'}`}></div>
      
      {/* SVG for Connections (Circuitry) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {nodes.map((n, i) => {
          return nodes.slice(i + 1).map(n2 => {
            const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
            if (dist < 200) {
              return (
                <line 
                  key={`${n.id}-${n2.id}`}
                  x1={n.x} y1={n.y} x2={n2.x} y2={n2.y}
                  stroke={isTurbo ? '#ef4444' : '#06b6d4'}
                  strokeWidth={1 - dist / 200}
                  strokeOpacity={1 - dist / 200}
                />
              );
            }
            return null;
          });
        })}
      </svg>

      {/* Nodes (The "Balloons") */}
      {nodes.map(node => (
        <div 
          key={node.id}
          className="absolute flex items-center justify-center rounded-full transition-transform duration-75 pointer-events-none"
          style={{ 
            left: node.x, 
            top: node.y, 
            width: node.size, 
            height: node.size,
            transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.7 : 1})`,
            background: isTurbo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(6, 182, 212, 0.1)',
            border: `1px solid ${isTurbo ? 'rgba(239, 68, 68, 0.4)' : 'rgba(6, 182, 212, 0.4)'}`,
            backdropFilter: 'blur(4px)',
            opacity: node.opacity,
            boxShadow: `0 0 ${isMouseDown ? '40px' : '15px'} ${isTurbo ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`
          }}
        >
          <span className="text-[8px] font-black uppercase text-center text-white/60 tracking-tighter select-none px-2">{node.text}</span>
        </div>
      ))}

      {/* The Gravity Well Visualizer */}
      {isMouseDown && (
        <div 
          className="absolute w-40 h-40 rounded-full border border-white/10 animate-ping pointer-events-none"
          style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
        ></div>
      )}

      {/* Lens Effect (The Matrix Underworld) */}
      <div 
        className="absolute w-64 h-64 rounded-full pointer-events-none z-30 opacity-40 border border-white/5"
        style={{ 
          left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          backdropFilter: 'contrast(1.5) brightness(1.2)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-[6px] font-mono text-cyan-400 overflow-hidden opacity-50 select-none">
          {`010111010101011010101010101010110101010101011101010101101010101010101011010101010101110101010110101010101010101101010101`}
        </div>
      </div>
    </div>
  );
};

export default BackgroundAnimation;
