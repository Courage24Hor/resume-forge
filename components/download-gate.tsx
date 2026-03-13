"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Lock, Star, Zap } from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";

export function DownloadGate({
  isSubscribed,
  onDownload,
  onDownloadTxt,
  onDownloadDoc,
}: {
  isSubscribed: boolean,
  onDownload: () => void,
  onDownloadTxt?: () => void,
  onDownloadDoc?: () => void,
}) {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    window.location.href = "/login";
  };

  const handlePayment = async () => {
    if (!user) {
      handleAuth();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payments/initialize', { method: 'POST' });
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Payment failed to initialize");
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="space-y-3">
        <Button onClick={onDownload} size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 text-xl">
          <Zap className="mr-2 fill-current" /> Download PDF
        </Button>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button onClick={onDownloadTxt} className="h-11 bg-white/10 text-white hover:bg-white/15 border border-white/20">
            Download TXT
          </Button>
          <Button onClick={onDownloadDoc} className="h-11 bg-white/10 text-white hover:bg-white/15 border border-white/20">
            Download Word (.doc)
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative group overflow-hidden rounded-xl border border-white/20 bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90 z-10" />
        <div className="relative z-20 p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#f97316]/10 rounded-full flex items-center justify-center mb-6 border border-[#f97316]/30">
            <Lock className="w-10 h-10 text-[#fb923c]" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 italic">Save your progress to continue.</h3>
          <p className="text-white/70 mb-6 font-medium">
            Sign in or create an account. Your resume draft stays safe and ready for final download.
          </p>
          <div className="w-full max-w-sm p-6 border border-[#f97316]/40 rounded-2xl bg-white shadow-xl">
            <Button
              onClick={handleAuth}
              className="w-full h-12 text-lg font-black uppercase tracking-wider bg-[#f97316] text-white hover:bg-[#ea580c]"
            >
              Login / Sign Up
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/50">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            SECURE ACCOUNT ACCESS WITH SUPABASE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-xl border border-white/20 bg-[#0f172a]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90 z-10" />

      <div className="relative z-20 p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#f97316]/10 rounded-full flex items-center justify-center mb-6 border border-[#f97316]/30">
          <Lock className="w-10 h-10 text-[#fb923c]" />
        </div>

        <h3 className="text-2xl font-black text-white mb-2 italic">You&apos;re almost there.</h3>
        <p className="text-white/70 mb-6 font-medium">One final step unlocks your downloadable, application-ready resume.</p>

        <div className="w-full max-w-sm p-6 border border-[#f97316]/40 rounded-2xl bg-white shadow-xl mb-6 transform group-hover:scale-105 transition-transform">
          <div className="inline-block px-3 py-1 bg-[#ffedd5] text-[#9a3412] text-[10px] font-black rounded-full uppercase mb-2">
            Premium Access
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase mb-1">Premium Pass (MoMo/Card)</p>
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-4xl font-black text-primary">GHS 29</span>
            <span className="text-lg font-bold text-gray-400 line-through">GHS 59</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">Unlimited Downloads for 14 Days</p>

          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-center text-sm font-semibold text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-2" /> ATS-Optimized Format
            </li>
            <li className="flex items-center text-sm font-semibold text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-2" /> AI-Enhanced Content
            </li>
            <li className="flex items-center text-sm font-semibold text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-2" /> Ghana Jobs Network Access
            </li>
          </ul>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-12 text-lg font-black uppercase tracking-wider bg-[#f97316] text-white hover:bg-[#ea580c]"
          >
            {loading ? "Processing..." : "Unlock & Download Now"}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-white/50">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          SECURE PAYMENT VIA PAYSTACK (MOMO & CARD)
        </div>
      </div>
    </div>
  );
}
