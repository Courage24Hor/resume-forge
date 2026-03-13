import type { useCoverLetterStore } from "@/hooks/use-cover-letter-store";

type CoverState = ReturnType<typeof useCoverLetterStore.getState>;

function makeFileName(prefix: string) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `${prefix}-${ts}`;
}

function triggerDownload(content: string, type: string, filename: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCoverLetterTxt(state: Pick<CoverState, "data">) {
  const { data } = state;
  const body = [
    data.date,
    data.recipient.name,
    data.recipient.title,
    data.recipient.company,
    data.recipient.address,
    "",
    data.subject ? `Subject: ${data.subject}` : "",
    "",
    data.opening,
    "",
    data.body,
    "",
    data.closing,
    "",
    "Sincerely,",
    data.signature || data.sender.fullName,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
  triggerDownload(body, "text/plain;charset=utf-8", `${makeFileName("cover-letter")}.txt`);
}

export function downloadCoverLetterDoc(state: Pick<CoverState, "data">) {
  const { data } = state;
  const html = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Cambria, Georgia, serif; color: #111827; padding: 24px;">
        <p>${data.date ?? ""}</p>
        <p>${data.recipient.name ?? ""}</p>
        <p>${data.recipient.title ?? ""}</p>
        <p>${data.recipient.company ?? ""}</p>
        <p>${data.recipient.address ?? ""}</p>
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
        <p>${data.opening ?? ""}</p>
        <p style="white-space: pre-line;">${data.body ?? ""}</p>
        <p>${data.closing ?? ""}</p>
        <p>Sincerely,</p>
        <p><strong>${data.signature || data.sender.fullName || ""}</strong></p>
      </body>
    </html>
  `;
  triggerDownload(html, "application/msword", `${makeFileName("cover-letter")}.doc`);
}
