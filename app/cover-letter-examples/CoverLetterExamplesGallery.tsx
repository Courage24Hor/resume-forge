"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

type CoverExample = {
  file: string;
  name: string;
  src: string;
};

export function CoverLetterExamplesGallery({ examples }: { examples: CoverExample[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return examples;
    return examples.filter((example) => example.name.toLowerCase().includes(normalized));
  }, [examples, query]);

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            {filtered.length} example{filtered.length === 1 ? "" : "s"}
          </p>
          <p className="mt-1 text-sm text-white/60">Search by role or title.</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search examples"
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none transition focus:border-white/30"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-lg font-semibold text-white">No matches.</p>
            <p className="mt-2 text-sm text-white/65">Try a broader keyword.</p>
          </div>
        )}

        {filtered.map((example) => (
          <div
            key={example.file}
            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <object data={example.src} type="application/pdf" className="h-full w-full">
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  Preview unavailable
                </div>
              </object>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">{example.name}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Example</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={example.src}
                target="_blank"
                className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                View PDF
              </Link>
              <Link
                href={example.src}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                <Download className="h-3 w-3" />
                Download
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
