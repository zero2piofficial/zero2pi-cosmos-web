import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Users, Star } from 'lucide-react';

export const AboutSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Clear Explanations',
      description: 'Breaking down complex mathematical concepts into digestible, visual explanations that make sense.'
    },
    {
      icon: Video,
      title: 'Engaging Content',
      description: 'High-quality video content with stunning animations and interactive visualizations.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Building a community of math enthusiasts who share a passion for learning and discovery.'
    },
    {
      icon: Star,
      title: 'From Basics to Advanced',
      description: 'Covering everything from fundamental arithmetic to advanced calculus and beyond.'
    }
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Making Math Accessible
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our mission is to transform how people perceive and learn mathematics. 
            Through carefully crafted visual content, we reveal the beauty and logic 
            that lies at the heart of mathematical thinking.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 interactive-card bg-card/50 backdrop-blur-sm glow-border"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm glow-border">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Ready to explore mathematics?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of learners discovering the beauty of mathematics through our engaging video content.
            </p>
            <Button 
              variant="glow" 
              size="lg"
              onClick={() => window.open('https://youtube.com/@zero2pi', '_blank')}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};