"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Archive", href: "/archive" },
  { label: "About", href: "/about" },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-zinc-100 font-headline-lg uppercase"
        >
          Dev_Studio
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-code-label text-code-label uppercase transition-colors",
                  isActive
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5 px-2 py-1"
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
            className="scale-95 active:scale-90 duration-200 hover:bg-white/5 p-2 rounded-full flex items-center justify-center transition-colors"
          >
            <Terminal className="text-zinc-100 size-5" />
          </button>

          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-surface-container flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-400 font-code-label">D</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
