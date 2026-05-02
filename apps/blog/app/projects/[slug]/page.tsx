import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TECH_STACK = ["React", "Next.js", "Tailwind CSS", "TypeScript"] as const;

export default function ProjectPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20 lg:py-28">
      <Link
        href="/projects"
        className="mb-12 inline-flex items-center gap-2 font-code-label text-code-label text-muted-foreground transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="size-4" />
        프로젝트 목록
      </Link>

      <article className="space-y-16">
        <header className="max-w-3xl space-y-6">
          <p className="font-code-label text-code-label text-secondary">프로젝트 기록</p>
          <h1 className="font-display-xl text-display-xl text-on-background">
            프로젝트 상세 페이지
          </h1>
          <p className="font-blog-content text-blog-content text-on-surface-variant">
            실제 프로젝트 콘텐츠가 들어오기 전까지 사용하는 정리용 화면입니다. 이후 작업물의 문제,
            접근 방식, 결과를 같은 형식으로 기록합니다.
          </p>
        </header>

        <section className="grid gap-4 rounded-md border border-border bg-card p-6 md:grid-cols-3">
          <div>
            <h2 className="mb-2 font-code-label text-code-label text-muted-foreground">역할</h2>
            <p className="font-body-md text-body-md text-on-surface">프론트엔드 설계와 구현</p>
          </div>
          <div>
            <h2 className="mb-2 font-code-label text-code-label text-muted-foreground">상태</h2>
            <p className="font-body-md text-body-md text-on-surface">초안 준비 중</p>
          </div>
          <div>
            <h2 className="mb-2 font-code-label text-code-label text-muted-foreground">범위</h2>
            <p className="font-body-md text-body-md text-on-surface">UI, 구조, 배포 기록</p>
          </div>
        </section>

        <section className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">기록할 내용</h2>
          <div className="space-y-5 font-body-md text-body-md text-on-surface-variant">
            <p>
              프로젝트마다 왜 만들었는지, 어떤 제약이 있었는지, 어떤 결정을 했는지를 간결하게
              남깁니다.
            </p>
            <p>
              구현 세부사항은 코드와 연결하되, 방문자가 먼저 읽어야 할 내용은 문제와 결과 중심으로
              정리합니다.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline-lg text-2xl text-on-surface">사용 기술</h2>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-surface-container px-3 py-1 font-code-label text-code-label text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
