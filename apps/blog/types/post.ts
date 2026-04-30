export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
  image?: string;
  featured?: boolean;
  readingTime?: number;
};

export type PostMeta = PostFrontmatter & { slug: string };

export type Post = PostMeta & { content: string };
