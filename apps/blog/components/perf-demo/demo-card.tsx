"use client";

import type { ReactNode } from "react";

type DemoCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DemoCard({ title, description, children }: DemoCardProps) {
  return (
    <section className="my-10 rounded-md border border-border bg-surface-container-low p-6">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
        ) : null}
      </header>
      <div>{children}</div>
    </section>
  );
}
