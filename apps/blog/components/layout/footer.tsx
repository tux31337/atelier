import { Globe, AtSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <p className="font-code-label text-code-label text-muted-foreground">
          2026 Atelier. 기록하고 다듬는 프론트엔드 작업실.
        </p>

        <div className="flex gap-6">
          {(["소스", "연락", "상태"] as const).map((label) => (
            <a
              key={label}
              href="#"
              className="font-code-label text-code-label text-muted-foreground underline-offset-4 transition-colors hover:text-on-surface hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex gap-4">
          <Globe className="size-5 text-muted-foreground" />
          <AtSign className="size-5 text-muted-foreground" />
        </div>
      </div>
    </footer>
  );
}
