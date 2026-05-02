import { z } from "zod";

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  category: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  featured: z.boolean().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Post = PostMeta & { content: string };
