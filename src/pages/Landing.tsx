import { Logo } from "@/components/Logo";
import "@/landing/landing.css";

const Landing = () => (
  <div className="landing-page">
    <a className="landing-skip" href="#main">Skip to content</a>
    <header className="landing-header">
      <a href="/" className="landing-brand" aria-label="Poonji home">
        <Logo className="h-10 w-10" />
        <span>poonji</span>
      </a>
      <span className="landing-status">Building in stealth</span>
    </header>

    <main id="main" className="landing-main">
      <p className="landing-eyebrow">A new dimension of financial markets</p>
      <h1>The world is conditional.<br /><em>Markets should be too.</em></h1>
      <p className="landing-intro">
        Poonji is building a platform for event-conditioned derivatives,
        giving institutional investors a more direct way to express their views.
      </p>
      <p className="landing-vision">
        Our vision: a market for the relationships between real-world events and financial assets.
      </p>
      <a className="landing-contact" href="mailto:gunjan@poonji.ai">
        Start a conversation <span aria-hidden="true">↗</span>
      </a>
    </main>

    <footer className="landing-footer">
      <span>Poonji</span>
      <p>In development. Not an offer or solicitation to buy or sell financial products.</p>
    </footer>
  </div>
);

export default Landing;
