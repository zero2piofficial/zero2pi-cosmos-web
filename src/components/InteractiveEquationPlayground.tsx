import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Trash2, Download, Share2, Sparkles, Calculator } from 'lucide-react';

interface Expression {
  id: string;
  equation: string;
  color: string;
  visible: boolean;
  error?: string;
}

interface PlotPoint {
  x: number;
  y: number;
}

export const InteractiveEquationPlayground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expressions, setExpressions] = useState<Expression[]>([
    { id: '1', equation: 'sin(x)', color: '#8B5CF6', visible: true },
    { id: '2', equation: 'cos(x)', color: '#10B981', visible: true },
  ]);
  const [currentEquation, setCurrentEquation] = useState('');
  const [range, setRange] = useState({ min: -10, max: 10 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [precision, setPrecision] = useState(100);

  const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5A3C', '#EC4899', '#6B7280'];

  // Safe evaluation function for mathematical expressions
  const safeEval = useCallback((expression: string, x: number, t: number = 0): number => {
    try {
      // Replace mathematical functions and constants - be more careful with replacements
      let expr = expression.toLowerCase()
        // Replace constants first
        .replace(/\bpi\b/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        // Replace functions - use word boundaries to avoid conflicts
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\blog\b/g, 'Math.log')
        .replace(/\bln\b/g, 'Math.log')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs')
        .replace(/\bexp\b/g, 'Math.exp')
        // Handle power operator
        .replace(/\^/g, '**')
        // Replace variables
        .replace(/\bx\b/g, `(${x})`)
        .replace(/\bt\b/g, `(${t})`);

      // Enhanced security check - allow Math functions and basic operations
      const allowedPattern = /^[0-9+\-*/.() \t\n]+$/;
      const cleanExpr = expr.replace(/Math\.[a-zA-Z]+/g, '');
      if (!allowedPattern.test(cleanExpr)) {
        throw new Error('Invalid expression');
      }

      const result = eval(expr);
      return typeof result === 'number' && !isNaN(result) && isFinite(result) ? result : NaN;
    } catch (error) {
      return NaN;
    }
  }, []);

  // Generate points for a mathematical expression
  const generatePlotPoints = useCallback((expression: string, t: number = 0): PlotPoint[] => {
    const points: PlotPoint[] = [];
    const step = (range.max - range.min) / precision;
    
    for (let x = range.min; x <= range.max; x += step) {
      const y = safeEval(expression, x, t);
      if (!isNaN(y) && Math.abs(y) < 100) { // Reasonable y range for most functions
        points.push({ x, y });
      } else if (!isNaN(y) && Math.abs(y) >= 100) {
        // For very large values, clamp them to prevent visual issues
        const clampedY = Math.sign(y) * 100;
        points.push({ x, y: clampedY });
      }
    }
    
    return points;
  }, [range, precision, safeEval]);

  // Convert mathematical coordinates to canvas coordinates
  const toCanvasCoords = useCallback((x: number, y: number, canvas: HTMLCanvasElement) => {
    const canvasX = ((x - range.min) / (range.max - range.min)) * canvas.width;
    // Improved Y scaling - auto-scale based on canvas height
    const yScale = canvas.height / 8; // This gives us a reasonable scale for most functions
    const canvasY = canvas.height / 2 - y * yScale;
    return { x: canvasX, y: canvasY };
  }, [range]);

  // Draw grid on canvas
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    const canvas = ctx.canvas;
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    // Vertical grid lines
    const verticalStep = (range.max - range.min) / 20;
    for (let x = range.min; x <= range.max; x += verticalStep) {
      const canvasX = ((x - range.min) / (range.max - range.min)) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = -10; y <= 10; y += 2) {
      const canvasY = canvas.height / 2 - (y / 20) * (canvas.height / 2);
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(canvas.width, canvasY);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // Draw axes
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    
    // X-axis
    const xAxisY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(canvas.width, xAxisY);
    ctx.stroke();
    
    // Y-axis
    const yAxisX = ((0 - range.min) / (range.max - range.min)) * canvas.width;
    if (yAxisX >= 0 && yAxisX <= canvas.width) {
      ctx.beginPath();
      ctx.moveTo(yAxisX, 0);
      ctx.lineTo(yAxisX, canvas.height);
      ctx.stroke();
    }
  }, [showGrid, range]);

  // Draw mathematical expression
  const drawExpression = useCallback((ctx: CanvasRenderingContext2D, expression: Expression, t: number) => {
    if (!expression.visible) return;
    
    const points = generatePlotPoints(expression.equation, t);
    if (points.length === 0) return;
    
    ctx.strokeStyle = expression.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let started = false;
    let lastPoint = null;
    
    for (const point of points) {
      const canvasCoords = toCanvasCoords(point.x, point.y, ctx.canvas);
      
      // Check if the point is within reasonable bounds
      if (canvasCoords.y >= -100 && canvasCoords.y <= ctx.canvas.height + 100) {
        if (!started) {
          ctx.moveTo(canvasCoords.x, canvasCoords.y);
          started = true;
        } else {
          // Check for discontinuities (like in tan(x))
          if (lastPoint && Math.abs(canvasCoords.y - lastPoint.y) > ctx.canvas.height / 2) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(canvasCoords.x, canvasCoords.y);
          } else {
            ctx.lineTo(canvasCoords.x, canvasCoords.y);
          }
        }
        lastPoint = canvasCoords;
      }
    }
    
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = expression.color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [generatePlotPoints, toCanvasCoords]);

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
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid(ctx);
      
      // Draw expressions
      expressions.forEach(expr => {
        drawExpression(ctx, expr, animationTime);
      });
      
      // Update animation time
      if (isAnimating) {
        setAnimationTime(prev => prev + 0.05);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [expressions, animationTime, isAnimating, drawGrid, drawExpression]);

  const addExpression = () => {
    if (!currentEquation.trim()) return;
    
    const newExpression: Expression = {
      id: Date.now().toString(),
      equation: currentEquation,
      color: colors[expressions.length % colors.length],
      visible: true,
    };
    
    setExpressions(prev => [...prev, newExpression]);
    setCurrentEquation('');
  };

  const removeExpression = (id: string) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
  };

  const toggleExpression = (id: string) => {
    setExpressions(prev => 
      prev.map(expr => 
        expr.id === id ? { ...expr, visible: !expr.visible } : expr
      )
    );
  };

  const clearAll = () => {
    setExpressions([]);
  };

  const addPreset = (equation: string) => {
    const newExpression: Expression = {
      id: Date.now().toString(),
      equation,
      color: colors[expressions.length % colors.length],
      visible: true,
    };
    
    setExpressions(prev => [...prev, newExpression]);
  };

  const presetEquations = [
    'sin(x)',
    'cos(x)',
    'tan(x)',
    'x^2',
    'x^3',
    'sqrt(x)',
    'log(x)',
    'exp(x)',
    'sin(x) + cos(2*x)',
    'x * sin(x)',
    'sin(x) * cos(x)',
    'abs(x)',
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-4 flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8" />
          Interactive Equation Playground
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
        Abstract ideas make more sense when you can see them move, grow, and connect. 
        Type mathematical expressions, experiment with functions, see real-time visualizations, 
        and discover the beauty of mathematics.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="p-6 magnetic-element" data-magnetic-strength="1.0">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Add Expression
          </h3>
          
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter equation (e.g., sin(x), x^2, cos(x)*sin(x))"
                value={currentEquation}
                onChange={(e) => setCurrentEquation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExpression()}
                className="font-mono"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={addExpression}
                className="flex-1 magnetic-element"
                data-magnetic-strength="0.8"
              >
                <Play className="h-4 w-4 mr-2" />
                Plot
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearAll}
                className="magnetic-element"
                data-magnetic-strength="0.8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Preset Functions */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Add:</h4>
            <div className="grid grid-cols-3 gap-2">
              {presetEquations.slice(0, 6).map((equation) => (
                <Button
                  key={equation}
                  variant="outline"
                  size="sm"
                  onClick={() => addPreset(equation)}
                  className="text-xs font-mono magnetic-element"
                  data-magnetic-strength="0.6"
                >
                  {equation}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Expression List */}
        <Card className="p-6 magnetic-element" data-magnetic-strength="1.0">
          <h3 className="text-xl font-semibold mb-4">Active Expressions</h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {expressions.map((expr) => (
              <div
                key={expr.id}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: expr.color }}
                  />
                  <span className="font-mono text-sm">{expr.equation}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpression(expr.id)}
                    className={expr.visible ? 'opacity-100' : 'opacity-50'}
                  >
                    👁️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExpression(expr.id)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
            
            {expressions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No expressions yet. Add one to get started!
              </div>
            )}
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6 magnetic-element" data-magnetic-strength="1.0">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">X Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={range.min}
                  onChange={(e) => setRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="flex-1"
                  placeholder="Min"
                />
                <Input
                  type="number"
                  value={range.max}
                  onChange={(e) => setRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="flex-1"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Precision: {precision}</label>
              <input
                type="range"
                min="50"
                max="500"
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Show Grid</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={showGrid ? 'bg-primary/20' : ''}
              >
                {showGrid ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Animation</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
                className={isAnimating ? 'bg-primary/20' : ''}
              >
                {isAnimating ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Canvas */}
      <Card className="p-6 magnetic-element" data-magnetic-strength="1.5">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-background/50 rounded-lg border border-primary/10"
          style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(16, 185, 129, 0.05))' }}
        />
      </Card>

      {/* Help */}
      <Card className="p-6 magnetic-element" data-magnetic-strength="1.0">
        <h3 className="text-lg font-semibold mb-3">Mathematical Functions Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Basic Functions:</h4>
            <ul className="space-y-1 text-muted-foreground font-mono">
              <li>sin(x), cos(x), tan(x)</li>
              <li>sqrt(x), abs(x)</li>
              <li>log(x), exp(x)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Operations:</h4>
            <ul className="space-y-1 text-muted-foreground font-mono">
              <li>x^2, x^3 (powers)</li>
              <li>x + 1, x - 1</li>
              <li>x * 2, x / 2</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Constants:</h4>
            <ul className="space-y-1 text-muted-foreground font-mono">
              <li>pi (π ≈ 3.14159)</li>
              <li>e (≈ 2.71828)</li>
              <li>t (animation time)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}; 