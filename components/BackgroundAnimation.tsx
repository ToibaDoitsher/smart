
import React, { useState, useEffect, useCallback, useRef } from 'react';

type GearType = 'solid' | 'spoked' | 'hollow' | 'cross' | 'complex';

interface Node {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  overdrive: number;
  type: GearType;
  color: string;
  isInitializing: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const COLOR_PALETTE = ['#00f2ff', '#ffcc00', '#ff00ff', '#00ff99', '#ffffff'];
const CONNECTION_DIST = 180;
const MOUSE_ATTRACTION_DIST = 150; 
const ATTRACTION_FORCE = 0.0006; 
const ACTIVE_FRICTION = 0.98;
const SETTLE_FRICTION = 0.92; // Higher friction to make them stop when mouse leaves
const BASE_ROTATION_SPEED_LIMIT = 0.8; 

const GearIcon: React.FC<{ node: Node }> = ({ node }) => {
  const { size, color, rotation, overdrive, type, isInitializing, z } = node;
  const teeth = type === 'complex' ? 12 : 8;
  const innerRadius = size * 0.3;
  const outerRadius = size * 0.5;
  const toothWidth = size * 0.25;
  
  const baseOpacity = z === 0 ? 0.2 : z === 2 ? 0.6 : 0.8;
  const displayColor = overdrive > 0.5 ? '#ffffff' : color;
  const blur = z === 0 ? 'blur(2px)' : 'none';

  return (
    <svg 
      width={size * 2.5} 
      height={size * 2.5} 
      viewBox={`0 0 ${size * 2.5} ${size * 2.5}`} 
      style={{ 
        transform: `rotate(${rotation}deg) scale(${1 + overdrive * 0.15})`, 
        transition: 'transform 0.05s linear',
        filter: `${blur} drop-shadow(0 0 ${overdrive * 12}px ${color})`,
        opacity: isInitializing < 1 ? isInitializing : baseOpacity
      }}
    >
      <defs>
        <linearGradient id={`grad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={displayColor} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <g transform={`translate(${size * 1.25}, ${size * 1.25})`}>
        <circle r={innerRadius * 1.2} fill="none" stroke={displayColor} strokeWidth={isInitializing < 1 ? 1 : 2} strokeDasharray={isInitializing < 1 ? "2,2" : "none"} />
        
        {type === 'spoked' && (
          <g>
            {[0, 120, 240].map(deg => (
              <rect key={deg} x="-1" y={-innerRadius * 1.3} width="2" height={innerRadius * 1.3} fill={displayColor} transform={`rotate(${deg})`} />
            ))}
          </g>
        )}
        
        {type === 'complex' && (
          <circle r={innerRadius * 0.6} fill="none" stroke={displayColor} strokeWidth="1" />
        )}

        {Array.from({ length: teeth }).map((_, i) => (
          <path
            key={i}
            d={`M -${toothWidth / 2} -${outerRadius} L ${toothWidth / 2} -${outerRadius} L ${toothWidth / 4} -${innerRadius} L -${toothWidth / 4} -${innerRadius} Z`}
            fill={isInitializing < 1 ? 'none' : `url(#grad-${node.id})`}
            stroke={displayColor}
            strokeWidth={1}
            transform={`rotate(${(i * 360) / teeth})`}
          />
        ))}
      </g>
    </svg>
  );
};

const BackgroundAnimation: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const requestRef = useRef<number>(null);

  useEffect(() => {
    setNodes([]);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const explodeNode = useCallback((nodeId: string, currentNodes: Node[], alreadyExploded: Set<string> = new Set()) => {
    if (alreadyExploded.has(nodeId)) return;
    alreadyExploded.add(nodeId);

    const node = currentNodes.find(n => n.id === nodeId);
    if (!node) return;

    const newParticles: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `p-${Date.now()}-${nodeId}-${i}-${Math.random()}`,
      x: node.x,
      y: node.y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1.0,
      color: node.color,
      size: 2 + Math.random() * 4
    }));

    setParticles(prev => [...prev, ...newParticles]);

    const neighbors = currentNodes.filter(other => {
      if (other.id === nodeId || alreadyExploded.has(other.id)) return false;
      const d = Math.hypot(node.x - other.x, node.y - other.y);
      return d < CONNECTION_DIST;
    });

    setNodes(prev => prev.filter(n => n.id !== nodeId));

    neighbors.forEach((neighbor, idx) => {
      setTimeout(() => {
        setNodes(latestNodes => {
          explodeNode(neighbor.id, latestNodes, alreadyExploded);
          return latestNodes;
        });
      }, 60 + idx * 30);
    });
  }, []);

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) return;

    const x = e.clientX;
    const y = e.clientY;
    
    let hitNodeId: string | null = null;
    nodes.forEach(node => {
      const dist = Math.hypot(x - node.x, y - node.y);
      if (dist < node.size * 1.5) {
        hitNodeId = node.id;
      }
    });

    if (hitNodeId) {
      explodeNode(hitNodeId, nodes);
      return;
    }

    const types: GearType[] = ['solid', 'spoked', 'hollow', 'cross', 'complex'];
    const newNode: Node = {
      id: `node-${Date.now()}-${Math.random()}`,
      x, y,
      z: 1,
      vx: 0,
      vy: 0,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * BASE_ROTATION_SPEED_LIMIT,
      overdrive: 0,
      type: types[Math.floor(Math.random() * types.length)],
      color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
      isInitializing: 0
    };
    setNodes(prev => [...prev, newNode]);
  }, [nodes, explodeNode]);

  const animate = useCallback(() => {
    setNodes(prevNodes => {
      const updated = prevNodes.map(node => {
        let nvx = node.vx;
        let nvy = node.vy;

        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distToMouse = Math.hypot(dx, dy);

        // Magnetic pull only when very close
        if (distToMouse < MOUSE_ATTRACTION_DIST) {
          nvx += dx * ATTRACTION_FORCE;
          nvy += dy * ATTRACTION_FORCE;
          nvx *= ACTIVE_FRICTION;
          nvy *= ACTIVE_FRICTION;
        } else {
          // Shed momentum quickly so it stays in place
          nvx *= SETTLE_FRICTION;
          nvy *= SETTLE_FRICTION;
          
          // Tiny drift so they don't look completely frozen
          nvx += (Math.random() - 0.5) * 0.005;
          nvy += (Math.random() - 0.5) * 0.005;
        }

        let nx = node.x + nvx;
        let ny = node.y + nvy;

        // Bouncing logic (if they ever hit the edge)
        if (nx < 0 || nx > window.innerWidth) {
            nvx *= -1;
            nx = node.x + nvx;
        }
        if (ny < 0 || ny > window.innerHeight) {
            nvy *= -1;
            ny = node.y + nvy;
        }

        let spinMod = 1;
        if (distToMouse < 100) {
          spinMod = 1.8; 
          node.overdrive = Math.min(node.overdrive + 0.05, 1);
        } else {
          node.overdrive = Math.max(node.overdrive - 0.015, 0);
        }

        const isInitializing = Math.min(node.isInitializing + 0.04, 1);

        return { 
          ...node, 
          x: nx, 
          y: ny,
          vx: nvx,
          vy: nvy,
          rotation: node.rotation + (node.rotationSpeed * spinMod),
          isInitializing
        };
      });

      // Meshing torque synchronization
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const a = updated[i];
          const b = updated[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const meshDist = (a.size + b.size) * 0.7;
          if (d < meshDist) {
            const avgSpeed = (Math.abs(a.rotationSpeed) + Math.abs(b.rotationSpeed)) / 2;
            updated[i].rotationSpeed = a.rotationSpeed > 0 ? avgSpeed : -avgSpeed;
            updated[j].rotationSpeed = a.rotationSpeed > 0 ? -avgSpeed : avgSpeed;
          }
        }
      }

      return updated;
    });

    setParticles(prev => prev.map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life - 0.02
    })).filter(p => p.life > 0));

    requestRef.current = requestAnimationFrame(animate);
  }, [mousePos]);

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
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, #00f2ff 1px, transparent 0)',
             backgroundSize: '60px 60px'
           }} 
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => (
          nodes.slice(i + 1).map(target => {
            const d = Math.hypot(node.x - target.x, node.y - target.y);
            if (d < CONNECTION_DIST) {
              const opacity = (1 - d / CONNECTION_DIST) * 0.4;
              return (
                <g key={`${node.id}-${target.id}`}>
                  <line 
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y} 
                    stroke={node.color} strokeWidth="1" 
                    strokeOpacity={opacity}
                    strokeDasharray="4,2"
                  />
                  <line 
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y} 
                    stroke="#ffffff" strokeWidth="0.5" 
                    strokeOpacity={opacity * 0.5}
                  />
                </g>
              );
            }
            return null;
          })
        ))}
      </svg>

      <div className="absolute inset-0">
        {nodes.map(node => (
          <div 
            key={node.id}
            className="absolute"
            style={{ 
              left: node.x, 
              top: node.y, 
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <GearIcon node={node} />
          </div>
        ))}
      </div>

      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute rounded-full shadow-[0_0_10px_currentColor]"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            color: p.color,
            opacity: p.life,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
