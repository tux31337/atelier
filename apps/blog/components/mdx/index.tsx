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
      className="mb-8 mt-16 font-headline-lg text-headline-lg text-secondary first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HeadingProps) => (
    <h3 className="mb-4 mt-10 font-headline-lg text-2xl text-on-surface" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ParaProps) => (
    <p
      className="mb-6 font-blog-content text-blog-content leading-relaxed text-on-surface"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ListProps) => (
    <ul className="mb-6 space-y-3 pl-0" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-6 list-decimal space-y-3 pl-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => (
    <li className="flex gap-3 font-blog-content text-blog-content text-on-surface" {...props}>
      <span className="mt-1 shrink-0 text-secondary" aria-hidden="true">
        -
      </span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote
      className="my-12 border-l-2 border-border py-4 pl-8 font-blog-content text-blog-content italic text-on-surface-variant"
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
      className="text-secondary underline underline-offset-4 transition-opacity hover:opacity-75"
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
        <code className={`${className} text-on-surface`} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.875em] text-secondary"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: PreProps) => (
    <div className="mb-8">
      <div className="overflow-x-auto rounded-md border border-border bg-surface-container p-6 font-mono text-sm">
        <pre className="whitespace-pre text-on-surface" {...props}>
          {children}
        </pre>
      </div>
    </div>
  ),
  hr: () => <hr className="my-12 border-border" />,
  Callout: ({ children, title = "Insight" }: CalloutProps) => (
    <div className="my-10 rounded-md border border-border border-l-secondary bg-surface-container p-6">
      <div className="flex gap-4">
        <Lightbulb className="mt-0.5 size-6 shrink-0 text-secondary" />
        <div>
          <h4 className="mb-2 font-headline-lg text-lg text-secondary">{title}</h4>
          <div className="font-body-md text-body-md text-on-surface-variant">{children}</div>
        </div>
      </div>
    </div>
  ),
};
