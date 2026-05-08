import { z } from "zod";

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
  categoryPath: string[];
};

export type Post = PostMeta & { content: string };
