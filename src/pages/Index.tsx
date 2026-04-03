import { useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import CubeCanvas from "@/components/CubeCanvas";
import HeroSection from "@/components/HeroSection";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import CustomCursor from "@/components/CustomCursor";
import RobotParticleBackground from "@/components/RobotParticleBackground";
import TiltCard from "@/components/TiltCard";
import {
  Code2,
  Database,
  Globe,
  Layers,
  Server,
  Smartphone,
} from "lucide-react";

import projectBlockchain from "@/assets/project-blockchain.webp";
import projectProcurement from "@/assets/project-procurement.webp";
import projectInternalAudit from "@/assets/project-internal-audit.webp";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React", "NextJS", "Shadcn", "Tailwind CSS", "Flutter"],
  },
  { category: "Backend", items: ["Node.js", "Python", "Laravel"] },
  {
    category: "Data",
    items: ["PostgreSQL", "MySQL", "Firebase", "Supabase"],
  },
  {
    category: "Others",
    items: ["Web3", "Docker", "Wordpress", "SEO"],
  },
];

const EXPERIENCE = [
  // {
  //   role: "Senior Software Engineer",
  //   company: "Scale Systems Inc.",
  //   period: "2022 — Present",
  //   description:
  //     "Architecting distributed microservices handling 10M+ daily transactions.",
  // },
  {
    role: "Full Stack Web Developer",
    company: "City Government of Butuan",
    period: "May 2024 - Present",
    description:
      "Lead the digital transformation initiative, developing user-centric Internal Audit Application called IAMS",
  },
  {
    role: "Project Technical Assistant III",
    company: "DOST Caraga Regional Office",
    period: "August 2023 — May 2024",
    description:
      "Developed and shipped 3 products from zero to production. Aside from development, I also led the STORRM Project for DRRM related activities, projects and events.",
  },
];

const PROJECTS = [
  {
    title: "Internal Audit Management System (IAMS)",
    description:
      "A centralized audit workflow platform designed for government operations. Streamlines audit planning, risk assessment, reporting, and tracking with real-time status monitoring and role-based access control.",
    tech: ["ReactJS", "Laravel", "NodeJS", "WebSocket", "MySQL"],
    icon: Server,
    image: projectInternalAudit,
  },
  {
    title: "Procurement Management System",
    description:
      "End-to-end procurement tracking system that digitizes requisitions, approvals, supplier coordination, and compliance monitoring, reducing manual paperwork and improving process transparency.",
    tech: ["ReactJS", "WebSocket", "FastAPI", "PostgreSQL"],
    icon: Layers,
    image: projectProcurement,
  },
  {
    title: "Automated Financial Audit with Blockchain",
    description:
      "Blockchain-backed financial verification platform enabling tamper-resistant audit trails, document validation, and automated compliance checks using smart contracts and OCR-based document extraction.",
    tech: ["Node.js", "ReactJS", "Hyperledger Besu", "IPFS", "OCR"],
    icon: Globe,
    image: projectBlockchain,
  },
];

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Index() {
  const scrollProgress = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative bg-background text-foreground">
      <CustomCursor />
      <RobotParticleBackground
        scrollProgress={scrollProgress}
        mouseRef={mouseRef}
      />

      {/* Dark overlay between robot and cube */}
      <div className="fixed inset-0 z-[7] pointer-events-none bg-black/25" />

      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-[10] flex items-center justify-center pointer-events-none sm:justify-end">
        {/* Mobile: square canvas so the cube has a proper aspect ratio and sits between
            the audience robots (top) and the podium robots (bottom).
            sm+: full-height panel on the right, same as before. */}
        <div className="w-4/5 aspect-square sm:w-1/2 sm:aspect-auto sm:h-full">
          <CubeCanvas scrollProgress={scrollProgress} mouseRef={mouseRef} />
        </div>
      </div>

      {/* Gradient overlays for readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-r from-background/70 via-background/30 to-transparent lg:via-background/20" />
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-t from-background/25 via-transparent to-background/25" />

      {/* Dark overlay between cube (z-10) and text (z-20) */}
      <div className="fixed inset-0 z-[15] pointer-events-none bg-black/30" />

      {/* Scrollable Content */}
      <main className="relative z-[20]">
        <HeroSection />

        <Section id="about" title="About" subtitle="01">
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p className="text-lg text-foreground/90">
              I'm a systems-minded programmer who thrives at the intersection of
              architecture and execution.
            </p>
            <p>
              With deep experience across the full stack, I design and build
              software that is resilient, scalable, and maintainable. I believe
              in clean abstractions, thoughtful API design, and infrastructure
              that disappears — so teams can ship faster and users get
              reliability they never have to think about.
            </p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                { icon: Code2, label: "Clean Code" },
                { icon: Server, label: "System Design" },
                { icon: Database, label: "Data Architecture" },
                // { icon: Globe, label: "Distributed Systems" },
                { icon: Layers, label: "API Design" },
                { icon: Smartphone, label: "Full-Stack" },
              ].map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUpItem}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30 hover:border-border/60 transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground/80">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        <Section id="skills" title="Skills" subtitle="02">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {SKILLS.map((group) => (
              <motion.div
                key={group.category}
                variants={fadeUpItem}
                className="space-y-3"
              >
                <h3 className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-md bg-card border border-border/40 text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="experience" title="Experience" subtitle="03">
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
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
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="projects" title="Projects" subtitle="04">
          <motion.div
            className="grid gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {PROJECTS.map((project, i) => (
              <motion.div key={i} variants={fadeUpItem}>
                <TiltCard className="rounded-xl bg-card/60 border border-border/30 overflow-hidden hover:border-border/60 transition-colors">
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
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-xs font-mono rounded bg-accent/50 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="case-studies" title="Case Studies" subtitle="05">
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.p
              variants={fadeUpItem}
              className="text-muted-foreground leading-relaxed mb-6"
            >
              Real projects, real problems, real results — deep dives into how I
              approach client work from start to finish.
            </motion.p>

            <motion.div variants={fadeUpItem}>
              <Link to="/blog/acro-refrigeration">
                <TiltCard className="rounded-xl bg-card/60 border border-border/30 overflow-hidden hover:border-border/60 transition-colors group">
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                      <span>Client Project</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>Australia</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-foreground/90 transition-colors">
                      Acro Refrigeration
                    </h3>
                    <p className="text-sm text-muted-foreground/80">
                      From WordPress Bottleneck to a Lightning-Fast, SEO-Optimized
                      Platform
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A 50+ year Australian business had outgrown WordPress. I
                      rebuilt their entire web presence — migrating 100+ blog posts,
                      building a custom CMS, and boosting page speed by 10x.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Next.js", "Supabase", "Vercel", "Custom CMS", "SEO"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs font-mono rounded bg-accent/50 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground/60 group-hover:text-foreground/80 transition-colors pt-1">
                      Read Case Study →
                    </p>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          </motion.div>
        </Section>

        <Section id="education" title="Education" subtitle="06">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                B.S. Information Technology
              </h3>
              <p className="text-sm text-muted-foreground">
                Caraga State University — 2023
              </p>
              <p className="text-sm text-foreground/70 pt-1">
                Focus on system design, algorithms, and software architecture.
                Graduated with honors (magna cum laude).
              </p>
            </div>
          </div>
        </Section>

        <Section id="contact" title="Let's Connect" subtitle="07">
          <p className="text-muted-foreground mb-8 max-w-xl">
            Have a project in mind or want to discuss an opportunity? I'd love
            to hear from you.
          </p>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Details */}
            <div className="flex flex-col gap-6 min-w-[220px]">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Contact
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:franclloyd.dagdag@daggerbuilds.com"
                    className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-xs group-hover:border-foreground/40 transition-colors">
                      @
                    </span>
                    <span>franclloyd.dagdag@daggerbuilds.com</span>
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Profiles
                </p>
                <div className="space-y-3">
                  <a
                    href="https://github.com/Kendaichi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-xs group-hover:border-foreground/40 transition-colors">
                      GH
                    </span>
                    <span>github.com/Kendaichi</span>
                  </a>
                  <a
                    href="https://ph.linkedin.com/in/franclloyd-dagdag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-xs group-hover:border-foreground/40 transition-colors">
                      in
                    </span>
                    <span>franclloyd-dagdag</span>
                  </a>
                  <a
                    href="https://www.facebook.com/franclloyd.dagdag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-xs group-hover:border-foreground/40 transition-colors">
                      fb
                    </span>
                    <span>franclloyd.dagdag</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-border/20 self-stretch" />
            <div className="lg:hidden h-px bg-border/20 w-full" />

            {/* Contact Form */}
            <div className="flex-1">
              <ContactForm />
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/20 py-8">
          <div className="container max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <p>© 2026 — Engineered with precision.</p>
              <a
                href="mailto:franclloyd.dagdag@daggerbuilds.com"
                className="hover:text-foreground transition-colors text-xs"
              >
                franclloyd.dagdag@daggerbuilds.com
              </a>
            </div>
            <div className="flex gap-6">
              <Link
                to="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <a
                href="https://github.com/Kendaichi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://ph.linkedin.com/in/franclloyd-dagdag"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/franclloyd.dagdag"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Facebook
              </a>
              <a
                href="mailto:franclloyd.dagdag@daggerbuilds.com"
                className="hover:text-foreground transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
