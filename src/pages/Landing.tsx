import { Logo } from "@/components/Logo";
import "@/landing/landing.css";

const Landing = () => (
  <div className="landing-page">
    <a className="landing-skip" href="#main">Skip to content</a>
    <header className="landing-header">
      <a href="/" className="landing-brand" aria-label="Poonji home">
        <span>poonji</span>
      </a>
    </header>

    <main id="main" className="landing-main">
      <h1>Events already move markets.<br /><em>Now, trade the relationship.</em></h1>
      <div className="landing-copy">
        <p className="landing-intro">
          Poonji is building event-conditioned derivatives that let institutional
          investors continuously trade the relationships between real-world events
          and financial assets.
        </p>
        <p className="landing-vision">
          Our ambition: make event conditionality a foundational part of financial markets.
        </p>
      </div>
      <a className="landing-contact" href="mailto:gunjan@poonji.ai">
        Start a conversation <span aria-hidden="true">↗</span>
      </a>
    </main>
    <footer className="landing-footer">
      <Logo className="landing-logo h-8 w-8" />
      <small>© {new Date().getFullYear()} Poonji. All rights reserved.</small>
    </footer>
  </div>
);

export default Landing;
