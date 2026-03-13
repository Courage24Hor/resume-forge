"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";

type BuildMode = "scratch" | "upload" | null;

export default function StartModePage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const [selectedMode, setSelectedMode] = useState<BuildMode>("scratch");
  const [templateName, setTemplateName] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("elevateCvResumeTemplate");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { id?: string };
      if (parsed?.id) setTemplateName(parsed.id);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#e8edf8]">
      <header className="border-b border-white/10 bg-[#0a0f1c]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-white">Elevate</span>
            <span className="text-[#fb923c]">CV</span>
          </Link>
          <AuthActions userEmail={user?.email} loading={loading} tier={tier} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/start")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-8 rounded-3xl border border-white/15 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Template Selected</p>
          <p className="mt-2 text-sm text-white/80">
            {templateName ? `You chose template: ${templateName}.` : "No template selected yet."}
          </p>

          <h1 className="mt-6 text-3xl font-semibold text-white">Are you uploading an existing resume?</h1>
          <p className="mt-2 text-sm text-white/70">
            Just review, edit, and update it with new information.
          </p>

          <div className="mt-6 grid gap-4">
            <button
              type="button"
              onClick={() => setSelectedMode("scratch")}
              className={`rounded-2xl border px-5 py-5 text-left transition ${
                selectedMode === "scratch"
                  ? "border-[#fb923c]/70 bg-[#111827] text-white"
                  : "border-white/15 bg-white/5 text-white/80 hover:border-[#fb923c]/60"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fb923c]">Recommended for you</p>
              <p className="mt-2 text-lg font-semibold">No, start from scratch</p>
              <p className="mt-2 text-sm text-white/70">
                We&apos;ll guide you through the whole process so your skills can shine.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode("upload")}
              className={`rounded-2xl border px-5 py-5 text-left transition ${
                selectedMode === "upload"
                  ? "border-[#fb923c]/70 bg-[#111827] text-white"
                  : "border-white/15 bg-white/5 text-white/80 hover:border-[#fb923c]/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <UploadCloud className="h-5 w-5 text-white/70" />
                <p className="text-lg font-semibold">Yes, upload from my resume</p>
              </div>
              <p className="mt-2 text-sm text-white/70">
                We&apos;ll give you expert guidance to fill out your info and enhance your resume, from start to finish.
              </p>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/start">
              <Button className="h-11 bg-white/10 px-6 text-white hover:bg-white/15">Back to templates</Button>
            </Link>
            <Button
              className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]"
              onClick={() => {
                localStorage.setItem("elevateCvResumeMode", selectedMode ?? "scratch");
                router.push(selectedMode === "upload" ? "/start/upload" : "/start/progress");
              }}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
