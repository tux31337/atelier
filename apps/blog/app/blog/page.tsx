import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "@/types/post";

function PostMetaRow({ post }: { post: PostMeta }) {
  return (
    <div className="flex items-center gap-3 font-code-label text-code-label uppercase tracking-widest text-on-tertiary-container">
      <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      <span className="w-1 h-1 rounded-full bg-outline-variant shrink-0" />
      <span>{post.category}</span>
    </div>
  );
}

function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <article className="group col-span-1 lg:col-span-2">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500">
          <div className="w-full h-48 bg-surface-container-high flex items-center justify-center opacity-30">
            <span className="font-headline-lg text-zinc-500 text-sm uppercase tracking-widest">
              Cover Image
            </span>
          </div>
          <div className="p-8 flex flex-col gap-5">
            <PostMetaRow post={post} />
            <h2 className="font-headline-lg text-headline-lg text-on-surface group-hover:text-secondary transition-colors duration-300">
              {post.title}
            </h2>
            <p className="font-blog-content text-blog-content text-on-surface-variant line-clamp-2">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 font-code-label text-code-label uppercase border-b border-secondary/30 pb-1 text-secondary w-fit group-hover:border-secondary transition-all">
              Read Full Post
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
        <div className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500 h-full flex flex-col">
          <div className="w-full aspect-[16/9] overflow-hidden shrink-0">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high flex items-center justify-center opacity-20">
                <span className="font-headline-lg text-zinc-500 text-xs uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            <PostMetaRow post={post} />
            <h2 className="font-headline-lg text-2xl text-on-surface group-hover:text-secondary transition-colors duration-300 line-clamp-2">
              {post.title}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 flex-1">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 font-code-label text-code-label uppercase border-b border-secondary/30 pb-1 text-secondary w-fit group-hover:border-secondary transition-all mt-auto pt-2">
              Read
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
    <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32">
      <header className="mb-20 space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          Journal of <br className="hidden sm:block" /> Kinetic Code
        </h1>
        <p className="font-blog-content text-blog-content text-on-surface-variant max-w-[580px] italic">
          Explorations at the intersection of rigorous systems architecture and fluid visual
          storytelling. Documenting the process of making code move.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featured && <FeaturedPost post={featured} />}
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>

      <div className="mt-20 pt-12 border-t border-white/5 flex justify-between items-center">
        <button className="font-code-label text-code-label uppercase text-zinc-500 hover:text-zinc-100 transition-colors flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Newer
        </button>
        <div className="font-code-label text-code-label text-zinc-600">Page 01 / 01</div>
        <button className="font-code-label text-code-label uppercase text-zinc-100 hover:text-zinc-300 transition-colors flex items-center gap-2">
          Older
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
