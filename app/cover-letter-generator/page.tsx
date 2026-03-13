import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { AuthActions } from "@/components/auth-actions";
import { createClient } from "@/lib/supabase/server";

export default async function CoverLetterGeneratorPage() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userEmail = auth.user?.email ?? null;
  const tier = (auth.user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
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

      <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Cover Letter Generator</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">AI cover letter drafting is next.</h1>
          <p className="mt-4 text-sm text-white/70">
            We will add a guided AI workflow that drafts a tailored cover letter from your role and experience.
          </p>
          <div className="mt-6">
            <Link href="/cover-letter-templates">
              <Button className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">Browse Templates</Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
