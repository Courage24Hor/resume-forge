"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
          <Bell className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We&apos;re working hard to bring you this feature. It will be available soon as part of our expanding career document platform.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
