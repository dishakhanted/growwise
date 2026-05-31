import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function useCountDown(from: number, to: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from - (from - to) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, from, to, duration]);

  return value;
}

export const MetricCounters = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reducedMotion = usePrefersReducedMotion();
  const active = inView;

  const principal = useCountDown(12, 0, active && !reducedMotion);
  const assetClasses = useCountUp(3, active && !reducedMotion);

  const principalDisplay = reducedMotion ? 0 : principal;
  const classesDisplay = reducedMotion ? 3 : assetClasses;

  return (
    <div ref={ref} className="mt-12 grid gap-6 sm:grid-cols-3">
      <div className="border border-[hsl(var(--primary)/0.2)] bg-[var(--landing-surface)] p-6 sm:p-8">
        <p className="font-mono text-3xl font-semibold text-[hsl(var(--accent))] sm:text-4xl">
          ${principalDisplay}
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--landing-text)]">Principal at Risk</p>
        <p className="mt-1 font-mono text-xs text-[var(--landing-text-muted)]">
          $0 directional exposure to principal
        </p>
      </div>

      <div className="border border-[hsl(var(--primary)/0.2)] bg-[var(--landing-surface)] p-6 sm:p-8">
        <p className="font-mono text-3xl font-semibold text-[hsl(var(--accent))] sm:text-4xl">
          {classesDisplay}
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--landing-text)]">Asset Classes</p>
        <p className="mt-1 font-mono text-xs text-[var(--landing-text-muted)]">
          Macro · Geopolitical · Credit
        </p>
      </div>

      <div className="border border-[hsl(var(--primary)/0.2)] bg-[var(--landing-surface)] p-6 sm:p-8">
        <p className="font-mono text-3xl font-semibold text-[hsl(var(--accent))] sm:text-4xl">IG</p>
        <p className="mt-2 text-sm font-medium text-[var(--landing-text)]">Institutional Grade</p>
        <p className="mt-1 font-mono text-xs text-[var(--landing-text-muted)]">
          Mandates · Compliance · Balance sheets
        </p>
      </div>
    </div>
  );
};
