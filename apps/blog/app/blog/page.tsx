import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "@/types/post";

function PostMetaRow({ post }: { post: PostMeta }) {
  return (
    <div className="flex items-center gap-3 font-code-label text-code-label text-muted-foreground">
      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("ko-KR")}</time>
      <span className="h-1 w-1 shrink-0 rounded-full bg-outline-variant" />
      <span>{post.category}</span>
    </div>
  );
}

function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <article className="group col-span-1 lg:col-span-2">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden rounded-md border border-border bg-card transition-colors hover:bg-muted/40">
          <div className="flex h-48 w-full items-center justify-center bg-surface-container-high">
            <span className="font-code-label text-code-label text-muted-foreground">
              Cover Image
            </span>
          </div>
          <div className="flex flex-col gap-5 p-8">
            <PostMetaRow post={post} />
            <h2 className="font-headline-lg text-headline-lg text-on-surface transition-colors group-hover:text-secondary">
              {post.title}
            </h2>
            <p className="font-blog-content text-blog-content text-on-surface-variant line-clamp-2">
              {post.excerpt}
            </p>
            <span className="inline-flex w-fit items-center gap-2 font-code-label text-code-label text-secondary underline-offset-4 group-hover:underline">
              글 읽기
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:bg-muted/40">
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
                <span className="font-code-label text-code-label text-muted-foreground">
                  {post.category}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6">
            <PostMetaRow post={post} />
            <h2 className="line-clamp-2 font-headline-lg text-2xl text-on-surface transition-colors group-hover:text-secondary">
              {post.title}
            </h2>
            <p className="line-clamp-3 flex-1 font-body-md text-body-md text-on-surface-variant">
              {post.excerpt}
            </p>
            <span className="mt-auto inline-flex w-fit items-center gap-2 pt-2 font-code-label text-code-label text-secondary underline-offset-4 group-hover:underline">
              읽기
              <ArrowRight className="size-3" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <header className="mb-16 max-w-3xl space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          작업 기록
        </h1>
        <p className="max-w-[620px] font-blog-content text-blog-content text-on-surface-variant">
          프론트엔드 구조, UI 시스템, 배포 흐름을 직접 만들며 배운 내용을 정리합니다.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featured && <FeaturedPost post={featured} />}
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>

      <div className="mt-20 flex items-center justify-between border-t border-border pt-12">
        <button className="flex items-center gap-2 font-code-label text-code-label text-muted-foreground transition-colors hover:text-on-surface">
          <ArrowLeft className="size-4" />
          최신
        </button>
        <div className="font-code-label text-code-label text-muted-foreground">1 / 1</div>
        <button className="flex items-center gap-2 font-code-label text-code-label text-on-surface transition-colors hover:text-secondary">
          이전
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
