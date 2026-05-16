"use client";

import { useMemo } from "react";
import { useOptimization } from "../optimization-toggle";
import { useSharedDriver } from "../shared-driver";
import { useRenderCount } from "../use-render-count";

type User = { id: number; name: string; score: number };

const ITEM_COUNT = 5000;
const ITEMS: ReadonlyArray<User> = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: i,
  name: `사용자 #${String(i + 1).padStart(4, "0")}`,
  score: Math.floor(Math.abs(Math.sin(i * 0.137)) * 9999),
}));

function sortItems(items: ReadonlyArray<User>): User[] {
  const copy = items.slice();
  copy.sort((a, b) => {
    // 비교에 더미 작업을 섞어 commit duration 차이를 키운다.
    let noise = 0;
    for (let i = 0; i < 50; i++) {
      noise += Math.sin(a.score + i) - Math.sin(b.score + i);
    }
    return b.score - a.score + noise * 0;
  });
  return copy;
}

export function SortScenario() {
  useRenderCount();
  // 공유 driver를 구독해 카운터 클릭 때마다 리렌더된다.
  useSharedDriver();
  const optimized = useOptimization();

  const cached = useMemo(() => sortItems(ITEMS), []);
  const sorted = optimized ? cached : sortItems(ITEMS);
  const top = sorted.slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-on-surface-variant">5,000명 중 점수 상위 5명</p>
      <ol className="flex flex-col gap-1 text-xs">
        {top.map((item, idx) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded bg-surface-container px-2 py-1"
          >
            <span className="flex items-center gap-2 text-on-surface">
              <span className="font-mono text-on-surface-variant">{idx + 1}위</span>
              <span>{item.name}</span>
            </span>
            <span className="font-mono text-on-surface">
              {item.score.toLocaleString()}점
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
