import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function Section({ id, title, subtitle, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('min-h-screen flex items-center py-24 lg:py-32', className)}
    >
      <div className="container max-w-3xl">
        <motion.div
          className="space-y-2 mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
            {subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
