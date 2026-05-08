import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@atelier/ui";
import { getAllPosts } from "@/lib/posts";
import {
  buildCategoryTree,
  filterPostsByCategory,
  getCategoryHref,
  getCategoryLabel,
  isCategorySelected,
  normalizeCategoryFilter,
} from "@/lib/categories";
import type { PostMeta } from "@/types/post";

type Props = {
  searchParams: Promise<{
    category?: string | string[];
    subcategory?: string | string[];
  }>;
};

function PostMetaRow({ post }: { post: PostMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-code-label text-code-label text-muted-foreground">
      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("ko-KR")}</time>
      <span className="h-1 w-1 shrink-0 rounded-full bg-outline-variant" />
      <span>{getCategoryLabel(post)}</span>
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
              {getCategoryLabel(post)}
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
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
                <span className="font-code-label text-code-label text-muted-foreground">
                  {getCategoryLabel(post)}
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

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 font-code-label text-xs transition-colors",
        active
          ? "border-secondary bg-secondary/10 text-secondary"
          : "border-border bg-surface-container text-muted-foreground hover:text-on-surface"
      )}
    >
      {children}
    </Link>
  );
}

function CategoryNav({
  categoryTree,
  activeFilters,
}: {
  categoryTree: Array<{
    label: string;
    count: number;
    href: string;
    children: Array<{
      label: string;
      count: number;
      href: string;
    }>;
  }>;
  activeFilters: {
    category?: string;
    subcategory?: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/80">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border px-5 py-4">
        <Link
          href={getCategoryHref()}
          className={cn(
            "font-code-label text-sm transition-colors",
            isCategorySelected(activeFilters, {})
              ? "text-secondary"
              : "text-muted-foreground hover:text-on-surface"
          )}
        >
          전체 보기
        </Link>

        {categoryTree.map((category) => {
          const active = activeFilters.category === category.label;

          return (
            <div key={category.label} className="group relative">
              <Link
                href={category.href}
                className={cn(
                  "inline-flex items-center gap-2 font-code-label text-sm transition-colors",
                  active ? "text-secondary" : "text-muted-foreground hover:text-on-surface"
                )}
              >
                <span>{category.label}</span>
                <span className="text-xs text-muted-foreground/80">({category.count})</span>
              </Link>

              {category.children.length > 0 ? (
                <div className="absolute left-0 top-full z-20 hidden min-w-44 pt-3 group-hover:block">
                  <div className="rounded-xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
                    {category.children.map((subcategory) => (
                      <Link
                        key={`${category.label}-${subcategory.label}-dropdown`}
                        href={subcategory.href}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 font-code-label text-xs transition-colors",
                          isCategorySelected(activeFilters, {
                            category: category.label,
                            subcategory: subcategory.label,
                          })
                            ? "bg-secondary/10 text-secondary"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-on-surface"
                        )}
                      >
                        <span>{subcategory.label}</span>
                        <span>{subcategory.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {activeFilters.category ? (
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <span className="font-code-label text-xs text-muted-foreground">하위 분류</span>
          {categoryTree
            .find((category) => category.label === activeFilters.category)
            ?.children.map((subcategory) => (
              <FilterLink
                key={`${activeFilters.category}-${subcategory.label}-active`}
                href={subcategory.href}
                active={isCategorySelected(activeFilters, {
                  category: activeFilters.category,
                  subcategory: subcategory.label,
                })}
              >
                {subcategory.label} ({subcategory.count})
              </FilterLink>
            ))}
        </div>
      ) : null}
    </div>
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const allPosts = getAllPosts();
  const resolvedSearchParams = await searchParams;
  const activeFilters = {
    category: normalizeCategoryFilter(resolvedSearchParams.category),
    subcategory: normalizeCategoryFilter(resolvedSearchParams.subcategory),
  };
  const categoryTree = buildCategoryTree(allPosts);
  const posts = filterPostsByCategory(allPosts, activeFilters);
  const [featured, ...rest] = posts;
  const hasFilters = Boolean(activeFilters.category || activeFilters.subcategory);
  const activeFilterLabel = activeFilters.subcategory
    ? `${activeFilters.category} / ${activeFilters.subcategory}`
    : activeFilters.category;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <header className="mb-12 max-w-3xl space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">작업 기록</h1>
        <p className="max-w-[620px] font-blog-content text-blog-content text-on-surface-variant">
          프론트엔드 구조, UI, 성능, 배포 흐름을 직접 만들며 배운 내용을 정리합니다.
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <div className="space-y-2">
          <p className="font-code-label text-code-label text-secondary">Category</p>
          <h2 className="font-headline-lg text-2xl text-on-surface">카테고리</h2>
        </div>
        <CategoryNav categoryTree={categoryTree} activeFilters={activeFilters} />
      </section>

      <section className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl text-on-surface">
            {activeFilterLabel ? `${activeFilterLabel} 글 목록` : "전체 글 목록"}
          </h2>
          <p className="mt-2 font-code-label text-code-label text-muted-foreground">
            {hasFilters ? "선택한 분류에 맞는 글만 보여줍니다." : "최신 글부터 순서대로 보여줍니다."}
          </p>
        </div>
        <p className="font-code-label text-code-label text-muted-foreground">{posts.length} posts</p>
      </section>

      {posts.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featured && <FeaturedPost post={featured} />}
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border bg-surface-container/40 px-6 py-16 text-center">
          <h3 className="font-headline-lg text-2xl text-on-surface">
            {activeFilterLabel ?? "선택한 분류"}에 아직 글이 없습니다.
          </h3>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
            분류는 먼저 열어두었고, 이후 이 파트에 맞는 글을 이어서 추가할 수 있습니다.
          </p>
        </section>
      )}
    </div>
  );
}
