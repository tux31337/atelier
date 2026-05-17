"use client";

import type { ReactNode } from "react";
import { MeasuredRegion } from "./measured-region";
import { OptimizationContext } from "./optimization-toggle";
import { RenderFlash } from "./render-flash";
import { SharedDriverProvider, useSharedDriver } from "./shared-driver";

type ComparisonPairProps = {
  id: string;
  driverLabel?: string;
  flash?: boolean;
  hint?: string;
  children: ReactNode;
};

export function ComparisonPair({
  id,
  driverLabel,
  flash = true,
  hint,
  children,
}: ComparisonPairProps) {
  const grid = (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <OptimizationContext.Provider value={false}>
        <MeasuredRegion id={`${id}-off`} label="최적화 OFF">
          {flash ? <RenderFlash>{children}</RenderFlash> : children}
        </MeasuredRegion>
      </OptimizationContext.Provider>
      <OptimizationContext.Provider value={true}>
        <MeasuredRegion id={`${id}-on`} label="최적화 ON">
          {flash ? <RenderFlash>{children}</RenderFlash> : children}
        </MeasuredRegion>
      </OptimizationContext.Provider>
    </div>
  );

  if (driverLabel === undefined) {
    return <div className="flex flex-col gap-3">{grid}</div>;
  }

  const defaultHint = "한 번 클릭하면 아래 두 패널이 같은 입력으로 동시에 리렌더된다.";
  return (
    <SharedDriverProvider>
      <div className="flex flex-col gap-3">
        <SharedDriverButton label={driverLabel} hint={hint ?? defaultHint} />
        {grid}
      </div>
    </SharedDriverProvider>
  );
}

function SharedDriverButton({ label, hint }: { label: string; hint: string }) {
  const { tick, bumpTick } = useSharedDriver();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={bumpTick}
        className="rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
      >
        {label}: {tick}
      </button>
      <span className="text-xs text-on-surface-variant">{hint}</span>
    </div>
  );
}
