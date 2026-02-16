
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Pulse {
  id: string;
  fromId: string;
  toId: string;
  progress: number;
}

const BackgroundAnimation: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const requestRef = useRef<number>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound synthesis functions
  const playSound = (type: 'add' | 'pop') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'add') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (type === 'add' ? 0.1 : 0.2));
    } catch (e) {}
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const explodeNode = (nodeId: string, currentNodes: Node[], chain: boolean = true) => {
    const node = currentNodes.find(n => n.id === nodeId);
    if (!node) return;

    playSound('pop');

    // Create explosion particles
    const newParticles: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
      id: `p-${Date.now()}-${nodeId}-${i}`,
      x: node.x,
      y: node.y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      life: 1.0,
      color: '#00f2ff'
    }));

    setParticles(prev => [...prev, ...newParticles]);

    if (chain) {
      // Find connected neighbors and trigger them with a small delay
      const neighbors = currentNodes.filter(n => 
        n.id !== nodeId && Math.hypot(n.x - node.x, n.y - node.y) < 200
      );
      
      neighbors.forEach((neighbor, i) => {
        setTimeout(() => {
          setNodes(prev => {
            if (prev.find(n => n.id === neighbor.id)) {
              explodeNode(neighbor.id, prev, false); // Only 1 level deep or distance based
              return prev.filter(n => n.id !== neighbor.id);
            }
            return prev;
          });
        }, 100 + i * 50);
      });
    }
  };

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) return;

    const x = e.clientX;
    const y = e.clientY;
    
    let hitNodeId: string | null = null;
    nodes.forEach(node => {
      const dist = Math.hypot(x - node.x, y - node.y);
      if (dist < 30) hitNodeId = node.id;
    });

    if (hitNodeId) {
      explodeNode(hitNodeId, nodes);
      setNodes(prev => prev.filter(n => n.id !== hitNodeId));
      return;
    }

    // Add new node
    playSound('add');
    const newNode: Node = {
      id: `node-${Date.now()}`,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 10,
      energy: 1.0
    };
    setNodes(prev => [...prev, newNode]);
  }, [nodes]);

  const animate = useCallback(() => {
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        let nx = node.x + node.vx;
        let ny = node.y + node.vy;

        if (nx < 0 || nx > window.innerWidth) node.vx *= -1;
        if (ny < 0 || ny > window.innerHeight) node.vy *= -1;

        const distToMouse = Math.hypot(mousePos.x - nx, mousePos.y - ny);
        if (distToMouse < 250) {
          nx += (mousePos.x - nx) * 0.02;
          ny += (mousePos.y - ny) * 0.02;
          node.energy = Math.min(node.energy + 0.05, 2.0);
        } else {
          node.energy = Math.max(node.energy - 0.01, 1.0);
        }

        return { ...node, x: nx, y: ny };
      });
    });

    setParticles(prev => 
      prev
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02 }))
        .filter(p => p.life > 0)
    );

    setPulses(prev => {
      const nextPulses = prev
        .map(p => ({ ...p, progress: p.progress + 0.03 }))
        .filter(p => p.progress < 1);
      
      if (Math.random() < 0.03 && nodes.length > 1) {
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        const neighbors = nodes.filter(n => n.id !== from.id && Math.hypot(n.x - from.x, n.y - from.y) < 250);
        if (neighbors.length > 0) {
          const to = neighbors[Math.floor(Math.random() * neighbors.length)];
          nextPulses.push({ id: `p-${Date.now()}`, fromId: from.id, toId: to.id, progress: 0 });
        }
      }
      return nextPulses;
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [mousePos, nodes.length]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleGlobalClick);
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleGlobalClick);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [handleMouseMove, handleGlobalClick, animate]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#02040a] pointer-events-none">
      {/* Mouse Aura */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full opacity-5 pointer-events-none transition-transform duration-150 ease-out"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #00f2ff 0%, transparent 70%)'
        }}
      />

      {/* SVG Canvas for lines and pulses */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((node, i) => (
          nodes.slice(i + 1).map(target => {
            const dist = Math.hypot(node.x - target.x, node.y - target.y);
            if (dist < 250) {
              return (
                <line 
                  key={`${node.id}-${target.id}`}
                  x1={node.x} y1={node.y} x2={target.x} y2={target.y} 
                  stroke="#00f2ff" 
                  strokeWidth={0.5 + (1 - dist / 250) * 1.5}
                  strokeOpacity={(1 - dist / 250) * 0.3} 
                />
              );
            }
            return null;
          })
        ))}
        {pulses.map(pulse => {
          const from = nodes.find(n => n.id === pulse.fromId);
          const to = nodes.find(n => n.id === pulse.toId);
          if (!from || !to) return null;
          const px = from.x + (to.x - from.x) * pulse.progress;
          const py = from.y + (to.y - from.y) * pulse.progress;
          return (
            <circle key={pulse.id} cx={px} cy={py} r="3" fill="#00f2ff" style={{ filter: 'drop-shadow(0 0 8px #00f2ff)' }} />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => (
        <div 
          key={node.id}
          className="absolute rounded-full transition-transform duration-300"
          style={{ 
            left: node.x, 
            top: node.y, 
            width: node.size * node.energy, 
            height: node.size * node.energy,
            background: '#ffffff',
            boxShadow: `0 0 ${10 * node.energy}px #00f2ff, 0 0 ${20 * node.energy}px #00f2ff`,
            transform: `translate(-50%, -50%) scale(${node.energy})`,
            border: '2px solid #00f2ff',
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
        />
      ))}

      {/* Explosion Particles */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: 4,
            height: 4,
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            opacity: p.life,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
