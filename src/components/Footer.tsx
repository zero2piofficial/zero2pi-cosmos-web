import { Youtube, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="relative container mx-auto px-6 py-12">
        {/* Main content centered */}
        <div className="flex flex-col items-center space-y-8">
          
          {/* Brand logo */}
          <div className="text-center">
            <h3 className="text-xl font-bold gradient-text mb-2">zero2pi</h3>
            <p className="text-sm text-muted-foreground/80">When zero meets infinity</p>
          </div>

          {/* Social icons with enhanced styling */}
          <div className="flex justify-center space-x-6">
            <Button 
              variant="outline" 
              size="icon"
              className="w-12 h-12 glow-border hover:bg-primary/10 hover:border-primary/50 magnetic-element group transition-all duration-300"
              data-magnetic-strength="1.2"
              onClick={() => window.open('https://youtube.com/@zero2pi', '_blank')}
            >
              <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="w-12 h-12 glow-border hover:bg-primary/10 hover:border-primary/50 magnetic-element group transition-all duration-300"
              data-magnetic-strength="1.2"
              onClick={() => window.open('https://github.com/zero2pi', '_blank')}
            >
              <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="w-12 h-12 glow-border hover:bg-primary/10 hover:border-primary/50 magnetic-element group transition-all duration-300"
              data-magnetic-strength="1.2"
              onClick={() => window.open('mailto:info.zero2pi@gmail.com', '_blank')}
            >
              <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          {/* Decorative mathematical symbols */}
          <div className="flex items-center space-x-8 opacity-20">
            <span className="text-2xl font-mono text-primary">π</span>
            <span className="text-lg font-mono text-secondary">∫</span>
            <span className="text-2xl font-mono text-primary">∞</span>
            <span className="text-lg font-mono text-secondary">∑</span>
            <span className="text-2xl font-mono text-primary">√</span>
          </div>

          {/* Bottom divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Copyright with better styling */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground/70">
              © 2025 <span className="gradient-text font-medium">zero2pi</span>
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Inspiring mathematical minds across the universe
            </p>
          </div>
        </div>
      </div>

      {/* Floating mathematical particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-1 h-1 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-4 right-1/4 w-1 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </footer>
  );
};