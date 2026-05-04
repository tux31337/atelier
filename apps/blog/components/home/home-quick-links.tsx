import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROOM_ROUTES } from "./room-routes";

export function HomeQuickLinks() {
  return (
    <section
      className="mx-auto grid w-full max-w-5xl gap-3 px-6 md:grid-cols-4"
      aria-labelledby="home-quick-links-title"
    >
      <div className="md:col-span-4">
        <h2 id="home-quick-links-title" className="font-headline-lg text-2xl text-on-surface">
          빠른 링크
        </h2>
      </div>
      {ROOM_ROUTES.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="group flex min-h-32 flex-col justify-between rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="font-code-label text-code-label text-secondary">{route.label}</span>
          <span>
            <span className="block font-headline-lg text-xl text-card-foreground">
              {route.objectName}
            </span>
            <span className="mt-2 flex items-center gap-2 font-body-md text-sm text-muted-foreground">
              이동하기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      ))}
    </section>
  );
}
