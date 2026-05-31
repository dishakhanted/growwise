const TICKER_ITEMS = [
  "ELECTION_2024: RESOLVED ✓",
  "FED_HIKE_Q3: PENDING",
  "GEOPOLITICAL_RISK_EU: ACTIVE",
  "CREDIT_EVENT_HY: STRUCTURED",
  "RATE_PATH_2026: MONITORING",
  "SOVEREIGN_SPREAD_APAC: ACTIVE",
];

const TICKER_TEXT = TICKER_ITEMS.map((item) => `${item} ·`).join(" ");

export const EventTicker = () => (
  <div
    className="relative overflow-hidden border-y border-[hsl(var(--primary)/0.2)] bg-[#06060a] py-3"
    aria-hidden
  >
    <div className="landing-ticker-track flex w-max whitespace-nowrap">
      {[0, 1].map((copy) => (
        <span
          key={copy}
          className="font-mono px-6 text-xs tracking-wide text-[hsl(var(--accent))] sm:text-sm"
        >
          {TICKER_TEXT}
        </span>
      ))}
    </div>
  </div>
);
