import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive",
};

export default function ArchivePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32">
      <header className="space-y-6">
        <h1 className="font-display-xl text-display-xl text-on-surface">
          Archive
        </h1>
        <p className="font-blog-content text-blog-content text-on-surface-variant max-w-[580px] italic">
          A chronological record of every entry. Compilation in progress.
        </p>
      </header>
    </div>
  );
}
