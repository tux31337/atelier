"use client";

import { useEffect, useRef, useState } from "react";

const SAMPLE_COUNT = 60;
const MAX_FPS = 120;

export function FpsMeter({ width = 160, height = 40 }: { width?: number; height?: number }) {
  const [samples, setSamples] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = (now: number) => {
      if (cancelled) {
        return;
      }
      const last = lastTimeRef.current;
      if (last !== null) {
        const dt = now - last;
        const fps = dt > 0 ? 1000 / dt : 0;
        setSamples((prev) => {
          const next = prev.length >= SAMPLE_COUNT ? prev.slice(1) : prev.slice();
          next.push(fps);
          return next;
        });
      }
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const points = samples
    .map((v, i) => {
      const x = (i / Math.max(1, SAMPLE_COUNT - 1)) * width;
      const clamped = Math.max(0, Math.min(MAX_FPS, v));
      const y = height - (clamped / MAX_FPS) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const latest = samples[samples.length - 1] ?? 0;

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-container px-3 py-1.5">
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke="var(--primary)" strokeWidth={1.5} points={points} />
      </svg>
      <span className="font-mono text-xs text-on-surface">{latest.toFixed(0)} fps</span>
    </div>
  );
}
