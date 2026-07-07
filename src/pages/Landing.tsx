import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { NoteBuilder } from "@/components/landing/NoteBuilder";
import { WaitlistModal } from "@/components/landing/WaitlistModal";
import { HeroNetworkGraph } from "@/components/landing/HeroNetworkGraph";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import "@/landing/landing.css";

const FOOTER_DISCLAIMER =
  "Illustrative pricing only. Not an offer to sell or a solicitation to buy any security. Figures are indicative, assume the note is held to maturity, and exclude issuer credit risk, liquidity, and taxes. Poonji is the issuer.";

const Landing = () => {
  const progress = useScrollProgress();
  const [navScrolled, setNavScrolled] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

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
      <div className="landing-scroll-progress" aria-hidden>
        <div className="landing-scroll-progress__bar" style={{ width: `${progress * 100}%` }} />
      </div>

      <header
        className={`landing-reveal-nav fixed top-[2px] z-50 w-full transition-all duration-300 ${
          navScrolled ? "landing-nav-scrolled" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
          <a href="#hero" className="flex items-center gap-3" aria-label="Poonji home">
            <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="font-mono text-sm tracking-tight text-[var(--landing-text)] sm:text-base">
              poonji.ai
            </span>
          </a>

          <button
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="landing-glow-btn rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Create your own note
          </button>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="landing-grid-texture relative flex min-h-[70vh] items-center overflow-hidden border-b border-[hsl(var(--primary)/0.15)] pt-20"
        >
          <HeroNetworkGraph />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/40 to-[#0a0a0f]" />

          <div className="relative z-10 container mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))] sm:text-sm">
              Event-linked structured notes
            </p>
            <h1 className="landing-reveal-headline font-display mt-4 text-4xl leading-[1.08] text-[var(--landing-text)] sm:text-5xl md:text-6xl lg:text-7xl">
              &ldquo;Prediction-market upside. Principal protected.&rdquo;
            </h1>
            <p className="landing-reveal-subheadline mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--landing-text-muted)] sm:text-lg">
              Structured notes that pay a coupon on real-world event outcomes — Fed, elections, commodities, geopolitics — while protecting your principal.
            </p>
          </div>
        </section>

        <HowItWorks />
        <NoteBuilder />

        <section id="contact" className="border-b border-[hsl(var(--primary)/0.12)]">
          <div className="container mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <p className="text-base leading-relaxed text-[var(--landing-text-muted)] sm:text-lg">
              Building something with us? Reach out —{" "}
              <a
                href="mailto:gunjan@poonji.ai"
                className="text-[hsl(var(--accent))] underline-offset-4 transition-colors hover:underline"
              >
                gunjan@poonji.ai
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[hsl(var(--primary)/0.12)] bg-[#06060a]">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-4xl text-center font-mono text-xs leading-relaxed text-[var(--landing-text-muted)] sm:text-sm">
            {FOOTER_DISCLAIMER}
          </p>
        </div>
      </footer>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
};

export default Landing;
