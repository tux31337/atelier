import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getPost, getAllPosts, postExists } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!postExists(slug)) return {};
  const post = getPost(slug);
  return { title: post.title };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  if (!postExists(slug)) notFound();

  const post = getPost(slug);

  return (
    <main className="relative">
      <header className="relative w-full overflow-hidden pb-12 pt-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative z-10 max-w-3xl space-y-8">
            <div className="inline-block rounded-md border border-border bg-surface-container px-3 py-1 font-code-label text-code-label text-on-surface-variant">
              {post.category}
            </div>
            <h1 className="max-w-4xl font-display-xl text-4xl leading-tight md:text-display-xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-2 font-body-md text-body-md text-on-surface-variant">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("ko-KR")}</time>
              <span className="hidden h-1 w-1 rounded-full bg-outline sm:block" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 w-full max-w-5xl px-6">
          <div className="relative h-[280px] overflow-hidden rounded-md border border-border bg-surface-container md:h-[420px]">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-headline-lg text-6xl font-semibold text-muted-foreground">
                  {post.category.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-20">
        <Link
          href="/blog"
          className="mb-12 inline-flex items-center gap-2 font-code-label text-code-label text-muted-foreground transition-colors hover:text-on-surface"
        >
          <ArrowLeft className="size-4" />
          모든 글
        </Link>

        <div className="prose-custom">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        <div className="mt-16 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-12">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-code-label text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </main>
  );
}
