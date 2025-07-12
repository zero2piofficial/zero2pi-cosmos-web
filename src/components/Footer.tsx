import { Youtube, Github, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">zero2pi</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Transforming mathematical education through beautiful, engaging video content. 
              Making complex concepts accessible to everyone.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Explore</h4>
            <div className="space-y-2">
              <div>
                <a 
                  href="https://youtube.com/@zero2pi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Latest Videos
                </a>
              </div>
              <div>
                <a 
                  href="https://youtube.com/@zero2pi/playlists" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Playlists
                </a>
              </div>
              <div>
                <a 
                  href="https://youtube.com/@zero2pi/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  About Channel
                </a>
              </div>
            </div>
          </div>

          {/* Connect section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="icon"
                className="glow-border hover:bg-primary/10"
                onClick={() => window.open('https://youtube.com/@zero2pi', '_blank')}
              >
                <Youtube className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="glow-border hover:bg-primary/10"
                onClick={() => window.open('https://github.com/zero2pi', '_blank')}
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="glow-border hover:bg-primary/10"
                onClick={() => window.open('mailto:contact@zero2pi.com', '_blank')}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Have questions? Reach out and let's discuss mathematics!
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            <span>for mathematics education</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2024 zero2pi. Inspiring mathematical minds.
          </div>
        </div>
      </div>
    </footer>
  );
};