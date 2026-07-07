const steps = [
  {
    number: "01",
    title: "Pick an event",
    description:
      "A real prediction-market outcome (Fed, elections, commodities, geopolitics, climate).",
  },
  {
    number: "02",
    title: "Protect your principal",
    description:
      "Choose how much of your capital is guaranteed back (0–100%). The rest funds the upside.",
  },
  {
    number: "03",
    title: "See your note",
    description:
      "If your side resolves true, you earn a coupon on top of your principal; if not, you get your protected principal back.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="border-b border-[hsl(var(--primary)/0.12)] bg-[var(--landing-surface)]">
      <div className="container mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">How it works</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="landing-solution-card p-6 sm:p-8">
              <span className="font-mono text-sm text-[hsl(var(--primary))]">{step.number}</span>
              <h3 className="mt-4 font-display text-xl text-[var(--landing-text)]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--landing-text-muted)]">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
