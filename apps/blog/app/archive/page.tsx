import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아카이브",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <header className="space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          아카이브
        </h1>
        <p className="max-w-[580px] font-blog-content text-blog-content text-on-surface-variant">
          모든 기록을 시간순으로 정리할 예정입니다.
        </p>
      </header>
    </div>
  );
}
