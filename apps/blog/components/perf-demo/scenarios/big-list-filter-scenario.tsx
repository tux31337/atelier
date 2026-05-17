"use client";
/* eslint-disable react-hooks/purity -- 데모 의도상 commit duration을 인위적으로 키운다. */

import { memo, useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import { useOptimization } from "../optimization-toggle";
import { useRenderCount } from "../use-render-count";

const SEED_TAGS = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel"];
function seedTag(i: number): string {
  return SEED_TAGS[i % SEED_TAGS.length];
}

const ITEM_COUNT = 8000;
const ITEMS: ReadonlyArray<{ id: number; label: string }> = Array.from(
  { length: ITEM_COUNT },
  (_, i) => ({
    id: i,
    label: `사용자 #${String(i + 1).padStart(4, "0")} ${seedTag(i)}`,
  }),
);

// deterministic busy-wait: 행마다 약 1ms 점유.
// 120행이면 약 120ms — 머신과 무관하게 commit이 끊김으로 박힌다.
const PER_ROW_BUDGET_MS = 1;
const VISIBLE_COUNT = 120;

function HeavyRow({ label }: { label: string }) {
  const deadline = performance.now() + PER_ROW_BUDGET_MS;
  let spin = 0;
  while (performance.now() < deadline) {
    spin += Math.sin(spin + label.length);
  }
  return (
    <li
      className="rounded bg-surface-container px-2 py-1 font-mono text-xs text-on-surface"
      data-spin={spin.toFixed(2)}
    >
      {label}
    </li>
  );
}

// 자식을 memo로 감싸야 useTransition이 입력 응답성을 살릴 수 있다.
// urgent 렌더에서는 searchQuery가 안 바뀌어 이 자식은 건너뛴다.
const HeavyList = memo(function HeavyList({ query }: { query: string }) {
  const q = query.trim().toLowerCase();
  const filtered = q === "" ? ITEMS : ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  const visible = filtered.slice(0, VISIBLE_COUNT);
  return (
    <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto pr-1">
      {visible.map((item) => (
        <HeavyRow key={item.id} label={item.label} />
      ))}
    </ul>
  );
});

export function BigListFilterScenario() {
  useRenderCount();
  const optimized = useOptimization();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputValue(next);
    if (optimized) {
      startTransition(() => setSearchQuery(next));
    } else {
      setSearchQuery(next);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="alpha · bravo · 0042 등 빠르게 타이핑해보자"
        className="rounded border border-border bg-surface-container px-3 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant"
        spellCheck={false}
      />
      <p className="flex items-center gap-2 text-xs text-on-surface-variant">
        <span>
          {ITEM_COUNT.toLocaleString()}명 검색 · 상위 {VISIBLE_COUNT}명 표시
        </span>
        {optimized && isPending ? (
          <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-primary">
            갱신 중…
          </span>
        ) : null}
      </p>
      <HeavyList query={searchQuery} />
    </div>
  );
}
