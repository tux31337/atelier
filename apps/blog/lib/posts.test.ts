import { describe, it, expect } from "vitest";
import { estimateReadingTime, parsePost } from "./posts";

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
});
