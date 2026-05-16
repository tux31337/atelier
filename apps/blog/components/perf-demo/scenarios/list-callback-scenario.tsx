"use client";

import { memo, useCallback } from "react";
import { useOptimization } from "../optimization-toggle";
import { useFlashOnCommit } from "../render-flash";
import { useSharedDriver } from "../shared-driver";
import { useRenderCount } from "../use-render-count";

const ROW_COUNT = 100;
const ROWS: ReadonlyArray<{ id: number; label: string }> = Array.from(
  { length: ROW_COUNT },
  (_, i) => ({ id: i, label: `Row #${i}` }),
);

type RowProps = {
  id: number;
  label: string;
  selected: boolean;
  onSelect: (id: number) => void;
};

const Row = memo(function Row({ id, label, selected, onSelect }: RowProps) {
  const ref = useFlashOnCommit<HTMLLIElement>();
  return (
    <li
      ref={ref}
      style={{ outline: "2px solid transparent", outlineOffset: 2, borderRadius: 4 }}
      className={`flex items-center justify-between gap-2 px-2 py-1 text-xs ${
        selected ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"
      }`}
    >
      <span className="font-mono">{label}</span>
      <button
        type="button"
        onClick={() => onSelect(id)}
        className="rounded-sm border border-border bg-surface-container-high px-2 py-0.5 text-on-surface"
      >
        select
      </button>
    </li>
  );
});

export function ListCallbackScenario() {
  useRenderCount();
  const optimized = useOptimization();
  const { selectedId, setSelectedId } = useSharedDriver();

  const stableSelect = useCallback((id: number) => setSelectedId(id), [setSelectedId]);
  const unstableSelect = (id: number) => setSelectedId(id);
  const onSelect = optimized ? stableSelect : unstableSelect;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-on-surface-variant">
        memo(Row) × 100 · 선택됨{" "}
        <span className="font-mono text-on-surface">{selectedId ?? "—"}</span>
      </p>
      <ul className="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3">
        {ROWS.map((row) => (
          <Row
            key={row.id}
            id={row.id}
            label={row.label}
            selected={row.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}
