import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STEPS = [
  { id: "event", label: "EVENT_SELECTED", title: "Select an Event" },
  { id: "bond", label: "STRUCTURED_BOND", title: "Enter via Structured Bond" },
  { id: "resolve", label: "OUTCOME_RESOLVES", title: "Outcome Resolves" },
  { id: "coupon", label: "COUPON_TRIGGERED", title: "Coupon Triggered by Outcome" },
] as const;

export const BondFlowDiagram = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const reducedMotion = usePrefersReducedMotion();
  const animate = inView && !reducedMotion;

  return (
    <div ref={ref} className="mt-12 w-full overflow-x-auto">
      <svg
        viewBox="0 0 920 140"
        className="mx-auto min-w-[640px] w-full max-w-4xl"
        aria-label="Bond structure flow: event to coupon"
        role="img"
      >
        {STEPS.slice(0, -1).map((_, i) => {
          const x1 = 80 + i * 220 + 88;
          const x2 = 80 + (i + 1) * 220 - 8;
          const y = 52;
          const pathLen = 100;
          return (
            <line
              key={`arrow-${i}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              className="landing-flow-line"
              strokeDasharray={pathLen}
              strokeDashoffset={animate ? 0 : pathLen}
              style={{
                transition: reducedMotion ? "none" : `stroke-dashoffset 0.9s ease ${i * 0.35}s`,
              }}
            />
          );
        })}

        {STEPS.map((step, i) => {
          const cx = 80 + i * 220;
          const active = animate;
          return (
            <g key={step.id}>
              <rect
                x={cx - 88}
                y={20}
                width={176}
                height={64}
                rx={4}
                fill="#16161f"
                stroke={active ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)"}
                strokeWidth={active ? 1.5 : 1}
                className={active && !reducedMotion ? "landing-flow-node--active" : undefined}
                style={
                  active && !reducedMotion
                    ? { animationDelay: `${i * 0.35}s`, transformOrigin: `${cx}px 52px` }
                    : undefined
                }
              />
              <text
                x={cx}
                y={42}
                textAnchor="middle"
                className="font-mono fill-[hsl(var(--accent))] text-[9px]"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {step.label}
              </text>
              <text
                x={cx}
                y={62}
                textAnchor="middle"
                fill="#e8ece9"
                fontSize="11"
                fontWeight="500"
              >
                {step.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
