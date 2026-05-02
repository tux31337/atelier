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
      {/* Hero */}
      <header className="relative w-full overflow-hidden pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative z-10 text-center space-y-8">
            <div className="inline-block px-3 py-1 bg-surface-container-highest border border-outline-variant rounded-full font-code-label text-code-label text-on-surface-variant uppercase">
              {post.category}
            </div>
            <h1 className="font-display-xl text-4xl md:text-6xl lg:text-display-xl max-w-5xl mx-auto leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-6 pt-4 font-body-md text-body-md text-on-surface-variant">
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="w-1 h-1 bg-outline rounded-full hidden sm:block" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-16 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl bg-surface-container">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover opacity-50"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <span className="text-6xl font-black text-zinc-600 font-headline-lg">
                  {post.category.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Article body */}
      <article className="max-w-4xl mx-auto px-6 md:px-12 py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-code-label text-code-label uppercase text-zinc-500 hover:text-zinc-100 transition-colors mb-12"
        >
          <ArrowLeft className="size-4" />
          All Posts
        </Link>

        <div className="prose-custom">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-12 border-t border-white/5 mt-16">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-code-label text-zinc-500 uppercase tracking-widest"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </main>
  );
}
