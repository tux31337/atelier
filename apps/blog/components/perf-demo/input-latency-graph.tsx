"use client";

import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";

const SAMPLE_COUNT = 30;
const MIN_AXIS_MS = 50;

export function InputLatencyGraph({
  width = 180,
  height = 44,
  children,
}: {
  width?: number;
  height?: number;
  children?: ReactNode;
}) {
  const [samples, setSamples] = useState<number[]>([]);
  const pendingRef = useRef<number | null>(null);

  const handlePointerDown = useCallback(() => {
    pendingRef.current = performance.now();
    requestAnimationFrame(() => {
      if (pendingRef.current === null) {
        return;
      }
      const latency = performance.now() - pendingRef.current;
      pendingRef.current = null;
      setSamples((prev) => {
        const next = prev.length >= SAMPLE_COUNT ? prev.slice(1) : prev.slice();
        next.push(latency);
        return next;
      });
    });
  }, []);

  const max = Math.max(MIN_AXIS_MS, ...samples);
  const points = samples
    .map((v, i) => {
      const x = (i / Math.max(1, SAMPLE_COUNT - 1)) * width;
      const y = height - (v / max) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const latest = samples[samples.length - 1];

  return (
    <div className="my-4 rounded-md border border-border bg-surface-container p-3">
      <div onPointerDown={handlePointerDown}>{children}</div>
      <div className="mt-2 flex items-center gap-2">
        <svg width={width} height={height} className="overflow-visible">
          <polyline fill="none" stroke="var(--primary)" strokeWidth={1.5} points={points} />
        </svg>
        <span className="font-mono text-xs text-on-surface">
          {latest !== undefined ? `${latest.toFixed(1)} ms` : "—"}
        </span>
      </div>
    </div>
  );
}
