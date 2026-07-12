
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  SiHtml5, SiCss, SiJavascript, SiReact, SiTailwindcss, SiBootstrap,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiPython,
  SiGit, SiGithub, SiFigma, SiWordpress, SiMeta,
} from "react-icons/si";
const SiCss3 = SiCss;
import { VscCode } from "react-icons/vsc";
import {
  FiArrowUpRight, FiDownload, FiMail, FiMapPin, FiPhone, FiGithub,
  FiExternalLink, FiSearch, FiShare2, FiBriefcase, FiAward,
} from "react-icons/fi";

const resumeAsset = "/resume.pdf";

/* ---------------- Custom Cursor ---------------- */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    let rx = 0, ry = 0, tx = 0, ty = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;
      if (spot.current) spot.current.style.transform = `translate(${tx - 250}px, ${ty - 250}px)`;
    };
    const loop = () => {
      rx += (tx - rx) * 0.15; ry += (ty - ry) * 0.15;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    const raf = requestAnimationFrame(loop);
    const over = () => ring.current?.classList.add("scale-150");
    const out = () => ring.current?.classList.remove("scale-150");
    document.querySelectorAll("a,button,[data-magnetic]").forEach(el => {
      el.addEventListener("mouseenter", over); el.addEventListener("mouseleave", out);
    });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={spot} className="pointer-events-none fixed left-0 top-0 z-[60] h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 60%)" }} />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 rounded-full border border-[#06B6D4] transition-transform duration-200 ease-out mix-blend-difference"
        style={{ boxShadow: "0 0 20px #06B6D4, 0 0 40px #3B82F6" }} />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[70] h-2 w-2 rounded-full bg-white"
        style={{ boxShadow: "0 0 12px #fff, 0 0 24px #3B82F6" }} />
    </>
  );
}

/* ---------------- Scroll Progress ---------------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, v => `${v * 100}%`);
  return (
    <motion.div style={{ width }} className="fixed inset-x-0 top-0 z-[80] h-[3px] grad-bg" />
  );
}

/* ---------------- Loader ---------------- */
function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 1400); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
          <motion.div
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
            className="font-mono text-3xl font-bold grad-text">GKJ</motion.div>
          <div className="mt-6 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
            <div className="h-full grad-bg" style={{ animation: "progress-bar 1.3s ease forwards" }} />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading portfolio</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Reveal ---------------- */
function Reveal({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ---------------- Magnetic Button ---------------- */
function Magnetic({ children, className = "", href, onClick, primary = false, download = false }: {
  children: ReactNode; className?: string; href?: string; onClick?: () => void; primary?: boolean; download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e: MouseEvent) => {
    const r = (ref.current as HTMLElement).getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  const cls = `group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
    primary ? "text-white grad-bg shadow-[0_10px_40px_-10px_rgba(59,130,246,0.7)]"
            : "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
  } ${className}`;
  const inner = (
    <motion.span style={{ x: sx, y: sy }} className="inline-flex items-center gap-2">{children}</motion.span>
  );
  if (href) return (
    <motion.a ref={ref as never} href={href} download={download} data-magnetic
      onMouseMove={onMove} onMouseLeave={onLeave} className={cls}>{inner}</motion.a>
  );
  return (
    <motion.button ref={ref as never} onClick={onClick} data-magnetic
      onMouseMove={onMove} onMouseLeave={onLeave} className={cls}>{inner}</motion.button>
  );
}

/* ---------------- Nav ---------------- */
const NAV = ["Home","About","Skills","Projects","Experience","Education","Contact"] as const;

function Nav() {
  const [active, setActive] = useState("Home");
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && setActive(e.target.id));
    }, { rootMargin: "-40% 0px -55% 0px" });
    NAV.forEach(n => { const el = document.getElementById(n); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass flex items-center gap-1 rounded-full px-2 py-2">
        <a href="#Home" className="mx-2 font-mono text-sm font-bold grad-text">GKJ.</a>
        <div className="hidden md:flex">
          {NAV.map(item => (
            <a key={item} href={`#${item}`} className={`relative rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              active === item ? "text-white" : "text-muted-foreground hover:text-white"
            }`}>
              {active === item && (
                <motion.span layoutId="pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" />
              )}
              {item}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

/* ---------------- Background ---------------- */
function BgBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob absolute -left-40 top-10 h-[500px] w-[500px] rounded-full" style={{ background: "#3B82F6" }} />
      <div className="blob absolute right-[-10%] top-1/3 h-[600px] w-[600px] rounded-full" style={{ background: "#8B5CF6", animationDelay: "-6s" }} />
      <div className="blob absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full" style={{ background: "#06B6D4", animationDelay: "-12s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B1120_75%)]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
    </div>
  );
}

/* Floating tech icons scattered */
function FloatingIcons() {
  const icons = [SiReact, SiNodedotjs, SiJavascript, SiPython, SiMongodb, SiFigma, SiTailwindcss, SiGithub];
  const positions = [
    { top: "12%", left: "6%" }, { top: "22%", right: "8%" },
    { top: "48%", left: "4%" }, { top: "58%", right: "5%" },
    { top: "75%", left: "10%" }, { top: "85%", right: "12%" },
    { top: "32%", left: "45%" }, { top: "68%", right: "40%" },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] hidden lg:block">
      {icons.map((Icon, i) => (
        <div key={i} className="absolute floaty text-white/10" style={{ ...positions[i], animationDelay: `${i * 0.7}s`, fontSize: 44 }}>
          <Icon />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="Home" className="relative flex min-h-screen items-center pt-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#06B6D4]" />
              Available for freelance & full-time
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Gaurav <span className="grad-text">Kumar Jha</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-2xl font-medium text-white/90 sm:text-3xl">
              Full Stack Developer
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Building modern, scalable, and user-focused web applications — from crisp landing pages to full-stack products.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic href="#Projects" primary>View Projects <FiArrowUpRight /></Magnetic>
              <Magnetic href={resumeAsset} download>Download Resume <FiDownload /></Magnetic>
              <Magnetic href="#Contact">Contact Me <FiMail /></Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.55}>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { k: "3+", v: "Years coding" },
                { k: "10+", v: "Projects shipped" },
                { k: "95+", v: "Lighthouse score" },
              ].map(s => (
                <div key={s.v}>
                  <dt className="text-3xl font-bold grad-text">{s.k}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.2} y={40}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 rounded-[2rem] grad-bg opacity-30 blur-3xl" />
            <div className="absolute inset-0 spin-slow rounded-[2rem] border border-dashed border-white/10" />
            <div className="glass relative h-full w-full overflow-hidden rounded-[2rem] p-2">
              <img src="/gaurav.jpeg" alt="Portrait of Gaurav Kumar Jha"
                className="h-full w-full rounded-[1.6rem] object-cover" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-black/50 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Currently</p>
                  <p className="text-sm font-medium">Kathmandu, Nepal</p>
                </div>
                <FiMapPin className="text-[#06B6D4]" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Section Title ---------------- */
function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-14 max-w-2xl">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#06B6D4]">// {eyebrow}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.2}>
          <p className="mt-4 text-muted-foreground">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="About" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="About" title="Engineer, builder, marketer." />
        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal>
            <div className="glass rounded-2xl p-6">
              <FiBriefcase className="mb-4 h-6 w-6 text-[#3B82F6]" />
              <h3 className="text-lg font-semibold">Full-stack focused</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                I ship end-to-end — from React interfaces to Node/Express APIs and MongoDB / MySQL data layers.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6">
              <FiSearch className="mb-4 h-6 w-6 text-[#8B5CF6]" />
              <h3 className="text-lg font-semibold">SEO + Marketing</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sites that rank and convert. Meta Ads, SEO, and social campaigns baked into the build.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass rounded-2xl p-6">
              <FiAward className="mb-4 h-6 w-6 text-[#06B6D4]" />
              <h3 className="text-lg font-semibold">Engineering student</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                BEI at Advanced College of Engineering & Management (TU) — combining theory with real client work.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-white/80">
            Motivated engineering student with a strong foundation in web development, software design, and digital
            technologies. Passionate about building <span className="grad-text font-semibold">scalable, user-centric solutions</span> and
            continuously exploring emerging technologies to solve real-world challenges.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */
const SKILL_GROUPS = [
  { name: "Frontend", color: "#3B82F6", items: [
    { n: "HTML5", i: SiHtml5 }, { n: "CSS3", i: SiCss3 }, { n: "JavaScript", i: SiJavascript },
    { n: "React", i: SiReact }, { n: "Tailwind CSS", i: SiTailwindcss }, { n: "Bootstrap", i: SiBootstrap },
  ]},
  { name: "Backend", color: "#8B5CF6", items: [
    { n: "Node.js", i: SiNodedotjs }, { n: "Express.js", i: SiExpress },
  ]},
  { name: "Database", color: "#06B6D4", items: [
    { n: "MongoDB", i: SiMongodb }, { n: "MySQL", i: SiMysql },
  ]},
  { name: "Programming", color: "#3B82F6", items: [
    { n: "Python", i: SiPython },
  ]},
  { name: "Tools", color: "#8B5CF6", items: [
    { n: "Git", i: SiGit }, { n: "GitHub", i: SiGithub }, { n: "VS Code", i: VscCode },
    { n: "Figma", i: SiFigma }, { n: "WordPress", i: SiWordpress },
  ]},
  { name: "Digital Marketing", color: "#06B6D4", items: [
    { n: "SEO", i: FiSearch }, { n: "Meta Ads", i: SiMeta }, { n: "Social Media", i: FiShare2 },
  ]},
];

function Skills() {
  return (
    <section id="Skills" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Skills" title="The full stack, plus the growth side." sub="A toolbox I use to design, build, launch and grow web products." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((g, gi) => (
            <Reveal key={g.name} delay={gi * 0.05}>
              <div className="glass group h-full rounded-2xl p-6 transition-colors hover:border-white/20">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ background: g.color, boxShadow: `0 0 12px ${g.color}` }} />
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{g.name}</h3>
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  {g.items.map(({ n, i: Icon }) => (
                    <li key={n} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]">
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" style={{ color: g.color }} />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects: circular rotating gallery + tilt cards ---------------- */
const PROJECTS = [
  {
    title: "Digital AP Creatives",
    kind: "Digital Marketing Agency",
    desc: "Responsive agency website with modern landing pages, optimized UX, and lead-gen funnels.",
    tags: ["WordPress", "SEO", "Landing Pages"],
    accent: "#3B82F6",
  },
  {
    title: "EcoBox Container House",
    kind: "Corporate Website",
    desc: "Professional site showcasing modular container homes and prefab construction, SEO-friendly and responsive.",
    tags: ["Web Dev", "SEO", "Branding"],
    accent: "#8B5CF6",
  },
  {
    title: "Personal Portfolio",
    kind: "Frontend Showcase",
    desc: "This site — animated, glassmorphic, and built with React, Tailwind, and Framer Motion.",
    tags: ["React", "Tailwind", "Framer Motion"],
    accent: "#06B6D4",
  },
];

function TiltCard({ p, index }: { p: typeof PROJECTS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ ry: (px - 0.5) * 14, rx: -(py - 0.5) * 14, mx: px * 100, my: py * 100 });
  };
  const reset = () => setT({ rx: 0, ry: 0, mx: 50, my: 50 });
  return (
    <Reveal delay={index * 0.08}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}
        className="glass group relative h-full overflow-hidden rounded-3xl p-8 transition-transform duration-200 will-change-transform"
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(600px circle at ${t.mx}% ${t.my}%, ${p.accent}22, transparent 40%)` }} />
        <div className="mb-8 flex items-start justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            0{index + 1} / {PROJECTS.length.toString().padStart(2, "0")}
          </span>
          <div className="h-10 w-10 rounded-full grad-bg opacity-80" style={{ background: `linear-gradient(135deg, ${p.accent}, #8B5CF6)` }} />
        </div>
        <p className="text-xs uppercase tracking-widest" style={{ color: p.accent }}>{p.kind}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">{p.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map(tag => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/80">{tag}</span>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs text-muted-foreground">Live case</span>
          <FiExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Reveal>
  );
}

function Projects() {
  return (
    <section id="Projects" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Selected work" title="Projects that ship." sub="A rotating gallery of real client and personal builds." />
        {/* Circular rotating gallery */}
        <div className="relative mx-auto mb-20 hidden h-[280px] w-[280px] md:block">
          <div className="absolute inset-0 spin-slow">
            {PROJECTS.map((p, i) => {
              const angle = (i / PROJECTS.length) * Math.PI * 2;
              const x = Math.cos(angle) * 120; const y = Math.sin(angle) * 120;
              return (
                <div key={p.title} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                  <div className="glass flex h-24 w-24 flex-col items-center justify-center rounded-2xl p-2 text-center">
                    <div className="h-3 w-3 rounded-full" style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }} />
                    <p className="mt-2 text-[10px] font-medium leading-tight">{p.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="glass flex h-28 w-28 items-center justify-center rounded-full">
              <span className="font-mono text-xs uppercase tracking-widest text-[#06B6D4]">Work</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => <TiltCard key={p.title} p={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Experience ---------------- */
const EXP = [
  {
    role: "Sales Manager",
    company: "EcoBox Container House",
    place: "Kathmandu, Nepal",
    period: "2026 — Present",
    points: [
      "Managed B2B and B2C sales of container homes, portable offices, and modular solutions.",
      "Prepared quotations, negotiated contracts, and coordinated with international suppliers end-to-end.",
      "Ran digital marketing: website content, Meta Ads, social campaigns, and lead generation.",
      "Produced marketing materials, product decks, and promo videos in Canva and CapCut.",
    ],
  },
  {
    role: "Freelance Web Developer & Digital Marketing",
    company: "Self-employed",
    place: "Remote",
    period: "Ongoing",
    points: [
      "Designed and shipped responsive business websites using modern web technologies.",
      "Managed social media content and paid campaigns for small businesses.",
      "Created graphics, promotional videos, and branding materials from scratch.",
    ],
  },
];

function Experience() {
  return (
    <section id="Experience" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Experience" title="Where I've been building." />
        <div className="relative ml-2 border-l border-white/10 pl-8">
          {EXP.map((e, i) => (
            <Reveal key={e.role} delay={i * 0.1}>
              <div className="relative mb-12 last:mb-0">
                <span className="absolute -left-[41px] top-2 flex h-4 w-4 items-center justify-center rounded-full grad-bg ring-4 ring-background" />
                <p className="font-mono text-xs uppercase tracking-widest text-[#06B6D4]">{e.period}</p>
                <h3 className="mt-1 text-2xl font-semibold">{e.role}</h3>
                <p className="text-sm text-muted-foreground">{e.company} · {e.place}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {e.points.map(pt => (
                    <li key={pt} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />{pt}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Education ---------------- */
function Education() {
  return (
    <section id="Education" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Education" title="Formal training." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass rounded-2xl p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#06B6D4]">2026 — Present · 6th Sem</p>
              <h3 className="mt-2 text-xl font-semibold">B.E. in Electronics, Communication & Information Engineering</h3>
              <p className="mt-1 text-muted-foreground">Advanced College of Engineering and Management · TU Affiliated</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#8B5CF6]">Certifications</p>
              <ul className="mt-4 space-y-3 text-sm">
                {["Digital Marketing (Self-learned)", "Web Development", "Python Programming"].map(c => (
                  <li key={c} className="flex items-center gap-3">
                    <FiAward className="h-4 w-4 text-[#06B6D4]" /> {c}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-[#8B5CF6]">Languages</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["English", "Nepali", "Maithali"].map(l => (
                  <span key={l} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs">{l}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const [state, setState] = useState<"idle" | "sent">("idle");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name"); const email = fd.get("email"); const msg = fd.get("message");
    const body = `Hi Gaurav,%0D%0A%0D%0A${msg}%0D%0A%0D%0A— ${name} (${email})`;
    window.location.href = `mailto:zhamohan@gmail.com?subject=Portfolio contact from ${name}&body=${body}`;
    setState("sent");
  };
  return (
    <section id="Contact" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Contact" title="Let's build something." sub="Open to freelance work, collaborations, and full-time roles." />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-8">
              <div className="space-y-5">
                <a href="mailto:zhamohan@gmail.com" className="flex items-start gap-4 text-sm hover:text-white">
                  <span className="grid h-10 w-10 place-items-center rounded-full grad-bg"><FiMail /></span>
                  <span><p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>zhamohan@gmail.com</span>
                </a>
                <a href="tel:+9779840689591" className="flex items-start gap-4 text-sm hover:text-white">
                  <span className="grid h-10 w-10 place-items-center rounded-full grad-bg"><FiPhone /></span>
                  <span><p className="text-xs uppercase tracking-widest text-muted-foreground">Phone</p>+977 984-068-9591</span>
                </a>
                <div className="flex items-start gap-4 text-sm">
                  <span className="grid h-10 w-10 place-items-center rounded-full grad-bg"><FiMapPin /></span>
                  <span><p className="text-xs uppercase tracking-widest text-muted-foreground">Location</p>Kathmandu, Nepal</span>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Magnetic href="https://github.com/" className="!px-4 !py-2 text-xs"><FiGithub /> GitHub</Magnetic>
                <Magnetic href={resumeAsset} download className="!px-4 !py-2 text-xs"><FiDownload /> Resume</Magnetic>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="glass grid gap-4 rounded-3xl p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
                  <input required name="name" className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
                  <input required type="email" name="email" className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
                <textarea required name="message" rows={5} className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30" />
              </label>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{state === "sent" ? "Opening your email client…" : "Usually replies within 24 hours."}</p>
                <Magnetic primary onClick={() => {}}><button type="submit" className="inline-flex items-center gap-2">Send message <FiArrowUpRight /></button></Magnetic>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted-foreground sm:flex-row">
        <p> {new Date().getFullYear()} <p>
  © Gaurav Kumar Jha. Designed & Developed by Gaurav.
</p></p>
        <p className="font-mono">LEGACY ✦</p>
      </div>
    </footer>
  );
}

/* ---------------- Root ---------------- */
function Portfolio() {
  return (
    <div className="relative">
      <Loader />
      <ScrollProgress />
      <CustomCursor />
      <BgBlobs />
      <FloatingIcons />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
export default Portfolio;