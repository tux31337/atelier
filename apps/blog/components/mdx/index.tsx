import type { ComponentPropsWithoutRef } from "react";
import { Lightbulb } from "lucide-react";

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParaProps = ComponentPropsWithoutRef<"p">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;

type CalloutProps = { children: React.ReactNode; title?: string };

export const mdxComponents = {
  h2: ({ children, ...props }: HeadingProps) => (
    <h2
      className="font-headline-lg text-headline-lg mb-8 mt-16 text-secondary first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3 className="font-headline-lg text-2xl mb-4 mt-10 text-on-surface" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ParaProps) => (
    <p
      className="font-blog-content text-blog-content text-on-surface mb-6 leading-relaxed"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ListProps) => (
    <ul className="space-y-3 mb-6 list-none pl-0" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="space-y-3 mb-6 list-none pl-0" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => (
    <li className="flex gap-3 font-blog-content text-blog-content text-on-surface" {...props}>
      <span className="text-secondary shrink-0 mt-1">—</span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote
      className="font-blog-content text-blog-content text-on-surface my-12 italic opacity-80 border-l-2 border-white/10 pl-8 py-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-secondary" {...props}>
      {children}
    </strong>
  ),
  a: ({ href, children, ...props }: AnchorProps) => (
    <a
      href={href}
      className="text-secondary underline underline-offset-4 hover:opacity-70 transition-opacity"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, className, ...props }: CodeProps) => {
    if (className) {
      return (
        <code className={`${className} text-zinc-300`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="font-mono text-[0.875em] bg-surface-container-high text-secondary px-1.5 py-0.5 rounded"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: PreProps) => (
    <div className="mb-8">
      <div className="bg-[#0e0e11] p-6 rounded-xl font-mono text-sm overflow-x-auto border border-white/5 shadow-2xl">
        <pre className="text-zinc-300 whitespace-pre" {...props}>
          {children}
        </pre>
      </div>
    </div>
  ),
  hr: () => <hr className="border-white/10 my-12" />,
  Callout: ({ children, title = "Insight" }: CalloutProps) => (
    <div className="glass-card p-8 rounded-xl my-10 border-l-4 border-secondary-fixed">
      <div className="flex gap-4">
        <Lightbulb className="text-secondary-fixed size-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-headline-lg text-lg mb-2 text-secondary-fixed">{title}</h4>
          <div className="font-body-md text-body-md text-on-surface-variant">{children}</div>
        </div>
      </div>
    </div>
  ),
};
