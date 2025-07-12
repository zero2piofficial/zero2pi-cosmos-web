import { useEffect, useState, useRef } from 'react';

interface CursorTrail {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  symbol: string;
  timestamp: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  lifetime: number;
  maxLifetime: number;
}

interface MagneticElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strength: number;
}

export const InteractiveCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<CursorTrail[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [magneticElements, setMagneticElements] = useState<MagneticElement[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  
  const trailIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  const mathSymbols = ['π', '∑', '∫', '∞', '√', '∆', 'θ', 'λ', '∂', '∇', 'α', 'β', 'γ', 'φ', 'ψ', '≈', '≠', '≤', '≥', '∈', 'e', 'i', 'ℏ', '∮', '∂', '∇', '⊕', '⊗', '⊙', '∝'];

  // Update cursor position and create trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      setCursorPos({ x: e.clientX, y: e.clientY });
      setLastMoveTime(now);
      setIsMoving(true);

      // Create trail point
      if (now - lastMoveTime > 50) { // Throttle trail creation
        const newTrail: CursorTrail = {
          id: trailIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
          scale: 1,
          rotation: Math.random() * 360,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          timestamp: now,
        };

        setCursorTrail(prev => [...prev.slice(-15), newTrail]);
      }

      // Create particles on movement
      if (Math.random() < 0.3) {
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size: Math.random() * 3 + 1,
          opacity: 1,
          color: Math.random() > 0.5 ? '#8B5CF6' : '#10B981',
          lifetime: 0,
          maxLifetime: 1000 + Math.random() * 1000,
        };

        setParticles(prev => [...prev.slice(-20), newParticle]);
      }
    };

    const handleMouseStop = () => {
      setIsMoving(false);
    };

    let stopTimeout: NodeJS.Timeout;
    const handleMouseMoveWithStop = (e: MouseEvent) => {
      handleMouseMove(e);
      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(handleMouseStop, 100);
    };

    window.addEventListener('mousemove', handleMouseMoveWithStop);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveWithStop);
      clearTimeout(stopTimeout);
    };
  }, [lastMoveTime]);

  // Update trail animation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setCursorTrail(prev => 
        prev.map(trail => ({
          ...trail,
          opacity: Math.max(0, 1 - (now - trail.timestamp) / 1000),
          scale: Math.max(0.1, 1 - (now - trail.timestamp) / 1500),
          rotation: trail.rotation + 2,
        })).filter(trail => trail.opacity > 0.1)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Update particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
          lifetime: particle.lifetime + 16,
          opacity: Math.max(0, 1 - particle.lifetime / particle.maxLifetime),
        })).filter(particle => particle.lifetime < particle.maxLifetime)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Detect magnetic elements
  useEffect(() => {
    const updateMagneticElements = () => {
      const elements = document.querySelectorAll('.magnetic-element');
      const newMagneticElements: MagneticElement[] = Array.from(elements).map((el, index) => {
        const rect = el.getBoundingClientRect();
        return {
          id: `magnetic-${index}`,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          strength: parseFloat(el.getAttribute('data-magnetic-strength') || '1'),
        };
      });
      setMagneticElements(newMagneticElements);
    };

    updateMagneticElements();
    window.addEventListener('resize', updateMagneticElements);
    window.addEventListener('scroll', updateMagneticElements);

    return () => {
      window.removeEventListener('resize', updateMagneticElements);
      window.removeEventListener('scroll', updateMagneticElements);
    };
  }, []);

  // Calculate magnetic effect on cursor
  const getMagneticOffset = () => {
    let totalOffsetX = 0;
    let totalOffsetY = 0;

    magneticElements.forEach(element => {
      const distance = Math.sqrt(
        Math.pow(cursorPos.x - element.x, 2) + 
        Math.pow(cursorPos.y - element.y, 2)
      );
      
      const maxDistance = Math.max(element.width, element.height) * 0.8;
      
      if (distance < maxDistance) {
        const strength = (1 - distance / maxDistance) * element.strength * 0.3;
        const angle = Math.atan2(element.y - cursorPos.y, element.x - cursorPos.x);
        totalOffsetX += Math.cos(angle) * strength * 20;
        totalOffsetY += Math.sin(angle) * strength * 20;
      }
    });

    return { x: totalOffsetX, y: totalOffsetY };
  };

  const magneticOffset = getMagneticOffset();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: cursorPos.x - 12 + magneticOffset.x,
          top: cursorPos.y - 12 + magneticOffset.y,
          transform: `scale(${isMoving ? 1.5 : 1}) rotate(${isMoving ? 45 : 0}deg)`,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg shadow-primary/50 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full animate-ping opacity-20" />
      </div>

      {/* Cursor trail */}
      {cursorTrail.map(trail => (
        <div
          key={trail.id}
          className="fixed text-primary/70 font-mono font-bold pointer-events-none select-none"
          style={{
            left: trail.x - 10,
            top: trail.y - 10,
            opacity: trail.opacity,
            transform: `scale(${trail.scale}) rotate(${trail.rotation}deg)`,
            fontSize: `${0.8 + trail.scale * 0.4}rem`,
            filter: `blur(${(1 - trail.scale) * 2}px)`,
          }}
        >
          {trail.symbol}
        </div>
      ))}

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}





      {/* Equation that follows cursor */}
      {isMoving && (
        <div
          className="fixed text-primary/60 font-mono text-sm pointer-events-none select-none transition-opacity duration-300"
          style={{
            left: cursorPos.x + 20,
            top: cursorPos.y - 30,
            opacity: isMoving ? 1 : 0,
          }}
        >
          f(x,y) = {Math.floor(cursorPos.x)}, {Math.floor(cursorPos.y)}
        </div>
      )}
    </div>
  );
}; 