import { Globe, AtSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0B] border-t border-white/5 py-12 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-8 max-w-7xl mx-auto">
        <p className="font-code-label text-code-label uppercase text-zinc-400 opacity-80">
          © 2024 Creative Developer. Built with Precision.
        </p>

        <div className="flex gap-12">
          {(["Source", "Connect", "Status"] as const).map((label) => (
            <a
              key={label}
              href="#"
              className="font-code-label text-code-label uppercase text-zinc-600 hover:text-zinc-100 underline decoration-zinc-700 underline-offset-4 opacity-80 hover:opacity-100 transition-all"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex gap-4">
          <Globe className="text-zinc-600 hover:text-white transition-colors cursor-pointer size-5" />
          <AtSign className="text-zinc-600 hover:text-white transition-colors cursor-pointer size-5" />
        </div>
      </div>
    </footer>
  );
}
