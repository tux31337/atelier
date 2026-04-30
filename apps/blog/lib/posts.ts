import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter, PostMeta } from "@/types/post";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const fm = data as PostFrontmatter;
      return {
        slug,
        ...fm,
        readingTime: estimateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return {
    slug,
    content,
    ...fm,
    readingTime: estimateReadingTime(content),
  };
}

export function postExists(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.mdx`));
}
