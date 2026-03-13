import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { AuthActions } from "@/components/auth-actions";
import { createClient } from "@/lib/supabase/server";

const formatType = (value: string) => {
  if (value === "cover_letter") return "Cover Letter";
  if (value === "cv") return "CV";
  return "Resume";
};

export default async function AccountPage() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) redirect("/login");

  const tier = (user.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const isPremium = tier === "PREMIUM_14_DAY" || tier === "ANNUAL";

  const { data: documents } = await supabase
    .from("documents")
    .select("id, type, title, updated_at, created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const { data: usage } = await supabase
    .from("ai_usage")
    .select("count, reset_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const now = new Date();
  let remaining = 2;
  let resetAt = usage?.reset_at ? new Date(usage.reset_at) : null;
  if (resetAt && resetAt <= now) {
    remaining = 2;
  } else if (usage?.count != null) {
    remaining = Math.max(0, 2 - usage.count);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
          <AuthActions userEmail={user.email} tier={tier} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Account</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Your workspace</h1>
            <p className="mt-2 text-sm text-white/70">Manage your drafts and AI usage from one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/builder">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Build Resume
              </span>
            </Link>
            <Link href="/cv/start">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Build CV
              </span>
            </Link>
            <Link href="/cover-letter/builder">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Build Cover Letter
              </span>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <section className="rounded-3xl border border-white/15 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Saved drafts</h2>
            <p className="mt-1 text-sm text-white/60">Your most recent resumes, CVs, and cover letters.</p>
            <div className="mt-5 space-y-3">
              {(documents ?? []).length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#0b1224] p-4 text-sm text-white/70">
                  No drafts saved yet. Build a document and use “Save Draft.”
                </div>
              )}
              {(documents ?? []).map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-white/10 bg-[#0b1224] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {doc.title || "Untitled Draft"}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        {formatType(doc.type)} · Updated{" "}
                        {new Date(doc.updated_at ?? doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      {formatType(doc.type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Plan & AI usage</h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1224] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Plan</p>
              <p className="mt-2 text-lg font-semibold text-white">{isPremium ? "Premium" : "Free"}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1224] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">AI usage</p>
              {isPremium ? (
                <p className="mt-2 text-lg font-semibold text-white">Unlimited</p>
              ) : (
                <>
                  <p className="mt-2 text-lg font-semibold text-white">{remaining} / 2 remaining</p>
                  <p className="mt-1 text-xs text-white/50">
                    Resets {resetAt ? resetAt.toLocaleString() : "in 24 hours"}
                  </p>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
