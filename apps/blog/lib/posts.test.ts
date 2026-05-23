import { describe, it, expect } from "vitest";
import { estimateReadingTime, getAllPosts, parsePost } from "./posts";

describe("estimateReadingTime", () => {
  it("returns at least 1 minute for trivial content", () => {
    expect(estimateReadingTime("hello world")).toBe(1);
    expect(estimateReadingTime("")).toBe(1);
  });

  it("rounds based on ~200 words per minute", () => {
    const fiveHundredWords = Array.from({ length: 500 }, () => "w").join(" ");
    expect(estimateReadingTime(fiveHundredWords)).toBe(3);
  });
});

describe("parsePost", () => {
  const validRaw = `---
title: "Test Post"
date: "2026-05-01"
category: "Architecture"
excerpt: "A short excerpt."
tags: ["a", "b"]
---

# Body

Lorem ipsum dolor sit amet.
`;

  it("parses valid frontmatter, computes reading time, and preserves slug + body", () => {
    const post = parsePost("test-post", validRaw);
    expect(post.slug).toBe("test-post");
    expect(post.title).toBe("Test Post");
    expect(post.tags).toEqual(["a", "b"]);
    expect(post.categoryPath).toEqual(["Architecture"]);
    expect(post.image).toBeUndefined();
    expect(post.readingTime).toBeGreaterThanOrEqual(1);
    expect(post.content).toContain("Lorem ipsum");
  });

  it("rejects missing required field with the offending field named", () => {
    const raw = `---
title: "T"
date: "2026-05-01"
excerpt: "x"
tags: []
---

body
`;
    expect(() => parsePost("missing-category", raw)).toThrow(/category/);
  });

  it("rejects wrong field type", () => {
    const raw = `---
title: "T"
date: "2026-05-01"
category: "X"
excerpt: "x"
tags: "should-be-array"
---

body
`;
    expect(() => parsePost("bad-tags", raw)).toThrow(/tags/);
  });

  it("includes the slug in the error so failures point at the file", () => {
    const raw = `---
title: "T"
---

body
`;
    expect(() => parsePost("my-broken-post", raw)).toThrow(/my-broken-post\.mdx/);
  });

  it("accepts optional image and featured fields", () => {
    const raw = `---
title: "T"
date: "2026-05-01"
category: "X"
excerpt: "x"
tags: []
image: "/cover.png"
featured: true
---

body
`;
    const post = parsePost("with-optionals", raw);
    expect(post.image).toBe("/cover.png");
    expect(post.featured).toBe(true);
  });

  it("accepts optional subcategory and expands the category path", () => {
    const raw = `---
title: "T"
date: "2026-05-01"
category: "정보보안"
subcategory: "보안기사"
excerpt: "x"
tags: []
---

body
`;
    const post = parsePost("with-subcategory", raw);
    expect(post.subcategory).toBe("보안기사");
    expect(post.categoryPath).toEqual(["정보보안", "보안기사"]);
  });

  it("accepts optional draft field", () => {
    const raw = `---
title: "T"
date: "2026-05-01"
category: "X"
excerpt: "x"
tags: []
draft: true
---

body
`;
    const post = parsePost("draft-post", raw);
    expect(post.draft).toBe(true);
  });
});

describe("AWS SAA EC2 post metadata", () => {
  const topicTagsBySlug: Record<string, string> = {
    "aws-ec2-costs-and-iam-role": "EC2",
    "aws-ec2-first-website": "EC2",
    "aws-ec2-purchasing-options-and-spot": "EC2",
    "aws-ec2-security-groups": "EC2",
  };

  it("uses certification and EC2 topic tags consistently", () => {
    const postsBySlug = new Map(getAllPosts().map((post) => [post.slug, post]));

    for (const [slug, topicTag] of Object.entries(topicTagsBySlug)) {
      const post = postsBySlug.get(slug);
      expect(post).toBeDefined();
      expect(post?.category).toBe("자격증");
      expect(post?.subcategory).toBe("AWS SAA");
      expect(post?.tags).toEqual(expect.arrayContaining(["AWS", "AWS SAA", topicTag]));
    }
  });
});
