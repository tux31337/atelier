import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostFrontmatterSchema, type Post, type PostMeta } from "@/types/post";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const result = PostFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid frontmatter in "${slug}.mdx" — ${issues}`);
  }
  return {
    slug,
    content,
    ...result.data,
    readingTime: estimateReadingTime(content),
  };
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      return parsePost(slug, raw);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  return parsePost(slug, raw);
}

export function postExists(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.mdx`));
}
