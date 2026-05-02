import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <header className="space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          소개
        </h1>
        <p className="max-w-[580px] font-blog-content text-blog-content text-on-surface-variant">
          작업실의 방향, 공부한 것, 만들고 싶은 것들을 정리하는 페이지입니다.
        </p>
      </header>
    </div>
  );
}
