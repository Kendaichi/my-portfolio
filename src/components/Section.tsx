import { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, title, subtitle, children, className }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        'min-h-screen flex items-center py-24 lg:py-32',
        className
      )}
    >
      <div
        className={cn(
          'container max-w-3xl transition-all duration-1000 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        <div className="space-y-2 mb-12">
          <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
            {subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
