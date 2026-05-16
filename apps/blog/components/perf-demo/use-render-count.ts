"use client";

import { createContext, useContext, useEffect } from "react";

export type CounterSnapshot = {
  renders: number;
  lastDurationMs: number | null;
};

export type CounterStore = {
  bumpRender: () => void;
  recordProfile: (durationMs: number) => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => CounterSnapshot;
  reset: () => void;
};

export function createCounterStore(): CounterStore {
  let snapshot: CounterSnapshot = { renders: 0, lastDurationMs: null };
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());
  return {
    bumpRender() {
      snapshot = { renders: snapshot.renders + 1, lastDurationMs: snapshot.lastDurationMs };
      emit();
    },
    recordProfile(durationMs) {
      snapshot = { renders: snapshot.renders, lastDurationMs: durationMs };
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return snapshot;
    },
    reset() {
      snapshot = { renders: 0, lastDurationMs: null };
      emit();
    },
  };
}

export const MeasurementContext = createContext<CounterStore | null>(null);

export function useMeasuredCounter(): CounterStore | null {
  return useContext(MeasurementContext);
}

// 매 commit마다 render 카운트를 증가시킨다. deps 배열을 두지 않은 것이 의도다.
export function useRenderCount(): void {
  const store = useMeasuredCounter();
  useEffect(() => {
    store?.bumpRender();
  });
}
