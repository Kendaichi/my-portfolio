import { useRef, useEffect } from 'react';
import CubeCanvas from '@/components/CubeCanvas';
import HeroSection from '@/components/HeroSection';
import Section from '@/components/Section';
import ContactForm from '@/components/ContactForm';
import { Code2, Database, Globe, Layers, Server, Smartphone } from 'lucide-react';
import projectTaskEngine from '@/assets/project-task-engine.jpg';
import projectAnalytics from '@/assets/project-analytics.jpg';
import projectApiGateway from '@/assets/project-api-gateway.jpg';

const SKILLS = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
  { category: 'Backend', items: ['Node.js', 'Python', 'Go', 'GraphQL'] },
  { category: 'Infrastructure', items: ['AWS', 'Docker', 'Kubernetes', 'Terraform'] },
  { category: 'Data', items: ['PostgreSQL', 'Redis', 'Elasticsearch', 'Kafka'] },
];

const EXPERIENCE = [
  {
    role: 'Senior Software Engineer',
    company: 'Scale Systems Inc.',
    period: '2022 — Present',
    description: 'Architecting distributed microservices handling 10M+ daily transactions.',
  },
  {
    role: 'Software Engineer',
    company: 'DataFlow',
    period: '2020 — 2022',
    description: 'Built real-time data pipelines and customer-facing analytics dashboards.',
  },
  {
    role: 'Full-Stack Developer',
    company: 'StartupLab',
    period: '2018 — 2020',
    description: 'Developed and shipped 3 products from zero to production.',
  },
];

const PROJECTS = [
  {
    title: 'Distributed Task Engine',
    description: 'A fault-tolerant distributed task processing system handling 50K+ jobs/minute.',
    tech: ['Go', 'Redis', 'gRPC', 'Kubernetes'],
    icon: Server,
    image: projectTaskEngine,
  },
  {
    title: 'Real-Time Analytics Dashboard',
    description: 'Live metrics visualization platform with sub-second data refresh.',
    tech: ['React', 'WebSocket', 'D3.js', 'PostgreSQL'],
    icon: Layers,
    image: projectAnalytics,
  },
  {
    title: 'API Gateway Platform',
    description: 'High-throughput API management layer with rate limiting and auth.',
    tech: ['Node.js', 'TypeScript', 'Docker', 'Nginx'],
    icon: Globe,
    image: projectApiGateway,
  },
];

export default function Index() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-background text-foreground">
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0 flex items-center justify-end pointer-events-none">
        <div className="w-full lg:w-1/2 h-full opacity-80">
          <CubeCanvas scrollProgress={scrollProgress} />
        </div>
      </div>

      {/* Gradient overlays for readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent lg:via-background/60" />
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-t from-background/40 via-transparent to-background/40" />

      {/* Scrollable Content */}
      <main className="relative z-[2]">
        <HeroSection />

        <Section id="about" title="About" subtitle="01">
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p className="text-lg text-foreground/90">
              I'm a systems-minded engineer who thrives at the intersection of
              architecture and execution.
            </p>
            <p>
              With deep experience across the full stack, I design and build
              software that is resilient, scalable, and maintainable. I believe
              in clean abstractions, thoughtful API design, and infrastructure
              that disappears — so teams can ship faster and users get
              reliability they never have to think about.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {[
                { icon: Code2, label: 'Clean Code' },
                { icon: Server, label: 'System Design' },
                { icon: Database, label: 'Data Architecture' },
                { icon: Globe, label: 'Distributed Systems' },
                { icon: Layers, label: 'API Design' },
                { icon: Smartphone, label: 'Full-Stack' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="skills" title="Skills" subtitle="02">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {SKILLS.map(group => (
              <div key={group.category} className="space-y-3">
                <h3 className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-md bg-card border border-border/40 text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience" subtitle="03">
          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                className="relative pl-6 border-l border-border/40 space-y-1"
              >
                <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-foreground/60" />
                <p className="text-xs font-mono text-muted-foreground tracking-wider">
                  {exp.period}
                </p>
                <h3 className="text-lg font-semibold">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-sm text-foreground/70 pt-1">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects" subtitle="04">
          <div className="grid gap-6">
            {PROJECTS.map((project, i) => (
              <div
                key={i}
                className="rounded-xl bg-card/60 border border-border/30 overflow-hidden hover:border-border/60 transition-colors"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <project.icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tech.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-xs font-mono rounded bg-accent/50 text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="education" title="Education" subtitle="05">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                B.S. Computer Science
              </h3>
              <p className="text-sm text-muted-foreground">
                University of Technology — 2018
              </p>
              <p className="text-sm text-foreground/70 pt-1">
                Focus on distributed systems, algorithms, and software
                architecture. Graduated with honors.
              </p>
            </div>
          </div>
        </Section>

        <Section id="contact" title="Let's Connect" subtitle="06">
          <p className="text-muted-foreground mb-8 max-w-md">
            Have a project in mind or want to discuss an opportunity? I'd love
            to hear from you.
          </p>
          <ContactForm />
        </Section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/20 py-8">
          <div className="container max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 — Engineered with precision.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
