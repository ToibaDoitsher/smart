
import React, { useState, useEffect, useCallback } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const BackgroundAnimation: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    // Prevent adding nodes when clicking on interactive UI elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) return;

    const x = e.clientX;
    const y = e.clientY;

    setNodes(prevNodes => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        x: (x / window.innerWidth) * 100,
        y: (y / window.innerHeight) * 100
      };

      // Create a line connecting to the nearest neighbor
      if (prevNodes.length > 0) {
        let nearestNode = prevNodes[0];
        let minDist = Infinity;

        prevNodes.forEach(node => {
          const nx = (node.x / 100) * window.innerWidth;
          const ny = (node.y / 100) * window.innerHeight;
          const dist = Math.hypot(x - nx, y - ny);
          if (dist < minDist) {
            minDist = dist;
            nearestNode = node;
          }
        });

        const newLine: Line = {
          x1: x,
          y1: y,
          x2: (nearestNode.x / 100) * window.innerWidth,
          y2: (nearestNode.y / 100) * window.innerHeight
        };

        setLines(prevLines => [...prevLines, newLine]);
      }

      return [...prevNodes, newNode];
    });
  }, []);

  useEffect(() => {
    // Background starts empty as requested.
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleGlobalClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [handleMouseMove, handleGlobalClick]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#02040a] pointer-events-none">
      {/* Interactive Mouse Glow Aura */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none transition-transform duration-75 ease-out"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #00f2ff 0%, transparent 70%)'
        }}
      />

      {/* SVG Layer for Links */}
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {lines.map((line, i) => (
          <line 
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
            stroke="#00f2ff" 
            strokeWidth="1.5" 
            strokeOpacity="0.3"
            className="animate-fadeIn"
          />
        ))}
      </svg>

      {/* Nodes (Circles) Layer */}
      {nodes.map(node => (
        <div 
          key={node.id}
          className="absolute rounded-full animate-pulse"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`, 
            width: 10, 
            height: 10,
            background: '#ffffff',
            boxShadow: '0 0 15px #00f2ff, 0 0 30px #00f2ff',
            transform: 'translate(-50%, -50%)',
            border: '2px solid #00f2ff'
          }}
        />
      ))}

      {/* Empty State Instruction (Optional) */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
           <p className="text-white/10 text-[9px] font-black uppercase tracking-[1em] animate-pulse">
             Click to initialize architecture
           </p>
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default BackgroundAnimation;
