import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Logo } from "@/components/Logo";
import { AccessRequestForm } from "@/components/AccessRequestForm";
import { HeroNetworkGraph } from "@/components/landing/HeroNetworkGraph";
import { EventTicker } from "@/components/landing/EventTicker";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useInView } from "@/hooks/useInView";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import "@/landing/landing.css";

const BondFlowDiagram = lazy(() =>
  import("@/components/landing/BondFlowDiagram").then((m) => ({ default: m.BondFlowDiagram })),
);
const MetricCounters = lazy(() =>
  import("@/components/landing/MetricCounters").then((m) => ({ default: m.MetricCounters })),
);
const TeamCard = lazy(() =>
  import("@/components/landing/TeamCard").then((m) => ({ default: m.TeamCard })),
);

const solutionTiles = [
  {
    title: "Principal Protected",
    description:
      "Event exposure without directional risk to principal. Structured as bonds, not derivatives.",
  },
  {
    title: "Fits Existing Frameworks",
    description:
      "Usable for margin, repo, collateral, and balance sheet. No regulatory carve-outs needed.",
  },
  {
    title: "Event-Linked Coupons",
    description:
      "Macro and geopolitical outcomes directly trigger the coupon. Trade the event, not the sentiment.",
  },
];

const team = [
  {
    name: "Gunjan P Khanted",
    role: "CEO",
    bio: "Structured and sold FX and rates products to sovereign funds, hedge funds, and insurance companies across APAC at Deutsche Bank and HSBC. SRCC alumnus.",
    linkedIn: "https://linkedin.com/in/gunjankhanted",
  },
  {
    name: "Disha P Khanted",
    role: "CTO",
    bio: "Data engineer and AI/ML practitioner. Built large-scale data infrastructure and machine learning systems. Columbia University, MS.",
    linkedIn: "https://linkedin.com/in/dishakhanted",
  },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const SectionReveal = ({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) => {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.12 });
  const reducedMotion = usePrefersReducedMotion();
  const visible = inView || reducedMotion;

  return (
    <section
      id={id}
      ref={ref}
      className={`landing-section-lazy transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </section>
  );
};

const Landing = () => {
  const progress = useScrollProgress();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#0a0a0f";
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="landing-page min-h-screen">
      {/* Scroll progress */}
      <div className="landing-scroll-progress" aria-hidden>
        <div
          className="landing-scroll-progress__bar"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Nav */}
      <header
        className={`landing-reveal-nav fixed top-[2px] z-50 w-full transition-all duration-300 ${
          navScrolled ? "landing-nav-scrolled" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3"
            aria-label="Poonji home"
          >
            <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="font-mono text-sm tracking-tight text-[var(--landing-text)] sm:text-base">
              poonji.ai
            </span>
          </button>

          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="landing-ghost-btn flex h-10 w-10 items-center justify-center rounded-sm"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-[hsl(var(--primary)/0.2)] bg-[#0a0a0f] text-[var(--landing-text)]"
                >
                  <nav className="mt-8 flex flex-col gap-2">
                    {["problem", "solution", "how-it-works", "why-poonji", "team", "request-access"].map(
                      (id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            scrollToSection(id);
                            setMobileMenuOpen(false);
                          }}
                          className="py-3 text-left font-mono text-sm uppercase tracking-wider text-[var(--landing-text-muted)] hover:text-[hsl(var(--accent))]"
                        >
                          {id.replace(/-/g, " ")}
                        </button>
                      ),
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}

            <button
              type="button"
              onClick={() => scrollToSection("request-access")}
              className="landing-ghost-btn rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Request Access
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          id="hero"
          className="landing-grid-texture relative min-h-[92vh] overflow-hidden border-b border-[hsl(var(--primary)/0.15)] pt-20"
        >
          <HeroNetworkGraph />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/40 to-[#0a0a0f]" />

          <div className="relative z-10 container mx-auto flex min-h-[calc(92vh-5rem)] max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))] sm:text-sm">
              Event-linked credit infrastructure
            </p>

            <h1 className="landing-reveal-headline font-display mt-5 max-w-4xl text-4xl leading-[1.08] text-[var(--landing-text)] sm:text-5xl md:text-6xl lg:text-7xl">
              Prediction Markets.
              <br />
              Institutional Grade.
            </h1>

            <p className="landing-reveal-subheadline mt-6 max-w-2xl text-base leading-relaxed text-[var(--landing-text-muted)] sm:text-lg lg:text-xl">
              Poonji wraps event-driven exposure into principal-protected structured bonds —
              tradable instruments that fit inside existing mandates, risk frameworks, and balance
              sheets.
            </p>

            <div className="landing-reveal-cta mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => scrollToSection("request-access")}
                className="landing-glow-btn rounded-sm px-8 py-3.5 font-mono text-sm uppercase tracking-wider"
              >
                Request Access
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("problem")}
                className="landing-ghost-btn rounded-sm px-8 py-3.5 font-mono text-sm uppercase tracking-wider"
              >
                Learn More ↓
              </button>
            </div>

            <div
              className="mt-14 h-px w-full max-w-md"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--accent)), transparent)`,
                boxShadow: "0 0 20px hsl(var(--primary) / 0.4)",
              }}
              aria-hidden
            />
          </div>
        </section>

        <EventTicker />

        {/* Problem */}
        <SectionReveal id="problem" className="border-b border-[hsl(var(--primary)/0.12)]">
          <div className="container mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
              The Problem
            </p>
            <div className="mt-8 flex gap-6 sm:gap-8">
              <div className="landing-accent-rule shrink-0 self-stretch min-h-[120px]" aria-hidden />
              <blockquote className="font-display text-2xl leading-snug text-[var(--landing-text)] sm:text-3xl lg:text-4xl lg:leading-snug">
                Institutions want to express macro and geopolitical views directly. But binary,
                all-or-nothing prediction market contracts don&apos;t fit institutional mandates,
                compliance structures, or risk frameworks.
              </blockquote>
            </div>
          </div>
        </SectionReveal>

        {/* Solution */}
        <SectionReveal id="solution" className="border-b border-[hsl(var(--primary)/0.12)] bg-[var(--landing-surface)]">
          <div className="container mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
              The Solution
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {solutionTiles.map((tile) => (
                <article key={tile.title} className="landing-solution-card p-6 sm:p-8">
                  <span className="font-mono text-lg text-[hsl(var(--primary))]" aria-hidden>
                    ⬡
                  </span>
                  <h3 className="mt-4 font-display text-xl text-[var(--landing-text)]">{tile.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--landing-text-muted)]">
                    {tile.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* How It Works */}
        <SectionReveal id="how-it-works" className="border-b border-[hsl(var(--primary)/0.12)]">
          <div className="container mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
              How It Works
            </p>
            <p className="mt-3 max-w-2xl text-sm text-[var(--landing-text-muted)]">
              From event selection to coupon settlement — a principal-protected bond pathway built
              for institutional workflows.
            </p>
            <Suspense fallback={<div className="mt-12 h-32 animate-pulse bg-[var(--landing-surface)]" />}>
              <BondFlowDiagram />
            </Suspense>
          </div>
        </SectionReveal>

        {/* Why Poonji */}
        <SectionReveal id="why-poonji" className="border-b border-[hsl(var(--primary)/0.12)] bg-[var(--landing-surface)]">
          <div className="container mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
              Why Poonji
            </p>
            <p className="mt-6 font-display text-xl leading-relaxed text-[var(--landing-text)] sm:text-2xl lg:text-3xl">
              Our edge is the infrastructure — market structure, legal structuring, and regulatory
              precedent required to make event-linked credit products institutionally investable.
            </p>
            <Suspense fallback={<div className="mt-12 h-40 animate-pulse bg-[#0a0a0f]" />}>
              <MetricCounters />
            </Suspense>
          </div>
        </SectionReveal>

        {/* Team */}
        <SectionReveal id="team" className="border-b border-[hsl(var(--primary)/0.12)]">
          <div className="container mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
              Team
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Suspense
                fallback={
                  <>
                    <div className="h-48 animate-pulse bg-[var(--landing-surface)]" />
                    <div className="h-48 animate-pulse bg-[var(--landing-surface)]" />
                  </>
                }
              >
                {team.map((member) => (
                  <TeamCard key={member.name} {...member} />
                ))}
              </Suspense>
            </div>
          </div>
        </SectionReveal>

        {/* Request Access */}
        <SectionReveal id="request-access">
          <div className="container mx-auto max-w-lg px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="border border-[hsl(var(--primary)/0.25)] bg-[var(--landing-surface-elevated)] p-8 shadow-[0_0_40px_hsl(var(--primary)/0.08)] sm:p-10">
              <h2 className="font-display text-center text-2xl text-[var(--landing-text)] sm:text-3xl">
                Request Access
              </h2>
              <p className="mt-2 text-center text-sm text-[var(--landing-text-muted)]">
                Built for institutional investors.
              </p>
              <div className="mt-8 [&_label]:text-[var(--landing-text-muted)] [&_input]:border-[hsl(var(--primary)/0.25)] [&_input]:bg-[#0a0a0f] [&_input]:text-[var(--landing-text)] [&_button]:landing-glow-btn [&_button]:rounded-sm [&_button]:font-mono [&_button]:uppercase [&_button]:tracking-wider">
                <AccessRequestForm />
              </div>
              <p className="mt-4 text-center font-mono text-[10px] text-[var(--landing-text-muted)] sm:text-xs">
                We&apos;ll be in touch within 48 hours.
              </p>
            </div>
          </div>
        </SectionReveal>
      </main>

      <footer className="border-t border-[hsl(var(--primary)/0.12)] bg-[#06060a]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-mono text-xs text-[var(--landing-text-muted)]">poonji.ai</span>
          </div>
          <p className="font-mono text-xs text-[var(--landing-text-muted)]">© 2026 Poonji</p>
          <nav className="flex items-center gap-6 font-mono text-xs text-[var(--landing-text-muted)]">
            <a
              href="mailto:legal@poonji.ai?subject=Privacy%20Policy"
              className="transition-colors hover:text-[hsl(var(--accent))]"
            >
              Privacy Policy
            </a>
            <a
              href="mailto:legal@poonji.ai?subject=Terms%20of%20Service"
              className="transition-colors hover:text-[hsl(var(--accent))]"
            >
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
