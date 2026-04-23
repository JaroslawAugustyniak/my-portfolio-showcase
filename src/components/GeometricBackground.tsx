import { useEffect, useState } from "react";

/**
 * Decorative animated geometric background with parallax on scroll.
 * Pure decoration — pointer-events: none.
 */
const GeometricBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const slow = scrollY * 0.15;
  const mid = scrollY * 0.3;
  const fast = scrollY * 0.5;

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: `translateY(${slow * 0.3}px)`,
        }}
      />

      {/* Slow layer */}
      <div className="absolute inset-0" style={{ transform: `translate3d(0, ${-slow}px, 0)` }}>
        <div className="absolute top-[8%] left-[6%] w-12 h-12 border-2 border-primary/40 rounded animate-float-slow" />
        <svg className="absolute top-[14%] right-[10%] w-16 h-16 animate-float-medium" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="hsl(var(--accent) / 0.5)" strokeWidth="3" />
        </svg>
        <div className="absolute top-[40%] left-[78%] w-32 h-32 rounded-full border border-secondary/25 animate-pulse-soft" />
        <div className="absolute top-[120%] left-[15%] w-20 h-20 border-2 border-accent/30 rotate-45 animate-float-medium" />
        <svg className="absolute top-[180%] right-[12%] w-20 h-20 animate-float-slow" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="hsl(var(--primary) / 0.18)" />
        </svg>
      </div>

      {/* Mid layer */}
      <div className="absolute inset-0" style={{ transform: `translate3d(0, ${-mid}px, 0)` }}>
        <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-primary/60 rotate-45 animate-float-fast" />
        <svg className="absolute top-[55%] left-[12%] w-10 h-10 animate-float-slow" viewBox="0 0 100 100">
          <polygon points="50,5 95,95 5,95" fill="hsl(var(--secondary) / 0.35)" />
        </svg>
        <svg className="absolute top-[25%] right-[25%] w-40 h-40" viewBox="0 0 200 200">
          <line x1="0" y1="0" x2="200" y2="200" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" strokeDasharray="6 8" className="animate-drift-line" />
        </svg>
        <div className="absolute top-[70%] right-[8%] w-20 h-20 border border-accent/40 rotate-12 animate-float-medium" />
        <div className="absolute top-[140%] left-[60%] w-6 h-6 bg-accent/40 rotate-45 animate-float-fast" />
        <svg className="absolute top-[160%] left-[8%] w-32 h-32" viewBox="0 0 200 200">
          <line x1="200" y1="0" x2="0" y2="200" stroke="hsl(var(--secondary) / 0.4)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-drift-line" />
        </svg>
      </div>

      {/* Fast layer */}
      <div className="absolute inset-0" style={{ transform: `translate3d(0, ${-fast}px, 0)` }}>
        <div className="absolute top-[18%] left-[45%] w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
        <div className="absolute top-[60%] left-[55%] w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-soft" />
        <div className="absolute top-[85%] left-[30%] w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
        <div className="absolute top-[45%] right-[40%] w-4 h-4 border-2 border-secondary/70 rotate-45 animate-float-fast" />
        <svg className="absolute top-[78%] left-[60%] w-48 h-4" viewBox="0 0 200 10">
          <line x1="0" y1="5" x2="200" y2="5" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1" strokeDasharray="4 6" className="animate-drift-line" />
        </svg>
        <svg className="absolute top-[5%] left-[70%] w-8 h-8 animate-float-medium" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="4" />
        </svg>
        <div className="absolute top-[130%] right-[30%] w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
        <div className="absolute top-[170%] left-[40%] w-3 h-3 rounded-full bg-accent/70 animate-pulse-soft" />
      </div>
    </div>
  );
};

export default GeometricBackground;
