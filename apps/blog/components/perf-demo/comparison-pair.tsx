"use client";

import type { ReactNode } from "react";
import { MeasuredRegion } from "./measured-region";
import { OptimizationContext } from "./optimization-toggle";
import { RenderFlash } from "./render-flash";
import { SharedDriverProvider, useSharedDriver } from "./shared-driver";

type ComparisonPairProps = {
  id: string;
  driverLabel: string;
  flash?: boolean;
  hint?: string;
  children: ReactNode;
};

export function ComparisonPair({
  id,
  driverLabel,
  flash = true,
  hint = "한 번 클릭하면 아래 두 패널이 같은 입력으로 동시에 리렌더된다.",
  children,
}: ComparisonPairProps) {
  return (
    <SharedDriverProvider>
      <ComparisonPairInner id={id} driverLabel={driverLabel} flash={flash} hint={hint}>
        {children}
      </ComparisonPairInner>
    </SharedDriverProvider>
  );
}

function ComparisonPairInner({
  id,
  driverLabel,
  flash,
  hint,
  children,
}: Required<Omit<ComparisonPairProps, "children">> & { children: ReactNode }) {
  const { tick, bumpTick } = useSharedDriver();
  const wrap = (slot: ReactNode) => (flash ? <RenderFlash>{slot}</RenderFlash> : slot);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={bumpTick}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
        >
          {driverLabel}: {tick}
        </button>
        <span className="text-xs text-on-surface-variant">{hint}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <OptimizationContext.Provider value={false}>
          <MeasuredRegion id={`${id}-off`} label="최적화 OFF">
            {wrap(children)}
          </MeasuredRegion>
        </OptimizationContext.Provider>
        <OptimizationContext.Provider value={true}>
          <MeasuredRegion id={`${id}-on`} label="최적화 ON">
            {wrap(children)}
          </MeasuredRegion>
        </OptimizationContext.Provider>
      </div>
    </div>
  );
}
