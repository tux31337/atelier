"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type SharedDriverValue = {
  tick: number;
  selectedId: number | null;
  bumpTick: () => void;
  setSelectedId: (id: number | null) => void;
};

const SharedDriverContext = createContext<SharedDriverValue | null>(null);

export function useSharedDriver(): SharedDriverValue {
  const ctx = useContext(SharedDriverContext);
  if (!ctx) {
    throw new Error(
      "useSharedDriver는 SharedDriverProvider(또는 ComparisonPair) 안에서만 사용한다.",
    );
  }
  return ctx;
}

export function SharedDriverProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const value = useMemo<SharedDriverValue>(
    () => ({
      tick,
      selectedId,
      bumpTick: () => setTick((t) => t + 1),
      setSelectedId,
    }),
    [tick, selectedId],
  );

  return <SharedDriverContext.Provider value={value}>{children}</SharedDriverContext.Provider>;
}
