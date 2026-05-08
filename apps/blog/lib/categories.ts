import type { PostMeta } from "@/types/post";

export type CategoryBranch = {
  label: string;
  count: number;
  href: string;
};

export type CategoryNode = {
  label: string;
  count: number;
  href: string;
  children: CategoryBranch[];
};

const DEFAULT_CATEGORY_TREE = [
  {
    label: "정보보안",
    children: ["보안기사"],
  },
] as const;

type CategoryFilters = {
  category?: string;
  subcategory?: string;
};

function createHref(filters: CategoryFilters = {}) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.subcategory) {
    params.set("subcategory", filters.subcategory);
  }

  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function buildCategoryTree(posts: PostMeta[]): CategoryNode[] {
  const categoryMap = new Map<string, Set<string>>();

  for (const preset of DEFAULT_CATEGORY_TREE) {
    categoryMap.set(preset.label, new Set(preset.children));
  }

  for (const post of posts) {
    const childSet = categoryMap.get(post.category) ?? new Set<string>();

    if (post.subcategory) {
      childSet.add(post.subcategory);
    }

    categoryMap.set(post.category, childSet);
  }

  return [...categoryMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "ko"))
    .map(([label, children]) => {
      const childEntries = [...children]
        .sort((left, right) => left.localeCompare(right, "ko"))
        .map((childLabel) => ({
          label: childLabel,
          count: posts.filter(
            (post) => post.category === label && post.subcategory === childLabel
          ).length,
          href: createHref({ category: label, subcategory: childLabel }),
        }));

      return {
        label,
        count: posts.filter((post) => post.category === label).length,
        href: createHref({ category: label }),
        children: childEntries,
      };
    });
}

export function filterPostsByCategory(posts: PostMeta[], filters: CategoryFilters) {
  return posts.filter((post) => {
    if (filters.category && post.category !== filters.category) {
      return false;
    }

    if (filters.subcategory && post.subcategory !== filters.subcategory) {
      return false;
    }

    return true;
  });
}

export function getCategoryLabel(post: Pick<PostMeta, "category" | "subcategory">) {
  return post.subcategory
    ? `${post.category} / ${post.subcategory}`
    : post.category;
}

export function getCategoryLead(post: Pick<PostMeta, "category" | "subcategory">) {
  return (post.subcategory ?? post.category).slice(0, 1);
}

export function isCategorySelected(
  activeFilters: CategoryFilters,
  targetFilters: CategoryFilters
) {
  return (
    (activeFilters.category ?? "") === (targetFilters.category ?? "") &&
    (activeFilters.subcategory ?? "") === (targetFilters.subcategory ?? "")
  );
}

export function normalizeCategoryFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getCategoryHref(filters: CategoryFilters = {}) {
  return createHref(filters);
}
