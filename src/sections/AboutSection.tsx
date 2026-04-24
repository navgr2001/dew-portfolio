import { useEffect, useRef, useState } from "react";
import { AnimatedCard } from "../components/AnimatedCard";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { designer } from "../data/content";

type StatItemProps = {
  value: number;
  label: string;
  suffix?: string;
  durationMs?: number;
};

function StatItem({
  value,
  label,
  suffix = "+",
  durationMs = 1400,
}: StatItemProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || hasStarted) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    let animationFrameId = 0;
    let startTime: number | null = null;

    const updateValue = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      const nextValue = Math.round(progress * value);

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(updateValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [durationMs, hasStarted, value]);

  return (
    <div
      ref={containerRef}
      className="rounded-3xl border border-white/10 bg-white/5 p-5"
    >
      <p className="text-3xl font-semibold text-white">
        {displayValue}
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
        {label}
      </p>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="About Me"
            title="My Goal
"
            description="Bringing beauty into real life. A modern house or living space should reflect the personality of the owner."
          />

          <AnimatedCard className="p-8 sm:p-10">
            <p className="text-base leading-8 text-zinc-300 sm:text-lg">
              {designer.about}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatItem value={2} label="Years" />
              <StatItem value={18} label="Concepts" />
              <StatItem value={10} label="Clients" />
            </div>
          </AnimatedCard>
        </div>
      </Container>
    </section>
  );
}
