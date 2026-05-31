import { Linkedin } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRef } from "react";

type TeamCardProps = {
  name: string;
  role: string;
  bio: string;
  linkedIn: string;
};

export const TeamCard = ({ name, role, bio, linkedIn }: TeamCardProps) => {
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  };

  return (
    <article
      ref={cardRef}
      className="landing-team-card group relative p-6 sm:p-8"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <a
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-sm border border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] hover:shadow-[0_0_12px_hsl(var(--primary)/0.35)]"
        aria-label={`${name} on LinkedIn`}
      >
        <Linkedin className="h-4 w-4" />
      </a>

      <h3 className="font-display text-xl text-[var(--landing-text)] sm:text-2xl">{name}</h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
        {role}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--landing-text-muted)] sm:text-base">
        {bio}
      </p>
    </article>
  );
};
