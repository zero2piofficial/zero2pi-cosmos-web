import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Zap, Settings, Eye } from 'lucide-react';

interface MathFunction {
  id: string;
  name: string;
  equation: string;
  color: string;
  description: string;
  category: 'trigonometric' | 'exponential' | 'polynomial' | 'complex';
  animate: boolean;
  complexity: number;
}

interface ParticleSystem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface InteractiveDemo {
  id: string;
  title: string;
  description: string;
  component: JSX.Element;
  isActive: boolean;
}

export const EnhancedMathVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFunction, setCurrentFunction] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<ParticleSystem[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);

  const mathFunctions: MathFunction[] = [
    {
      id: 'sine-wave',
      name: 'Sine Wave',
      equation: 'f(x) = A·sin(ωx + φ)',
      color: '#8B5CF6',
      description: 'The fundamental wave that describes oscillatory motion',
      category: 'trigonometric',
      animate: true,
      complexity: 1
    },
    {
      id: 'complex-wave',
      name: 'Complex Wave',
      equation: 'f(x) = sin(x)·cos(x/2)',
      color: '#10B981',
      description: 'Multiple frequencies creating beautiful interference patterns',
      category: 'trigonometric',
      animate: true,
      complexity: 2
    },
    {
      id: 'exponential',
      name: 'Exponential Growth',
      equation: 'f(x) = e^(x/10)',
      color: '#F59E0B',
      description: 'The curve that governs growth and decay in nature',
      category: 'exponential',
      animate: false,
      complexity: 2
    },
    {
      id: 'polynomial',
      name: 'Polynomial Curve',
      equation: 'f(x) = x³ - 3x² + 2x',
      color: '#EF4444',
      description: 'Higher-order functions with multiple turning points',
      category: 'polynomial',
      animate: false,
      complexity: 3
    },
    {
      id: 'fourier',
      name: 'Fourier Series',
      equation: 'f(x) = Σ(sin(nx)/n)',
      color: '#8B5CF6',
      description: 'Decomposing complex signals into simple components',
      category: 'complex',
      animate: true,
      complexity: 4
    },
    {
      id: 'mandelbrot',
      name: 'Mandelbrot Set',
      equation: 'z(n+1) = z(n)² + c',
      color: '#7C3AED',
      description: 'Infinite complexity from a simple recursive formula',
      category: 'complex',
      animate: false,
      complexity: 5
    }
  ];

  const evaluateFunction = useCallback((x: number, functionId: string, t: number = 0): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    
    const width = canvas.width;
    const height = canvas.height;
    const isMobile = width < 768; // Mobile breakpoint
    
    if (isMobile) {
      // Mobile: Use responsive scaling
      const centerY = height / 2;
      const centerX = width / 2;
      const scaledX = (x - centerX) / (width * 0.1);
      
      switch (functionId) {
        case 'sine-wave':
          return centerY + amplitude * (height * 0.15) * Math.sin(frequency * scaledX + phase + t * 0.02);
        case 'complex-wave':
          return centerY + (height * 0.12) * Math.sin(scaledX + t * 0.02) * Math.cos(scaledX / 2);
        case 'exponential':
          return centerY + (height * 0.3) - Math.min(height * 0.6, Math.exp(scaledX / 3));
        case 'polynomial':
          const poly = scaledX * scaledX * scaledX - 3 * scaledX * scaledX + 2 * scaledX;
          return centerY - poly * (height * 0.02);
        case 'fourier':
          let sum = 0;
          for (let n = 1; n <= 10; n++) {
            sum += Math.sin(n * scaledX + t * 0.02) / n;
          }
          return centerY + sum * (height * 0.08);
        case 'mandelbrot':
          const real = scaledX / 20;
          const imag = 0;
          let zReal = 0, zImag = 0;
          let iterations = 0;
          
          while (zReal * zReal + zImag * zImag < 4 && iterations < 50) {
            const tempReal = zReal * zReal - zImag * zImag + real;
            zImag = 2 * zReal * zImag + imag;
            zReal = tempReal;
            iterations++;
          }
          
          return centerY + (iterations / 50) * (height * 0.3);
        default:
          return centerY;
      }
    } else {
      // Desktop: Use original hardcoded values
      const scaledX = (x - 400) / 50;
      
      switch (functionId) {
        case 'sine-wave':
          return 200 + amplitude * 80 * Math.sin(frequency * scaledX + phase + t * 0.02);
        case 'complex-wave':
          return 200 + 60 * Math.sin(scaledX + t * 0.02) * Math.cos(scaledX / 2);
        case 'exponential':
          return 350 - Math.min(300, Math.exp(scaledX / 3));
        case 'polynomial':
          const poly = scaledX * scaledX * scaledX - 3 * scaledX * scaledX + 2 * scaledX;
          return 200 - poly * 5;
        case 'fourier':
          let sum = 0;
          for (let n = 1; n <= 10; n++) {
            sum += Math.sin(n * scaledX + t * 0.02) / n;
          }
          return 200 + sum * 30;
        case 'mandelbrot':
          const real = scaledX / 20;
          const imag = 0;
          let zReal = 0, zImag = 0;
          let iterations = 0;
          
          while (zReal * zReal + zImag * zImag < 4 && iterations < 50) {
            const tempReal = zReal * zReal - zImag * zImag + real;
            zImag = 2 * zReal * zImag + imag;
            zReal = tempReal;
            iterations++;
          }
          
          return 200 + (iterations / 50) * 150;
        default:
          return 200;
      }
    }
  }, [amplitude, frequency, phase]);

  const drawFunction = useCallback((ctx: CanvasRenderingContext2D, func: MathFunction, t: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, func.color + '80');
    gradient.addColorStop(0.5, func.color);
    gradient.addColorStop(1, func.color + '80');
    
    // Draw function curve
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < width; x += 2) {
      const y = evaluateFunction(x, func.id, t);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = func.color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw animated particles along the curve
    if (func.animate) {
      for (let i = 0; i < 5; i++) {
        const x = (width / 5) * i + (t * 2) % (width / 5);
        const y = evaluateFunction(x, func.id, t);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = func.color;
        ctx.fill();
        
        // Add particle trail
        ctx.beginPath();
        ctx.arc(x - 5, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = func.color + '80';
        ctx.fill();
      }
    }
  }, [evaluateFunction]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.strokeStyle = '#8B5CF6' + '20';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Center axes
    ctx.strokeStyle = '#8B5CF6' + '40';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  }, []);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw current function
    const currentFunc = mathFunctions[currentFunction];
    drawFunction(ctx, currentFunc, time);
    
    // Draw secondary functions with lower opacity
    ctx.globalAlpha = 0.3;
    mathFunctions.forEach((func, index) => {
      if (index !== currentFunction && func.category === currentFunc.category) {
        drawFunction(ctx, func, time);
      }
    });
    ctx.globalAlpha = 1;
    
    // Update time
    if (isPlaying) {
      setTime(prev => prev + 1);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [currentFunction, time, isPlaying, drawGrid, drawFunction, mathFunctions]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleFunctionChange = (index: number) => {
    setCurrentFunction(index);
    setTime(0);
  };

  const resetAnimation = () => {
    setTime(0);
    setAmplitude(1);
    setFrequency(1);
    setPhase(0);
  };

  const interactiveDemos: InteractiveDemo[] = [
    {
      id: 'wave-interference',
      title: 'Wave Interference',
      description: 'Watch how waves combine to create complex patterns',
      component: (
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amplitude: {amplitude.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency: {frequency.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phase: {phase.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.1"
              value={phase}
              onChange={(e) => setPhase(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      ),
      isActive: true
    }
  ];

  return (
    <div className="relative w-full">
      {/* Main visualization canvas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background/90 to-muted/20 backdrop-blur-md border border-primary/10">
        <canvas
          ref={canvasRef}
          className="w-full h-96 block"
          style={{ background: 'transparent' }}
        />
        
        {/* Interactive overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Function info display */}
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 md:p-4 border border-primary/20">
            <h3 className="font-bold text-sm md:text-lg gradient-text mb-1 md:mb-2">
              {mathFunctions[currentFunction].name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-mono">
              {mathFunctions[currentFunction].equation}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs hidden md:block">
              {mathFunctions[currentFunction].description}
            </p>
            <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
              <div className="text-xs bg-primary/20 px-1 md:px-2 py-1 rounded">
                {mathFunctions[currentFunction].category}
              </div>
              <div className="text-xs bg-secondary/20 px-1 md:px-2 py-1 rounded">
                {mathFunctions[currentFunction].complexity}/5
              </div>
            </div>
          </div>
          
          {/* Control panel */}
          <div className={`absolute top-4 right-4 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <Card className="p-4 bg-background/90 backdrop-blur-sm border-primary/20">
              {currentFunction === 0 && interactiveDemos[0].component}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Function selector */}
      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        {mathFunctions.map((func, index) => (
          <Button
            key={func.id}
            variant={currentFunction === index ? "default" : "outline"}
            size="sm"
            onClick={() => handleFunctionChange(index)}
            className={`magnetic-element relative overflow-hidden group ${
              currentFunction === index 
                ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                : 'border-primary/30 hover:border-primary/50'
            }`}
            data-magnetic-strength="0.8"
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundColor: func.color }}
            />
            <span className="relative z-10 font-mono text-xs">
              {func.name}
            </span>
          </Button>
        ))}
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="magnetic-element glow-border"
          data-magnetic-strength="1.0"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetAnimation}
          className="magnetic-element glow-border"
          data-magnetic-strength="1.0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="magnetic-element glow-border"
          data-magnetic-strength="1.0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Mathematical insights */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        Mathematics is the language of the universe. I believe every function has a story to tell you, 
        like sine waves echo in sound and light, exponentials shape how things grow and change. Here, we turn 
        those abstract ideas into something you can see, feel, and explore.
          
        </p>
      </div>
    </div>
  );
}; 