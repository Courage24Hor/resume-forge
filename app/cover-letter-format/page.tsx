import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { AuthActions } from "@/components/auth-actions";
import { createClient } from "@/lib/supabase/server";

export default async function CoverLetterFormatPage() {
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Cover Letter Format</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">A clean, modern cover letter structure.</h1>
          <p className="mt-4 text-sm text-white/70">
            Keep it concise, role-specific, and focused on outcomes. Aim for 250-350 words.
          </p>

          <div className="mt-8 space-y-6 text-sm text-white/75">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Recommended Sections</p>
              <ol className="mt-3 space-y-2">
                <li>1. Header: your name, email, phone, location, date.</li>
                <li>2. Recipient: name, title, company, address.</li>
                <li>3. Subject line: role + company.</li>
                <li>4. Opening: why you are applying and how you fit.</li>
                <li>5. Body: 2 short paragraphs with proof and results.</li>
                <li>6. Closing: enthusiasm + next step.</li>
                <li>7. Signature.</li>
              </ol>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Body Paragraph Guide</p>
              <ol className="mt-3 space-y-2">
                <li>1. Match: connect your experience to the role requirements.</li>
                <li>2. Proof: mention 1-2 quantified outcomes or projects.</li>
                <li>3. Fit: show alignment with the company or mission.</li>
              </ol>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Tone Tips</p>
              <ol className="mt-3 space-y-2">
                <li>1. Use active verbs and measurable impact.</li>
                <li>2. Avoid repeating your resume verbatim.</li>
                <li>3. Keep sentences short and easy to scan.</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cover-letter/builder">
              <Button className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]">Build My Cover Letter</Button>
            </Link>
            <Link href="/cover-letter-examples">
              <Button className="h-11 bg-white/10 px-6 text-white hover:bg-white/15">See Examples</Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
