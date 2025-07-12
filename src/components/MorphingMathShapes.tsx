import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shuffle, Zap, Sparkles, RotateCw, Pause, Play } from 'lucide-react';

interface MorphingShape {
  id: string;
  type: 'circle' | 'spiral' | 'lemniscate' | 'rose' | 'hyperbola' | 'cardioid';
  centerX: number;
  centerY: number;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
  morphSpeed: number;
  morphPhase: number;
  particles: ShapeParticle[];
}

interface ShapeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; opacity: number; timestamp: number }[];
}

interface CursorInfluence {
  x: number;
  y: number;
  strength: number;
  radius: number;
}

export const MorphingMathShapes = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [shapes, setShapes] = useState<MorphingShape[]>([]);
  const [cursorInfluence, setCursorInfluence] = useState<CursorInfluence>({ x: 0, y: 0, strength: 0, radius: 100 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [showParticles, setShowParticles] = useState(true);
  const [morphingSpeed, setMorphingSpeed] = useState(1);
  const [interactionMode, setInteractionMode] = useState<'attract' | 'repel' | 'morph'>('attract');
  const particleIdRef = useRef(0);

  const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16'];

  const shapeTypes: MorphingShape['type'][] = ['circle', 'spiral', 'lemniscate', 'rose', 'hyperbola', 'cardioid'];

  // Mathematical shape equations
  const getShapePoints = useCallback((shape: MorphingShape, t: number, cursorInfluence: CursorInfluence): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    const numPoints = 200;
    const { centerX, centerY, size, rotation, morphPhase } = shape;
    
    // Calculate cursor influence
    const distanceToCursor = Math.sqrt((centerX - cursorInfluence.x) ** 2 + (centerY - cursorInfluence.y) ** 2);
    const influence = Math.max(0, 1 - distanceToCursor / cursorInfluence.radius) * cursorInfluence.strength;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      let x = 0, y = 0;
      
      switch (shape.type) {
        case 'circle':
          x = size * Math.cos(angle + rotation + t * 0.01);
          y = size * Math.sin(angle + rotation + t * 0.01);
          break;
          
        case 'spiral':
          const spiralRadius = size * (1 + 0.1 * angle);
          x = spiralRadius * Math.cos(angle + rotation + t * 0.02);
          y = spiralRadius * Math.sin(angle + rotation + t * 0.02);
          break;
          
        case 'lemniscate':
          const lemniscateScale = size * Math.cos(2 * angle);
          x = lemniscateScale * Math.cos(angle + rotation + t * 0.015);
          y = lemniscateScale * Math.sin(2 * angle + morphPhase + t * 0.015);
          break;
          
        case 'rose':
          const k = 3 + Math.sin(t * 0.01) * 2;
          const roseRadius = size * Math.cos(k * angle);
          x = roseRadius * Math.cos(angle + rotation + t * 0.01);
          y = roseRadius * Math.sin(angle + rotation + t * 0.01);
          break;
          
        case 'hyperbola':
          const hyperbolaT = (angle - Math.PI) * 2;
          x = size * Math.cosh(hyperbolaT * 0.1) * Math.cos(rotation + t * 0.01);
          y = size * Math.sinh(hyperbolaT * 0.1) * Math.sin(rotation + t * 0.01);
          break;
          
        case 'cardioid':
          const cardioidRadius = size * (1 + Math.cos(angle + morphPhase + t * 0.01));
          x = cardioidRadius * Math.cos(angle + rotation);
          y = cardioidRadius * Math.sin(angle + rotation);
          break;
      }
      
      // Apply cursor influence
      if (influence > 0) {
        const angleToCenter = Math.atan2(y, x);
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        
        switch (interactionMode) {
          case 'attract':
            x += Math.cos(angleToCenter) * influence * 20;
            y += Math.sin(angleToCenter) * influence * 20;
            break;
          case 'repel':
            x -= Math.cos(angleToCenter) * influence * 30;
            y -= Math.sin(angleToCenter) * influence * 30;
            break;
          case 'morph':
            x += Math.sin(angleToCenter + t * 0.02) * influence * 15;
            y += Math.cos(angleToCenter + t * 0.02) * influence * 15;
            break;
        }
      }
      
      points.push({
        x: centerX + x,
        y: centerY + y
      });
    }
    
    return points;
  }, [interactionMode]);

  // Create particles along shape edges
  const createParticlesForShape = useCallback((shape: MorphingShape, points: { x: number; y: number }[]): ShapeParticle[] => {
    if (!showParticles) return [];
    
    const particles: ShapeParticle[] = [];
    
    for (let i = 0; i < points.length; i += 10) {
      if (Math.random() < 0.3) {
        const point = points[i];
        const nextPoint = points[(i + 1) % points.length];
        
        particles.push({
          id: particleIdRef.current++,
          x: point.x,
          y: point.y,
          vx: (nextPoint.x - point.x) * 0.01 + (Math.random() - 0.5) * 2,
          vy: (nextPoint.y - point.y) * 0.01 + (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: 1,
          color: shape.color,
          life: 0,
          maxLife: 2000 + Math.random() * 1000,
          trail: []
        });
      }
    }
    
    return particles;
  }, [showParticles]);

  // Draw shape on canvas
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: MorphingShape, t: number) => {
    const points = getShapePoints(shape, t, cursorInfluence);
    
    if (points.length === 0) return;
    
    // Draw shape outline
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    
    // Create gradient
    const gradient = ctx.createRadialGradient(
      shape.centerX, shape.centerY, 0,
      shape.centerX, shape.centerY, shape.size
    );
    gradient.addColorStop(0, shape.color + '80');
    gradient.addColorStop(1, shape.color + '20');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = shape.opacity;
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = shape.color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.globalAlpha = 1;
    
    // Create and draw particles
    const newParticles = createParticlesForShape(shape, points);
    shape.particles.push(...newParticles);
    
    // Draw particles
    shape.particles.forEach(particle => {
      if (particle.life > particle.maxLife) return;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      
      // Draw particle trail
      if (particle.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        for (let i = 1; i < particle.trail.length; i++) {
          ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
        }
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.stroke();
      }
    });
    
    ctx.globalAlpha = 1;
  }, [getShapePoints, cursorInfluence, createParticlesForShape]);

  // Update particles
  const updateParticles = useCallback(() => {
    setShapes(prevShapes => 
      prevShapes.map(shape => ({
        ...shape,
        particles: shape.particles.map(particle => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Update velocity with some physics
          particle.vy += 0.05; // gravity
          particle.vx *= 0.99; // air resistance
          particle.vy *= 0.99;
          
          // Update trail
          particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity, timestamp: Date.now() });
          if (particle.trail.length > 10) {
            particle.trail.shift();
          }
          
          // Update life
          particle.life += 16;
          particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);
          
          return particle;
        }).filter(particle => particle.life < particle.maxLife)
      }))
    );
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Clear canvas with subtle background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw shapes
      shapes.forEach(shape => {
        drawShape(ctx, shape, time);
      });
      
      // Update particles
      updateParticles();
      
      // Update time
      if (isPlaying) {
        setTime(prev => prev + morphingSpeed);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shapes, time, isPlaying, morphingSpeed, drawShape, updateParticles]);

  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCursorInfluence(prev => ({
        ...prev,
        x,
        y,
        strength: 1
      }));
    };
    
    const handleMouseLeave = () => {
      setCursorInfluence(prev => ({ ...prev, strength: 0 }));
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Initialize shapes
  useEffect(() => {
    if (shapes.length === 0) {
      const initialShapes: MorphingShape[] = [];
      
      for (let i = 0; i < 5; i++) {
        initialShapes.push({
          id: `shape-${i}`,
          type: shapeTypes[i % shapeTypes.length],
          centerX: Math.random() * 800 + 100,
          centerY: Math.random() * 400 + 100,
          size: Math.random() * 60 + 40,
          rotation: Math.random() * Math.PI * 2,
          color: colors[i % colors.length],
          opacity: 0.8,
          morphSpeed: Math.random() * 0.5 + 0.5,
          morphPhase: Math.random() * Math.PI * 2,
          particles: []
        });
      }
      
      setShapes(initialShapes);
    }
  }, []);

  const regenerateShapes = () => {
    const newShapes: MorphingShape[] = [];
    
    for (let i = 0; i < 5; i++) {
      newShapes.push({
        id: `shape-${Date.now()}-${i}`,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        centerX: Math.random() * 800 + 100,
        centerY: Math.random() * 400 + 100,
        size: Math.random() * 80 + 30,
        rotation: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.8,
        morphSpeed: Math.random() * 0.5 + 0.5,
        morphPhase: Math.random() * Math.PI * 2,
        particles: []
      });
    }
    
    setShapes(newShapes);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center justify-center gap-3">
          <Sparkles className="h-7 w-7" />
          Morphing Mathematical Shapes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Move your cursor to interact with the shapes and 
          see how they respond to your presence through complex mathematical transformations.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="magnetic-element"
          data-magnetic-strength="0.8"
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={regenerateShapes}
          className="magnetic-element"
          data-magnetic-strength="0.8"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          New Shapes
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowParticles(!showParticles)}
          className={`magnetic-element ${showParticles ? 'bg-primary/20' : ''}`}
          data-magnetic-strength="0.8"
        >
          <Zap className="h-4 w-4 mr-2" />
          Particles
        </Button>
        
        <select
          value={interactionMode}
          onChange={(e) => setInteractionMode(e.target.value as 'attract' | 'repel' | 'morph')}
          className="px-3 py-2 bg-background border border-primary/20 rounded-md text-sm"
        >
          <option value="attract">Attract</option>
          <option value="repel">Repel</option>
          <option value="morph">Morph</option>
        </select>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Speed:</span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={morphingSpeed}
            onChange={(e) => setMorphingSpeed(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      {/* Canvas */}
      <Card className="p-6 magnetic-element" data-magnetic-strength="1.5">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-gradient-to-br from-background to-muted/10 rounded-lg border border-primary/10 cursor-crosshair"
        />
      </Card>

      {/* Shape Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shapeTypes.map((shapeType, index) => (
          <Card key={shapeType} className="p-4 magnetic-element" data-magnetic-strength="0.8">
            <h4 className="font-semibold mb-2 capitalize">{shapeType}</h4>
            <p className="text-sm text-muted-foreground">
              {shapeType === 'circle' && 'Perfect symmetry in all directions'}
              {shapeType === 'spiral' && 'Infinite growth following the golden ratio'}
              {shapeType === 'lemniscate' && 'The infinity symbol - endless loops'}
              {shapeType === 'rose' && 'Petals that bloom in mathematical harmony'}
              {shapeType === 'hyperbola' && 'Curves that approach but never touch'}
              {shapeType === 'cardioid' && 'Heart-shaped curves from cycloid motion'}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}; 