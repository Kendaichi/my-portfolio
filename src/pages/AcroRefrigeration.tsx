import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Gauge,
  Search,
  PenTool,
  Zap,
  Server,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import solutionImg from "@/assets/acro/new-website.webp";
import challengeimg from "@/assets/acro/old-website.webp";
import oldPerfImg from "@/assets/acro/old-website-performance-assessment.webp";
import newPerfImg from "@/assets/acro/new-website-performance-assessment.webp";

/* ── animation variants ─────────────────────────────────────── */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

/* scrapbook-style tilts */
const tiltLeft: Variants = {
  hidden: { opacity: 0, rotate: 0, scale: 0.93 },
  visible: {
    opacity: 1,
    rotate: -2,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const tiltRight: Variants = {
  hidden: { opacity: 0, rotate: 0, scale: 0.93 },
  visible: {
    opacity: 1,
    rotate: 1.5,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" },
  },
};

/* ── reusable scrapbook image slot ──────────────────────────── */

function ScrapbookImage({
  src,
  alt,
  caption,
  rotate = "left",
  tapePosition = "top",
}: {
  src?: string;
  alt: string;
  caption?: string;
  rotate?: "left" | "right" | "none";
  tapePosition?: "top" | "corner";
}) {
  const rotateClass =
    rotate === "left"
      ? "-rotate-[2deg]"
      : rotate === "right"
      ? "rotate-[1.8deg]"
      : "";

  return (
    <div className={`relative ${rotateClass} group`}>
      {/* Tape strip */}
      {tapePosition === "top" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-16 h-6 bg-foreground/[0.07] backdrop-blur-sm border border-foreground/[0.06] rounded-sm rotate-[1deg]" />
      )}
      {tapePosition === "corner" && (
        <>
          <div className="absolute -top-2 -left-2 z-10 w-10 h-5 bg-foreground/[0.07] backdrop-blur-sm border border-foreground/[0.06] rounded-sm -rotate-[12deg]" />
          <div className="absolute -top-2 -right-2 z-10 w-10 h-5 bg-foreground/[0.07] backdrop-blur-sm border border-foreground/[0.06] rounded-sm rotate-[12deg]" />
        </>
      )}

      {/* Image frame */}
      <div className="bg-card border border-border/40 rounded-sm p-2 shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:shadow-black/30 transition-shadow duration-300">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-auto rounded-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-accent/30 rounded-sm flex items-center justify-center border border-dashed border-border/40">
            <p className="text-xs text-muted-foreground/60 font-mono text-center px-4">
              {alt}
            </p>
          </div>
        )}
        {caption && (
          <p className="text-[11px] text-muted-foreground/70 font-mono mt-2 text-center italic">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── sticky note component ──────────────────────────────────── */

function StickyNote({
  children,
  color = "yellow",
  rotate = -3,
}: {
  children: React.ReactNode;
  color?: "yellow" | "blue" | "pink" | "green";
  rotate?: number;
}) {
  const bgMap = {
    yellow: "bg-yellow-500/[0.08] border-yellow-500/20",
    blue: "bg-blue-500/[0.08] border-blue-500/20",
    pink: "bg-pink-500/[0.08] border-pink-500/20",
    green: "bg-green-500/[0.08] border-green-500/20",
  };

  return (
    <div
      className={`${bgMap[color]} border rounded-sm p-4 shadow-md shadow-black/10`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

/* ── main page ──────────────────────────────────────────────── */

export default function AcroRefrigeration() {
  /* image state — allows user to upload/set images later */
  const [challengeImage] = useState<string | undefined>(challengeimg);
  const [solutionImage] = useState<string | undefined>(solutionImg);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <CustomCursor />

      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10">
        {/* ── Navigation ── */}
        <div className="container max-w-4xl pt-12 pb-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            All Case Studies
          </Link>
        </div>

        {/* ── Hero ── */}
        <motion.header
          className="container max-w-4xl pt-8 pb-16"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            {[
              "Next.js",
              "TypeScript",
              "Supabase",
              "Vercel",
              "Custom CMS",
              "SEO",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono rounded bg-accent/50 text-muted-foreground border border-border/30"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-3"
          >
            Case Study — Client Project
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4"
          >
            Rebuilding Acro
            <br />
            <span className="text-gradient">Refrigeration</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            A 50+ year Australian refrigeration company had outgrown their
            WordPress site. Slow, hard to maintain, and impossible to customize
            — it no longer matched the quality of their business. So I rebuilt
            it from the ground up.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6">
            <a
              href="https://www.acrorefrigeration.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-card border border-border/40 text-foreground/80 hover:text-foreground hover:border-border/60 transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Live Site
            </a>
          </motion.div>
        </motion.header>

        {/* ── Divider ── */}
        <div className="container max-w-4xl">
          <div className="h-px bg-border/20" />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 1: THE PROBLEM
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="container max-w-4xl py-20 lg:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">
                01 — The Problem
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                A Website That No Longer Fit the Business
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="space-y-5 text-muted-foreground leading-relaxed max-w-2xl mb-12"
            >
              <p className="text-lg text-foreground/90">
                With over 50 years in the refrigeration industry, Acro
                Refrigeration had built a rock-solid reputation across
                Australia. But their website hadn't kept up with the business.
              </p>
              <p>
                The WordPress site had become more of a burden than an asset —
                pages loaded at a crawl, the design felt outdated, and every
                small change meant wrestling with plugins and maintenance.
                Worse, when they wanted to add features or functionality to
                support their operations, WordPress simply couldn't deliver.
              </p>
            </motion.div>

            {/* ── Scrapbook: Problem Evidence ── */}
            <motion.div variants={fadeUp} className="relative">
              {/* The main problem image — tilted like a photo pinned to a board */}
              <motion.div
                variants={tiltLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="max-w-lg mx-auto mb-8"
              >
                <ScrapbookImage
                  src={challengeImage}
                  alt="Screenshot: Old Acro Refrigeration website — slow load times & outdated design"
                  caption="The old site — 15+ second load times on mobile"
                  rotate="left"
                  tapePosition="corner"
                />
              </motion.div>

              {/* Pain point sticky notes scattered around */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <motion.div
                  variants={popIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <StickyNote color="pink" rotate={-2.5}>
                    <Gauge className="h-5 w-5 text-pink-400/60 mb-2" />
                    <p className="text-sm font-semibold text-foreground/80 mb-1">
                      Painfully Slow
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      8+ second load times. Bloated plugins and unoptimized
                      images were dragging the entire experience down.
                    </p>
                  </StickyNote>
                </motion.div>

                <motion.div
                  variants={popIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <StickyNote color="yellow" rotate={1.5}>
                    <PenTool className="h-5 w-5 text-yellow-400/60 mb-2" />
                    <p className="text-sm font-semibold text-foreground/80 mb-1">
                      Dated Design
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      After 50+ years building their reputation, the visual
                      identity online hadn't been refreshed to match the caliber
                      of their work.
                    </p>
                  </StickyNote>
                </motion.div>

                <motion.div
                  variants={popIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <StickyNote color="blue" rotate={-1}>
                    <AlertTriangle className="h-5 w-5 text-blue-400/60 mb-2" />
                    <p className="text-sm font-semibold text-foreground/80 mb-1">
                      Maintenance Overhead
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Constant plugin updates, security patches, hosting fees —
                      all just to keep the lights on, with no room to build the
                      custom features their operations actually needed.
                    </p>
                  </StickyNote>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Divider ── */}
        <div className="container max-w-4xl">
          <div className="h-px bg-border/20" />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 2: THE CHALLENGE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="container max-w-4xl py-20 lg:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">
                02 — The Challenge
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                You Can't Just "Replace" a Ranked Website
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="space-y-5 text-muted-foreground leading-relaxed max-w-2xl mb-12"
            >
              <p className="text-lg text-foreground/90">
                Rebuilding from scratch sounds simple — until you realize the
                old site is already ranking on Google, has years of indexed blog
                content, and the client needs to edit pages themselves.
              </p>
              <p>
                This wasn't just a redesign. It was a migration under live
                traffic, with zero room for SEO regression.
              </p>
            </motion.div>

            {/* ── Scrapbook: Challenge Cards ── */}
            <div className="space-y-6">
              {/* Challenge cards in a staggered scrapbook layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  variants={tiltLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-card/60 border border-border/30 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">SEO at Stake</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The existing site was already ranking for key
                      refrigeration service terms across Australia. A careless
                      migration could tank their search visibility overnight —
                      and with it, their primary lead generation channel.
                    </p>
                    {/* Decorative pin */}
                    <div className="absolute -top-2 right-6 w-4 h-4 rounded-full bg-red-500/20 border-2 border-red-500/40 shadow-sm" />
                  </div>
                </motion.div>

                <motion.div
                  variants={tiltRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-card/60 border border-border/30 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center">
                        <Server className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">100+ Blog Posts</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Years of content — service guides, industry insights,
                      how-to articles — all trapped inside WordPress. Each post
                      was a ranking asset. Losing even one meant losing organic
                      traffic they'd spent years building.
                    </p>
                    <div className="absolute -top-2 right-6 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500/40 shadow-sm" />
                  </div>
                </motion.div>

                <motion.div
                  variants={tiltRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative lg:col-span-2 lg:max-w-md lg:mx-auto"
                >
                  <div className="bg-card/60 border border-border/30 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center">
                        <PenTool className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Client Autonomy</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The Acro team needed to update content — new services,
                      seasonal promos, blog posts — without calling a developer
                      every time. Any solution had to put editing power directly
                      in their hands.
                    </p>
                    <div className="absolute -top-2 right-6 w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500/40 shadow-sm" />
                  </div>
                </motion.div>
              </div>

              {/* Annotation scribble — handwritten feel */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center pt-4"
              >
                <p className="text-sm italic text-muted-foreground/50 font-mono">
                  "Rebuild everything. Break nothing."
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Divider ── */}
        <div className="container max-w-4xl">
          <div className="h-px bg-border/20" />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 3: THE SOLUTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="container max-w-4xl py-20 lg:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">
                03 — The Solution
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                A Modern Stack. A Seamless Migration.
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="space-y-5 text-muted-foreground leading-relaxed max-w-2xl mb-12"
            >
              <p className="text-lg text-foreground/90">
                I chose a stack built for speed, scalability, and developer
                experience — then wrapped it in a custom CMS so the client could
                own their content without touching code.
              </p>
            </motion.div>

            {/* ── Tech Stack Breakdown ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16"
            >
              {[
                {
                  icon: Zap,
                  title: "Next.js + TypeScript",
                  desc: "Server-side rendering and static generation for blazing-fast page loads. Type safety across the entire codebase.",
                },
                {
                  icon: Server,
                  title: "Supabase",
                  desc: "PostgreSQL-powered backend with real-time capabilities. Stores all blog content, pages, and media — replacing WordPress entirely.",
                },
                {
                  icon: Gauge,
                  title: "Vercel Deployment",
                  desc: "Edge-optimized hosting with automatic CDN distribution. Pages load instantly from the nearest server to each Australian visitor.",
                },
                {
                  icon: PenTool,
                  title: "Custom CMS",
                  desc: "Built a tailored content management system so the Acro team can edit any page, publish blog posts, and manage media — no developer needed.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="bg-card/60 border border-border/30 rounded-lg p-5 space-y-2 hover:border-border/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">{title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Solution Image — Scrapbook Style ── */}
            <motion.div
              variants={tiltRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-lg mx-auto mb-12"
            >
              <ScrapbookImage
                src={solutionImage}
                alt="Screenshot: New Acro Refrigeration website — clean, fast, modern design"
                caption="The new site — sub-second load times, modern design"
                rotate="right"
                tapePosition="top"
              />
            </motion.div>

            {/* ── Key Solution Highlights ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="space-y-8 max-w-2xl"
            >
              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-semibold flex items-center gap-3 mb-3">
                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                  WordPress-to-Supabase Migration
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  I wasn't going to let years of content go to waste. Every
                  single blog post — formatting, images, metadata, and URLs —
                  was carefully migrated from WordPress into Supabase. The
                  content lived on, now powered by a faster, more flexible
                  backend. No broken links. No lost rankings.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-semibold flex items-center gap-3 mb-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  SEO-First Architecture
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  Every page was built with structured metadata, semantic HTML,
                  proper heading hierarchies, and optimized Core Web Vitals. I
                  set up 301 redirects across all legacy URLs to preserve link
                  equity, generated a comprehensive XML sitemap, and configured
                  Google Search Console to monitor indexing and ensure a smooth
                  transition. The speed improvement alone — from 8+ seconds to
                  under 1 — sent a powerful signal to Google.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-semibold flex items-center gap-3 mb-3">
                  <Lightbulb className="h-5 w-5 text-muted-foreground" />
                  Custom CMS for Non-Technical Users
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                  Instead of forcing the client onto another third-party
                  platform, I built a CMS tailored to exactly how the Acro team
                  works. They can update service pages, publish new blog posts,
                  manage images, and edit site content — all through a clean,
                  intuitive interface designed specifically for them.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Divider ── */}
        <div className="container max-w-4xl">
          <div className="h-px bg-border/20" />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 4: THE RESULTS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="container max-w-4xl py-20 lg:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={fadeUp} className="mb-12">
              <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">
                04 — The Results
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Faster. Sharper. Ranking Higher.
              </h2>
            </motion.div>

            {/* ── Result Metrics — Scrapbook Cards ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
              {[
                {
                  metric: "~10x",
                  label: "Faster Load Time",
                  sublabel: "15s → <2s",
                },
                {
                  metric: "100%",
                  label: "Content Migrated",
                  sublabel: "Zero posts lost",
                },
                {
                  metric: "0",
                  label: "SEO Rankings Lost",
                  sublabel: "Seamless transition",
                },
                {
                  metric: "Full",
                  label: "Client Control",
                  sublabel: "Custom CMS",
                },
              ].map(({ metric, label, sublabel }, i) => (
                <motion.div
                  key={label}
                  variants={popIn}
                  className="bg-card/60 border border-border/30 rounded-lg p-5 text-center space-y-1"
                  style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
                >
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {metric}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{sublabel}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Performance Before & After ── */}
            <motion.div variants={fadeUp} className="mb-12">
              <h3 className="text-lg font-semibold mb-6 text-center">
                PageSpeed Insights — Before & After
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  variants={tiltLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <ScrapbookImage
                    src={oldPerfImg}
                    alt="Old website performance assessment — Performance: 40, Accessibility: 91, Best Practices: 77, SEO: 85"
                    caption="Before — Feb 28, 2026"
                    rotate="left"
                    tapePosition="corner"
                  />
                </motion.div>
                <motion.div
                  variants={tiltRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <ScrapbookImage
                    src={newPerfImg}
                    alt="New website performance assessment — Performance: 93, Accessibility: 96, Best Practices: 100, SEO: 100"
                    caption="After — Apr 4, 2026"
                    rotate="right"
                    tapePosition="corner"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* ── Result Summary ── */}
            <motion.div
              variants={fadeUp}
              className="space-y-5 text-muted-foreground leading-relaxed max-w-2xl mb-12"
            >
              <p className="text-lg text-foreground/90">
                The new Acro Refrigeration website isn't just faster — it's a
                fundamentally better business tool.
              </p>
              <p>
                Pages that used to take 8 seconds to load now render in under a
                second. Every blog post made it through the migration intact,
                preserving years of SEO equity. And for the first time, the Acro
                team can update their own website without waiting on anyone.
              </p>
              <p>
                The improved Core Web Vitals and page speed sent a clear signal
                to Google — and combined with the SEO-optimized content
                architecture, the site is now positioned to rank even higher
                than before.
              </p>
            </motion.div>

            {/* ── Checklist — final scrapbook element ── */}
            <motion.div
              variants={tiltLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-md"
            >
              <StickyNote color="green" rotate={-1.5}>
                <p className="text-sm font-semibold text-foreground/80 mb-3">
                  Delivery Checklist
                </p>
                <div className="space-y-2">
                  {[
                    "Complete WordPress to Supabase data migration",
                    "Custom CMS with intuitive editing interface",
                    "301 redirects, XML sitemap & Google Search Console setup",
                    "Sub-second page load times on all pages",
                    "Mobile-first responsive design",
                    "Edge-deployed on Vercel CDN",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400/60 mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </StickyNote>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="container max-w-4xl py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-card/40 border border-border/20 rounded-xl p-8 sm:p-12 text-center space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Have a similar project in mind?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Whether it's a WordPress migration, a custom build, or a
              performance overhaul — let's talk about what your website could
              become.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Get in Touch
              </Link>
              <a
                href="https://www.acrorefrigeration.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md border border-border/40 text-foreground/80 hover:text-foreground hover:border-border/60 transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                View Live Site
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/20 py-8">
          <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 — Engineered with precision.</p>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link
                to="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
