import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const NODES = [
  { id: "fed", label: "Fed Rate Decision", x: 120, y: 90 },
  { id: "election", label: "Election Outcome", x: 380, y: 60 },
  { id: "credit", label: "Credit Event", x: 620, y: 110 },
  { id: "geo", label: "Geopolitical Shock", x: 400, y: 220 },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [0, 3],
  [2, 3],
  [0, 2],
];

type HeroNetworkGraphProps = {
  className?: string;
};

export const HeroNetworkGraph = ({ className = "" }: HeroNetworkGraphProps) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <svg
      className={`landing-reveal-graph pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 800 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {EDGES.map(([a, b], i) => {
        const from = NODES[a];
        const to = NODES[b];
        return (
          <line
            key={`${from.id}-${to.id}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={reducedMotion ? "landing-flow-line" : "landing-flow-line landing-flow-line--animate"}
            style={reducedMotion ? undefined : { animationDelay: `${i * 0.35}s` }}
          />
        );
      })}

      {NODES.map((node, i) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="28" fill="url(#node-glow)" />
          <circle
            cx={node.x}
            cy={node.y}
            r="5"
            fill="hsl(var(--accent))"
            className={reducedMotion ? undefined : "landing-flow-node--active"}
            style={reducedMotion ? undefined : { animationDelay: `${i * 0.5}s` }}
          />
          <text
            x={node.x}
            y={node.y + 22}
            textAnchor="middle"
            className="font-mono fill-[#8a9590] text-[9px] sm:text-[10px]"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
