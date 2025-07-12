import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Youtube, ExternalLink } from 'lucide-react';

const mathSymbols = ['π', '∑', '∫', '∞', '√', '∆', 'θ', 'λ', '∂', '∇', 'α', 'β', 'γ', 'φ', 'ψ', '≈', '≠', '≤', '≥', '∈'];

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

interface MathSymbol {
  id: number;
  symbol: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export const HeroSection = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mathSymbolElements, setMathSymbolElements] = useState<MathSymbol[]>([]);

  useEffect(() => {
    // Create particles
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 20,
    }));

    // Create floating math symbols
    const newMathSymbols: MathSymbol[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
      x: Math.random() * 100,
      size: Math.random() * 20 + 20,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 25,
    }));

    setParticles(newParticles);
    setMathSymbolElements(newMathSymbols);
  }, []);

  return (
    <section className="relative min-h-screen hero-bg flex items-center justify-center overflow-hidden">
      {/* Animated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle bg-primary/20"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Floating math symbols */}
      {mathSymbolElements.map((symbol) => (
        <div
          key={symbol.id}
          className="math-symbol font-mono font-bold"
          style={{
            left: `${symbol.x}%`,
            fontSize: `${symbol.size}px`,
            animationDuration: `${symbol.duration}s`,
            animationDelay: `${symbol.delay}s`,
          }}
        >
          {symbol.symbol}
        </div>
      ))}

      {/* Main content */}
      <div className="container mx-auto px-6 text-center z-10 relative pt-16 sm:pt-8 md:pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Animated logo/brand */}
          <div className="mb-8 float hardware-accelerated">
            <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 tracking-tight">
              zero2pi
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse-glow hardware-accelerated" />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light max-w-2xl mx-auto leading-relaxed float-delay">
            Where mathematics becomes{' '}
            <span className="gradient-text font-medium">beautiful</span> and{' '}
            <span className="gradient-text font-medium">intuitive</span>
          </p>

          <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto">
          I make math videos that explain things the way I wish someone had explained them to me.
          No overcomplicated terms, just clear ideas and visual thinking.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="hero" 
              size="xl"
              className="group relative overflow-hidden magnetic-element"
              data-magnetic-strength="1.5"
              onClick={() => window.open('https://youtube.com/@zero2pi', '_blank')}
            >
              <Youtube className="mr-2 h-5 w-5" />
              Watch on YouTube
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Button>

            <Button 
              variant="outline" 
              size="xl"
              className="glow-border hover:bg-muted/10 border-primary/30 magnetic-element"
              data-magnetic-strength="1.2"
              onClick={() => window.open('https://www.youtube.com/watch?v=p1Am_-nRSPM', '_blank')}
            >
              <Play className="mr-2 h-5 w-5" />
              Featured Video
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center float hardware-accelerated">
              <div className="text-3xl font-bold gradient-text mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Mathematical Concepts</div>
            </div>
            <div className="text-center float-delay hardware-accelerated">
              <div className="text-3xl font-bold gradient-text mb-2">π</div>
              <div className="text-sm text-muted-foreground">From Zero to Pi</div>
            </div>
            <div className="text-center float hardware-accelerated">
              <div className="text-3xl font-bold gradient-text mb-2">∫</div>
              <div className="text-sm text-muted-foreground">Beautiful Explanations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};