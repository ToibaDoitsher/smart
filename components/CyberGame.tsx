
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface GameState {
  playerX: number;
  score: number;
  items: GameItem[];
  isGameOver: boolean;
  gameStarted: boolean;
}

interface GameItem {
  id: number;
  x: number;
  y: number;
  type: 'node' | 'bug';
}

const CyberGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [state, setState] = useState<GameState>({
    playerX: 50,
    score: 0,
    items: [],
    isGameOver: false,
    gameStarted: false,
  });

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnItem = useCallback(() => {
    const newItem: GameItem = {
      id: Math.random(),
      x: Math.random() * 90 + 5,
      y: -10,
      type: Math.random() > 0.3 ? 'node' : 'bug',
    };
    return newItem;
  }, []);

  const update = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;

      setState(prev => {
        if (prev.isGameOver || !prev.gameStarted) return prev;

        // Move items
        let newItems = prev.items.map(item => ({ ...item, y: item.y + 0.5 * (1 + prev.score / 10) }));
        
        // Spawn items
        if (Math.random() < 0.05) {
          newItems.push(spawnItem());
        }

        // Collision detection & filter off-screen
        let scoreBoost = 0;
        let hitBug = false;

        const filteredItems = newItems.filter(item => {
          const hit = item.y > 85 && item.y < 95 && Math.abs(item.x - prev.playerX) < 10;
          if (hit) {
            if (item.type === 'node') scoreBoost += 1;
            else hitBug = true;
            return false;
          }
          return item.y < 100;
        });

        if (hitBug) {
          return { ...prev, isGameOver: true, items: [] };
        }

        return {
          ...prev,
          score: prev.score + scoreBoost,
          items: filteredItems,
        };
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(update);
  }, [spawnItem]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || state.isGameOver) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setState(prev => ({ ...prev, playerX: Math.max(5, Math.min(95, x)) }));
  };

  const startGame = () => {
    setState({
      playerX: 50,
      score: 0,
      items: [],
      isGameOver: false,
      gameStarted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center p-4 font-mono select-none overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#06b6d4_0%,_transparent_70%)] animate-pulse"></div>
      
      <div 
        ref={containerRef}
        className="w-full max-w-2xl aspect-[3/4] glass border-cyan-500/30 relative overflow-hidden rounded-[2rem] cursor-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {!state.gameStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20">
            <h2 className="text-4xl md:text-6xl font-black text-cyan-400 mb-6 tracking-tighter glow-text">CYBER RUNNER</h2>
            <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-sm">
              אספו את הצמתים הכחולים (Nodes) והתחמקו מהבאגים האדומים (Bugs). <br/>
              ככל שהציון עולה - המערכת רצה מהר יותר!
            </p>
            <button 
              onClick={startGame}
              className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-500 transition-all hover:scale-105 active:scale-95"
            >
              התחל סימולציה
            </button>
            <button onClick={onClose} className="mt-6 text-gray-500 hover:text-white text-xs uppercase tracking-widest">חזרה לאתר</button>
          </div>
        ) : state.isGameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20 bg-black/80 backdrop-blur-md">
            <h2 className="text-6xl font-black text-red-500 mb-2">SYSTEM ERROR</h2>
            <p className="text-white text-2xl font-black mb-8">Score: {state.score}</p>
            <div className="flex gap-4">
              <button onClick={startGame} className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-cyan-500 transition-all">נסה שוב</button>
              <button onClick={onClose} className="px-10 py-4 glass border border-white/10 text-white font-black rounded-xl hover:bg-red-500/20 transition-all">סגור</button>
            </div>
          </div>
        ) : (
          <>
            {/* HUD */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              <div className="text-cyan-400 font-black text-xl">SCORE: {state.score}</div>
              <button onClick={onClose} className="text-white/20 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* Player */}
            <div 
              className="absolute bottom-10 w-12 h-12 transition-all duration-75"
              style={{ left: `${state.playerX}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-full h-full bg-cyan-400 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse flex items-center justify-center">
                <i className="fa-solid fa-robot text-black text-xl"></i>
              </div>
            </div>

            {/* Items */}
            {state.items.map(item => (
              <div 
                key={item.id}
                className="absolute w-8 h-8 flex items-center justify-center transition-all duration-75"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translateX(-50%)' }}
              >
                {item.type === 'node' ? (
                  <div className="w-4 h-4 bg-cyan-500 rounded-full animate-ping"></div>
                ) : (
                  <div className="w-6 h-6 text-red-500"><i className="fa-solid fa-bug animate-bounce"></i></div>
                )}
              </div>
            ))}
            
            {/* Speed Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
              <div className="absolute top-0 left-2/4 w-px h-full bg-white/5"></div>
              <div className="absolute top-0 left-3/4 w-px h-full bg-white/5"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CyberGame;
