import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import portraitPlaceholder from '@/assets/portrait-placeholder.jpg';

export default function HeroSection() {
  const scrollToWork = () => {
    const el = document.getElementById('projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center" aria-label="Hero">
      <div className="container relative z-10 max-w-3xl py-20 lg:py-0">
        <div className="flex flex-col-reverse sm:flex-row items-start gap-8 sm:gap-12">
          <div className="space-y-6 flex-1">
            <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
              Full-Stack Engineer
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              I Engineer Systems
              <br />
              <span className="text-gradient">That Scale.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Building robust architectures and elegant solutions for complex
              problems. From system design to pixel-perfect interfaces.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="hero" size="lg" onClick={scrollToWork}>
                View My Work
              </Button>
              <Button variant="heroOutline" size="lg" onClick={scrollToContact}>
                Let's Work Together
              </Button>
            </div>
          </div>

          {/* Portrait — replace src with your own photo */}
          <div className="shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-border/40 bg-card">
              <img
                src={portraitPlaceholder}
                alt="Portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 text-muted-foreground text-sm">
        <ArrowDown className="h-4 w-4 animate-bounce" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
