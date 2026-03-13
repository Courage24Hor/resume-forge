import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { CoverLetterExamplesGallery } from "./CoverLetterExamplesGallery";
import { AuthActions } from "@/components/auth-actions";
import { createClient } from "@/lib/supabase/server";

type CoverExample = {
  file: string;
  name: string;
  src: string;
};

const toTitle = (filename: string) =>
  filename
    .replace(/\.pdf$/i, "")
    .replace(/^CoverLetter_/i, "")
    .replace(/_/g, " ");

export default async function CoverLetterExamplesPage() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userEmail = auth.user?.email ?? null;
  const tier = (auth.user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const examplesDir = path.join(process.cwd(), "..", "templates", "Cover_Letters");
  let examples: CoverExample[] = [];

  try {
    const files = await fs.readdir(examplesDir);
    examples = files
      .filter((file) => file.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => ({
        file,
        name: toTitle(file),
        src: `/api/cover-letter-examples/${encodeURIComponent(file)}`,
      }));
  } catch {
    examples = [];
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
          <AuthActions userEmail={userEmail} tier={tier} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Cover Letter Examples</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Review cover letter examples by role.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/72">
              Open any example to see a complete cover letter structure and tone for a specific role.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/cover-letter-templates">
              <Button className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">Browse Templates</Button>
            </Link>
          </div>
        </div>

        {examples.length === 0 ? (
          <section className="mt-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <p className="text-lg font-semibold text-white">No cover letter examples found.</p>
              <p className="mt-2 text-sm text-white/65">Add example PDFs to load this gallery.</p>
            </div>
          </section>
        ) : (
          <CoverLetterExamplesGallery examples={examples} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
