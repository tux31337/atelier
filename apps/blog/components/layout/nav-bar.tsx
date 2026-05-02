"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "프로젝트", href: "/projects" },
  { label: "글", href: "/blog" },
  { label: "아카이브", href: "/archive" },
  { label: "소개", href: "/about" },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-headline-lg text-xl font-semibold text-on-surface"
        >
          Atelier
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-sm font-code-label text-code-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "text-secondary"
                    : "text-muted-foreground hover:text-on-surface"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Terminal"
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Terminal className="size-5" />
          </button>

          <div className="flex size-8 items-center justify-center rounded-md border border-border bg-surface-container">
            <span className="font-code-label text-xs font-semibold text-muted-foreground">
              A
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
