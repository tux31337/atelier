"use client";

import { Profiler, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  MeasurementContext,
  createCounterStore,
  useMeasuredCounter,
  type CounterStore,
} from "./use-render-count";

type MeasuredRegionProps = {
  id: string;
  label?: string;
  children: ReactNode;
};

export function MeasuredRegion({ id, label, children }: MeasuredRegionProps) {
  const store = useMemo(() => createCounterStore(), []);

  const handleRender = (
    _profilerId: string,
    _phase: "mount" | "update" | "nested-update",
    actualDuration: number,
  ) => {
    store.recordProfile(actualDuration);
  };

  return (
    <MeasurementContext.Provider value={store}>
      <div className="rounded-md border border-border bg-surface-container-low">
        <header className="flex flex-col gap-2 border-b border-border px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="font-mono text-xs text-on-surface-variant">{label ?? id}</span>
          <LiveStats store={store} />
        </header>
        <div className="p-4">
          <Profiler id={id} onRender={handleRender}>
            {children}
          </Profiler>
        </div>
      </div>
    </MeasurementContext.Provider>
  );
}

const BAR_MAX_MS = 60;
const FAST_MS = 8;
const MID_MS = 30;
const COLOR_IDLE = "var(--surface-container-highest)";
const COLOR_FAST = "var(--primary)";
const COLOR_MID = "oklch(0.78 0.15 75)";
const COLOR_SLOW = "oklch(0.65 0.22 25)";

function toneFor(duration: number | null) {
  if (duration === null) return COLOR_IDLE;
  if (duration < FAST_MS) return COLOR_FAST;
  if (duration < MID_MS) return COLOR_MID;
  return COLOR_SLOW;
}

function LiveStats({ store }: { store: CounterStore }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const duration = snapshot.lastDurationMs;
  const pct = duration === null ? 0 : Math.min(100, (duration / BAR_MAX_MS) * 100);
  const tone = toneFor(duration);

  return (
    <div className="flex min-w-[14rem] flex-col gap-1">
      <span className="font-mono text-xs text-on-surface">
        rendered <strong className="text-primary">{snapshot.renders}</strong>× · last commit{" "}
        <strong style={{ color: tone }}>
          {duration === null ? "—" : duration.toFixed(2)}
        </strong>{" "}
        ms
      </span>
      <div
        className="h-1.5 w-full overflow-hidden rounded bg-surface-container-highest"
        aria-hidden="true"
      >
        <div
          className="h-full rounded transition-[width] duration-200"
          style={{ width: `${pct}%`, background: tone }}
        />
      </div>
    </div>
  );
}

export function RenderStats() {
  const store = useMeasuredCounter();
  if (!store) {
    return null;
  }
  return <LiveStats store={store} />;
}
