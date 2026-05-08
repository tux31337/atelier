import { describe, expect, it } from "vitest";
import {
  buildCategoryTree,
  filterPostsByCategory,
  getCategoryHref,
  getCategoryLabel,
} from "./categories";
import type { PostMeta } from "@/types/post";

const POSTS: PostMeta[] = [
  {
    slug: "security-engineer-overview",
    title: "보안기사 학습 로드맵",
    date: "2026-05-08",
    category: "정보보안",
    subcategory: "보안기사",
    excerpt: "요약",
    tags: ["정보보안"],
    readingTime: 3,
    categoryPath: ["정보보안", "보안기사"],
  },
  {
    slug: "perf-basics",
    title: "렌더링 병목 찾기",
    date: "2026-05-07",
    category: "Performance",
    excerpt: "요약",
    tags: ["Performance"],
    readingTime: 4,
    categoryPath: ["Performance"],
  },
];

describe("buildCategoryTree", () => {
  it("includes configured categories even when they are empty", () => {
    const tree = buildCategoryTree([
      {
        ...POSTS[1],
      },
    ]);

    expect(tree.some((node) => node.label === "정보보안")).toBe(true);
    const security = tree.find((node) => node.label === "정보보안");
    expect(security?.children.map((child) => child.label)).toContain("보안기사");
    expect(security?.count).toBe(0);
  });

  it("counts categories and subcategories from posts", () => {
    const tree = buildCategoryTree(POSTS);
    const security = tree.find((node) => node.label === "정보보안");
    expect(security?.count).toBe(1);
    expect(security?.children[0]?.count).toBe(1);
  });
});

describe("filterPostsByCategory", () => {
  it("filters by category and subcategory", () => {
    expect(filterPostsByCategory(POSTS, { category: "정보보안" })).toHaveLength(1);
    expect(
      filterPostsByCategory(POSTS, {
        category: "정보보안",
        subcategory: "보안기사",
      })
    ).toHaveLength(1);
    expect(
      filterPostsByCategory(POSTS, {
        category: "정보보안",
        subcategory: "없는 분류",
      })
    ).toHaveLength(0);
  });
});

describe("category helpers", () => {
  it("builds human friendly labels and hrefs", () => {
    expect(getCategoryLabel(POSTS[0])).toBe("정보보안 / 보안기사");
    expect(getCategoryHref({ category: "정보보안", subcategory: "보안기사" })).toBe(
      "/blog?category=%EC%A0%95%EB%B3%B4%EB%B3%B4%EC%95%88&subcategory=%EB%B3%B4%EC%95%88%EA%B8%B0%EC%82%AC"
    );
  });
});
