import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Users, Star, Play, Pause } from 'lucide-react';

interface AnimatedEquation {
  id: number;
  equation: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speed: number;
}

interface InteractiveFeature {
  icon: any;
  title: string;
  description: string;
  mathConcept: string;
  animation: string;
  color: string;
}

export const AboutSection = () => {
  const [animatedEquations, setAnimatedEquations] = useState<AnimatedEquation[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const equations = [
    'e^(iπ) + 1 = 0',
    '∫₋∞^∞ e^(-x²) dx = √π',
    'lim(n→∞) (1 + 1/n)ⁿ = e',
    '∑ₙ₌₁^∞ 1/n² = π²/6',
    'f\'(x) = lim(h→0) [f(x+h)-f(x)]/h',
    '∇²φ = 0',
    'P(A|B) = P(B|A)P(A)/P(B)',
    '∆x∆p ≥ ℏ/2'
  ];

  const features: InteractiveFeature[] = [
    {
      icon: BookOpen,
      title: 'Visual Learning',
      description: 'Transform abstract concepts into stunning visual narratives',
      mathConcept: 'f(x) = sin(x)',
      animation: 'wave',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Video,
      title: 'Interactive Content',
      description: 'Engage with mathematics through dynamic demonstrations',
      mathConcept: 'y = x²',
      animation: 'parabola',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join a network of passionate mathematical minds',
      mathConcept: '∑ knowledge',
      animation: 'network',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: Star,
      title: 'Progressive Mastery',
      description: 'Build understanding from fundamentals to advanced concepts',
      mathConcept: 'lim(x→∞)',
      animation: 'growth',
      color: 'from-orange-500 to-red-600'
    }
  ];

  useEffect(() => {
    const newEquations: AnimatedEquation[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      equation: equations[i % equations.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * 360,
      speed: Math.random() * 20 + 10,
    }));

    setAnimatedEquations(newEquations);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimatedEquations(prev => 
        prev.map(eq => ({
          ...eq,
          rotation: (eq.rotation + 0.5) % 360,
          x: (eq.x + 0.1) % 100,
          y: eq.y + Math.sin(eq.rotation * Math.PI / 180) * 0.1,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getAnimationPath = (animation: string) => {
    switch (animation) {
      case 'wave':
        return 'M0,50 Q25,25 50,50 T100,50';
      case 'parabola':
        return 'M0,100 Q50,0 100,100';
      case 'growth':
        return 'M0,100 L25,75 L50,50 L75,25 L100,0';
      default:
        return 'M0,50 L100,50';
    }
  };

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Animated mathematical equations background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {animatedEquations.map((eq) => (
          <div
            key={eq.id}
            className="absolute font-mono text-primary/20 select-none transition-all duration-1000"
            style={{
              left: `${eq.x}%`,
              top: `${eq.y}%`,
              fontSize: `${eq.size}rem`,
              opacity: eq.opacity,
              transform: `rotate(${eq.rotation}deg)`,
            }}
          >
            {eq.equation}
          </div>
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Interactive header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-4 mb-6">
            <h2 className="text-5xl md:text-6xl font-bold gradient-text">
              Mathematics Reimagined
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="glow-border hover:bg-primary/10"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Mathematical visualization */}
          <div className="relative h-40 mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-sm border border-primary/10">
            <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="xMidYMid meet">
              {/* Subtle grid */}
              <defs>
                <pattern id="mathGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#mathGrid)" />
              
              {/* Mathematical function: sin(x) * cos(x/2) */}
              <path
                d="M0,80 Q100,40 200,80 Q300,120 400,80 Q500,40 600,80 Q700,120 800,80"
                fill="none"
                stroke="url(#waveGradient)"
                strokeWidth="3"
                filter="url(#glow)"
                className="opacity-90"
              />
              
              {/* Secondary wave for depth */}
              <path
                d="M0,90 Q150,60 300,90 Q450,120 600,90 Q750,60 800,90"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                opacity="0.4"
              />
              
              {/* Animated points */}
              <circle r="5" fill="hsl(var(--primary))" filter="url(#glow)">
                <animateMotion
                  dur="6s"
                  repeatCount="indefinite"
                  path="M0,80 Q100,40 200,80 Q300,120 400,80 Q500,40 600,80 Q700,120 800,80"
                />
              </circle>
              
              <circle r="3" fill="hsl(var(--secondary))" opacity="0.8">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path="M0,90 Q150,60 300,90 Q450,120 600,90 Q750,60 800,90"
                />
              </circle>
              
              {/* Axis labels */}
              <text x="20" y="20" fill="hsl(var(--primary))" fontSize="12" opacity="0.6" fontFamily="monospace">f(x) = sin(x)cos(x/2)</text>
              <text x="720" y="150" fill="hsl(var(--secondary))" fontSize="10" opacity="0.5" fontFamily="monospace">x</text>
            </svg>
          </div>

          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Where abstract mathematical concepts transform into 
            <span className="gradient-text font-medium"> interactive experiences</span> and 
            <span className="gradient-text font-medium"> visual poetry</span>
          </p>
        </div>

        {/* Interactive feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative p-8 interactive-card bg-card/30 backdrop-blur-sm glow-border overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Mathematical concept visualization */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <svg width="60" height="40" viewBox="0 0 100 60">
                  <path
                    d={getAnimationPath(feature.animation)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  {hoveredCard === index && (
                    <circle r="3" fill="currentColor" className="text-secondary">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={getAnimationPath(feature.animation)}
                      />
                    </circle>
                  )}
                </svg>
              </div>

              {/* Icon with hover animation */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Mathematical concept display */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-mono text-primary border border-primary/20">
                    {feature.mathConcept}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4 group-hover:gradient-text transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover effect particles */}
              {hoveredCard === index && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-primary rounded-full animate-ping"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 10}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Interactive mathematical playground */}
        <div className="text-center">
          <div className="relative inline-block p-12 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm glow-border">
            {/* Floating mathematical symbols */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {['π', 'e', '∞', '∑', '∫'].map((symbol, i) => (
                <div
                  key={symbol}
                  className="absolute text-4xl font-bold text-primary/20 animate-bounce"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${20 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '3s'
                  }}
                >
                  {symbol}
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6 gradient-text">
                Ready to explore the universe of mathematics?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                Join thousands of learners discovering the elegant connections between numbers, 
                patterns, and the fundamental laws that govern our reality.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl"
                  className="group relative overflow-hidden"
                  onClick={() => window.open('https://youtube.com/@zero2pi', '_blank')}
                >
                  <Video className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explore Our Universe
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="xl"
                  className="glow-border hover:bg-muted/10 border-primary/30 group"
                >
                  <Star className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Latest Discovery
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};