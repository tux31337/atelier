"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export const OptimizationContext = createContext(false);

export function useOptimization(): boolean {
  return useContext(OptimizationContext);
}

type OptimizationToggleProps = {
  initial?: boolean;
  label?: string;
  children: ReactNode;
};

export function OptimizationToggle({
  initial = false,
  label = "최적화",
  children,
}: OptimizationToggleProps) {
  const [on, setOn] = useState(initial);
  return (
    <div className="my-6 rounded-md border border-border bg-surface-container">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-sm text-on-surface">{label}</span>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            on ? "bg-primary" : "bg-surface-container-highest"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-on-primary shadow transition-transform ${
              on ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
          <span className="sr-only">{label} 토글</span>
        </button>
      </div>
      <div className="p-4">
        <OptimizationContext.Provider value={on}>{children}</OptimizationContext.Provider>
      </div>
    </div>
  );
}
