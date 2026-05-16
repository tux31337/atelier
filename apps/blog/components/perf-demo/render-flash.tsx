"use client";

import { Profiler, useEffect, useRef } from "react";
import type { ReactNode } from "react";

const FLASH_DURATION_MS = 360;

function flash(element: HTMLElement | null) {
  element?.animate(
    [{ outlineColor: "var(--primary)" }, { outlineColor: "transparent" }],
    { duration: FLASH_DURATION_MS, easing: "ease-out" },
  );
}

export function RenderFlash({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={{ outline: "2px solid transparent", outlineOffset: 4, borderRadius: 6 }}
    >
      <Profiler id="render-flash" onRender={() => flash(ref.current)}>
        {children}
      </Profiler>
    </div>
  );
}

// 호출 컴포넌트가 commit될 때마다 ref가 가리키는 element 외곽선을 한 프레임 깜빡인다.
export function useFlashOnCommit<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    flash(ref.current);
  });
  return ref;
}
