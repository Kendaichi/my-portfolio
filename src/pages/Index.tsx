import { useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import CubeCanvas from "@/components/CubeCanvas";
import HeroSection from "@/components/HeroSection";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import {
  Code2,
  Database,
  Globe,
  Layers,
  Server,
  Smartphone,
} from "lucide-react";

import projectBlockchain from "@/assets/project-blockchain.jpg";
import projectProcurement from "@/assets/project-procurement.jpg";
import projectInternalAudit from "@/assets/project-internal-audit.png";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React", "Shadcn", "Tailwind CSS", "Flutter"],
  },
  { category: "Backend", items: ["Node.js", "Python", "Laravel"] },
  {
    category: "Data",
    items: ["PostgreSQL", "MySQL", "Firebase", "Supabase"],
  },
  {
    category: "Others",
    items: ["Web3", "Docker", "Wordpress"],
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

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
              <motion.div
                key={i}
                variants={fadeUpItem}
                whileHover={{ scale: 1.01 }}
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
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="education" title="Education" subtitle="05">
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
              <a
                href="https://github.com/Kendaichi"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://ph.linkedin.com/in/franclloyd-dagdag"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.facebook.com/franclloyd.dagdag"
                className="hover:text-foreground transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
