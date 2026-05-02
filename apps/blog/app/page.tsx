import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-20 lg:py-28">
      <section className="max-w-3xl space-y-6">
        <p className="font-code-label text-code-label text-secondary">Atelier</p>
        <h1 className="font-display-xl text-display-xl text-on-background">
          읽고, 만들고, 다시 정리하는 프론트엔드 작업실.
        </h1>
        <p className="max-w-2xl font-blog-content text-blog-content text-on-surface-variant">
          Next.js, UI 시스템, 배포 구조를 직접 만들며 배운 것을 글과 프로젝트로 남깁니다.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 font-code-label text-code-label text-on-secondary transition-colors hover:bg-secondary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            글 보기
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-code-label text-code-label text-on-surface transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            프로젝트
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
          <div>
            <h2 className="font-headline-lg text-2xl text-on-surface">최근 글</h2>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              새로 정리한 기록을 먼저 보여줍니다.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden font-code-label text-code-label text-secondary hover:underline sm:inline"
          >
            전체 보기
          </Link>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-md border border-border bg-card p-5 transition-colors hover:bg-muted/40"
            >
              <Link href={`/blog/${post.slug}`} className="block space-y-3">
                <div className="flex flex-wrap items-center gap-3 font-code-label text-code-label text-muted-foreground">
                  <span>{post.category}</span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("ko-KR")}
                  </time>
                </div>
                <h3 className="font-headline-lg text-2xl text-card-foreground">
                  {post.title}
                </h3>
                <p className="font-body-md text-body-md text-muted-foreground">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
