"use client";

import Link from "next/link";
import { ChevronLeft, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { parseCvText } from "@/lib/cv-import";
import { useAuthUser } from "@/hooks/use-auth-user";
import { AuthActions } from "@/components/auth-actions";

export default function CvUploadPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const tier = (user?.user_metadata as { tier?: string } | undefined)?.tier ?? null;
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFile(file);
    setFileName(file.name);
    setMessage("");
  };

  const handleParse = async () => {
    if (!fileName || !file) return;
    setParsing(true);
    setMessage("");

    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      try {
        const raw = await file.text();
        const parsed = parseCvText(raw);
        localStorage.setItem("elevateCvCvUploadParsed", JSON.stringify(parsed));
        setMessage("Import complete. We extracted what we could from your text CV.");
      } catch {
        setMessage("Could not parse this file. You can still continue and fill details manually.");
      }
    } else {
      localStorage.setItem("elevateCvCvUploadParsed", JSON.stringify({}));
      setMessage("File uploaded. Full PDF/DOCX extraction will be added next phase, you can continue now.");
    }

    let value = 0;
    const interval = setInterval(() => {
      value += 8;
      setProgress(Math.min(100, value));
      if (value >= 100) {
        clearInterval(interval);
        localStorage.setItem("elevateCvCvUpload", JSON.stringify({ status: "parsed", fileName }));
        router.push("/cv/progress");
      }
    }, 120);
  };

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

      <main className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-8 rounded-3xl border border-white/15 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold text-white">Upload your existing CV</h1>
          <p className="mt-2 text-sm text-white/70">
            We&apos;ll parse this later. For now, you can continue with guided steps.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-[#0f172a] px-6 py-12 text-center">
            <UploadCloud className="h-10 w-10 text-white/50" />
            <p className="mt-4 text-sm font-semibold text-white/80">Drag & drop your CV here</p>
            <p className="mt-1 text-xs text-white/50">PDF, DOCX, or TXT up to 10MB</p>
            <label className="mt-6 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-white/10 px-5 text-sm font-medium text-white hover:bg-white/15">
              Select a file
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            {fileName && <p className="mt-3 text-xs text-white/60">Selected: {fileName}</p>}
            {message && <p className="mt-3 text-xs text-[#fb923c]">{message}</p>}
          </div>

          {parsing && (
            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#f97316]" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/50">Parsing CV... {progress}%</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/cv/start">
              <Button className="h-11 bg-white/10 px-6 text-white hover:bg-white/15">Back to templates</Button>
            </Link>
            <Button
              className="h-11 bg-[#f97316] px-6 text-white hover:bg-[#ea580c]"
              onClick={handleParse}
              disabled={!fileName || parsing}
            >
              {parsing ? "Parsing..." : "Continue"}
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
