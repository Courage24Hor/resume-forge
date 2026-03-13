import type { useCvStore } from "@/hooks/use-cv-store";
import { buildOrderedCvBlocks } from "@/lib/cv-export";

type CvState = ReturnType<typeof useCvStore.getState>;

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

export function downloadCvTxt(state: Pick<CvState, "template" | "data">) {
  const blocks = buildOrderedCvBlocks(state);
  const body = blocks
    .map((block) => `${block.title}\n${"-".repeat(block.title.length)}\n${block.lines.join("\n")}`)
    .join("\n\n");
  triggerDownload(body, "text/plain;charset=utf-8", `${makeFileName("cv")}.txt`);
}

export function downloadCvDoc(state: Pick<CvState, "template" | "data">) {
  const blocks = buildOrderedCvBlocks(state);
  const sectionHtml = blocks
    .map(
      (block) => `
      <h2 style="font-size:14px; margin:18px 0 8px; text-transform:uppercase; letter-spacing:1px;">${block.title}</h2>
      ${block.lines.map((line) => `<p style="margin:4px 0; font-size:12px;">${line}</p>`).join("")}
    `
    )
    .join("");
  const html = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Cambria, Georgia, serif; color: #111827; padding: 24px;">
        ${sectionHtml}
      </body>
    </html>
  `;
  triggerDownload(html, "application/msword", `${makeFileName("cv")}.doc`);
}
