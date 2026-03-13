"use client";

import React, { forwardRef } from "react";
import { useCoverLetterStore } from "@/hooks/use-cover-letter-store";

export const CoverLetterPreview = forwardRef<HTMLDivElement>((props, ref) => {
  const { data, accent } = useCoverLetterStore();
  const senderLine = [data.sender.fullName, data.sender.location].filter(Boolean).join(" · ");
  const contactLine = [data.sender.email, data.sender.phone].filter(Boolean).join(" · ");
  const signatureText = data.signature?.trim()
    ? data.signature
    : data.sender.fullName?.trim()
      ? ""
      : "Your Name";

  return (
    <div
      ref={ref}
      className="min-h-[29.7cm] w-full bg-white p-12 text-[#111827] shadow-2xl"
      style={{
        aspectRatio: "1 / 1.414",
        fontFamily: '"Source Serif 4", "Cambria", "Georgia", serif',
        fontSize: "11pt",
      }}
      {...props}
    >
      <div className="mb-6 border-b-2 pb-4" style={{ borderColor: accent }}>
        <p className="text-xl font-semibold">{data.sender.fullName || "Your Name"}</p>
        {senderLine && <p className="text-xs text-[#374151]">{senderLine}</p>}
        {contactLine && <p className="text-xs text-[#374151]">{contactLine}</p>}
      </div>

      <div className="space-y-5 text-sm leading-relaxed text-[#111827]">
        {(data.date || "").trim() && <p>{data.date}</p>}

        <div>
          {data.recipient.name && <p>{data.recipient.name}</p>}
          {data.recipient.title && <p>{data.recipient.title}</p>}
          {data.recipient.company && <p>{data.recipient.company}</p>}
          {data.recipient.address && <p>{data.recipient.address}</p>}
        </div>

        {data.subject && (
          <p className="font-semibold" style={{ color: accent }}>
            {data.subject}
          </p>
        )}

        <p>{data.opening || "Dear Hiring Manager,"}</p>
        <p className="whitespace-pre-line">
          {data.body ||
            "I am excited to apply for this role. With a strong background in [your field], I have delivered measurable results and collaborated across teams to drive impact."}
        </p>
        <p>{data.closing || "Thank you for your time and consideration. I would welcome the opportunity to discuss my application."}</p>

        <div className="pt-2">
          <p>Sincerely,</p>
          {signatureText && <p className="mt-3 font-semibold">{signatureText}</p>}
        </div>
      </div>
    </div>
  );
});

CoverLetterPreview.displayName = "CoverLetterPreview";
