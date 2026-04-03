import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const scrapbookTilt: Variants = {
  hidden: { opacity: 0, rotate: 0, scale: 0.92 },
  visible: { opacity: 1, rotate: -1.5, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const scrapbookTiltReverse: Variants = {
  hidden: { opacity: 0, rotate: 0, scale: 0.92 },
  visible: { opacity: 1, rotate: 1.8, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const BLOG_POSTS = [
  {
    slug: "acro-refrigeration",
    title: "Acro Refrigeration",
    subtitle: "From WordPress Bottleneck to a Lightning-Fast, SEO-Optimized Platform",
    date: "2026",
    tags: ["Next.js", "Supabase", "Vercel", "CMS", "SEO"],
    preview:
      "How I rebuilt an Australian refrigeration company's entire web presence — migrating 100+ blog posts, building a custom CMS, and boosting page speed by 10x.",
  },
];

export default function Blog() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <CustomCursor />

      {/* Subtle grid background */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <main className="relative z-10">
        {/* Header */}
        <div className="container max-w-4xl pt-12 pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
        </div>

        {/* Page Title */}
        <motion.div
          className="container max-w-4xl pb-16"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2"
          >
            Case Studies & Insights
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Blog
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground mt-4 max-w-2xl"
          >
            Deep dives into real projects — the problems, the process, and the results.
          </motion.p>
        </motion.div>

        {/* Blog Post Cards */}
        <div className="container max-w-4xl pb-24">
          {BLOG_POSTS.map((post) => (
            <motion.div
              key={post.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="group rounded-xl bg-card/60 border border-border/30 hover:border-border/60 transition-all duration-300 overflow-hidden hover:bg-card/80">
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>Case Study</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-foreground/90 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground/80 max-w-xl">
                      {post.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.preview}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-mono rounded bg-accent/50 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors pt-2">
                      Read Case Study →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="border-t border-border/20 py-8">
          <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 — Engineered with precision.</p>
            <Link to="/" className="hover:text-foreground transition-colors">
              Back to Portfolio
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
