import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { AuthActions } from "@/components/auth-actions";
import { createClient } from "@/lib/supabase/server";

type CvTemplate = {
  name: string;
  src: string;
};

const parseStyleNumber = (filename: string) => {
  const match = filename.match(/(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

export default async function CvTemplatesPage() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userEmail = auth.user?.email ?? null;
  const tier = (auth.user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const directoryPath = path.join(process.cwd(), "public", "template-thumbs-two", "CVs");
  let templates: CvTemplate[] = [];

  try {
    const files = await fs.readdir(directoryPath);
    templates = files
      .filter((file) => file.toLowerCase().endsWith(".png"))
      .sort((a, b) => parseStyleNumber(a) - parseStyleNumber(b))
      .map((file) => ({
        name: file.replace(/\.png$/i, "").replace(/_/g, " "),
        src: `/template-thumbs-two/CVs/${file}`,
      }));
  } catch {
    templates = [];
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">CV Templates</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Choose a CV layout that fits your story.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/72">
              Browse clean, recruiter-friendly CV styles and pick a visual structure that matches your profile.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/cv/start">
              <Button className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">Build My CV</Button>
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <p className="text-lg font-semibold text-white">No CV templates found.</p>
              <p className="mt-2 text-sm text-white/65">Add template previews to load this gallery.</p>
            </div>
          )}

          {templates.map((template) => (
            <div
              key={template.src}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image
                  src={template.src}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{template.name}</p>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Template
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
