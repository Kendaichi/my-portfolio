import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const TITLES = [
  "A Full-Stack Developer.",
  "A Systems Architect.",
  "A Problem Solver.",
  "A Digital Craftsman.",
  "A Critical Thinker.",
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const titleEnter: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HeroSection() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const scrollToWork = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center"
      aria-label="Hero"
    >
      <div className="container relative z-10 max-w-3xl py-20 lg:py-0">
        <motion.div
          className="flex flex-col-reverse sm:flex-row items-start gap-8 sm:gap-12"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-6 flex-1">
            <motion.p
              variants={item}
              className="text-sm font-mono tracking-widest uppercase text-muted-foreground"
            >
              Full-Stack Web Developer
            </motion.p>

            {/* Name + cycling title — grouped so space-y-6 doesn't split them */}
            <motion.div variants={item} className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2]">
                Hi, I'm Franclloyd D. Dagdag,
              </h1>

              {/* Responsive height matches text-xl / text-3xl / text-4xl * leading-1.2 */}
              <div className="overflow-hidden h-6 sm:h-9 lg:h-11">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={titleIndex}
                    variants={titleEnter}
                    initial="hidden"
                    animate="visible"
                    exit={{
                      opacity: 0,
                      y: -16,
                      transition: { duration: 0.3, ease: "easeIn" },
                    }}
                    className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gradient leading-[1.2]"
                  >
                    {TITLES[titleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              variants={item}
              className="text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              Focused on performance, maintainability, and elegant system
              design. I create end-to-end solutions that transform complex
              workflows into efficient digital platforms.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-4 pt-2">
              <Button variant="hero" size="lg" onClick={scrollToWork}>
                View My Work
              </Button>
              <Button variant="heroOutline" size="lg" onClick={scrollToContact}>
                Let's Work Together
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 text-muted-foreground text-sm">
        <ArrowDown className="h-4 w-4 animate-bounce" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
