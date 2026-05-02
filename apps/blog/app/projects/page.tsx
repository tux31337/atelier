import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로젝트",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <header className="space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          프로젝트
        </h1>
        <p className="max-w-[580px] font-blog-content text-blog-content text-on-surface-variant">
          작업물 목록을 준비하고 있습니다.
        </p>
      </header>
    </div>
  );
}
