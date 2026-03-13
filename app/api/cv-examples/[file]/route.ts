import fs from "fs/promises";
import path from "path";

const isSafeFilename = (file: string) => /^[A-Za-z0-9_()-]+\.pdf$/.test(file);

export async function GET(
  _request: Request,
  { params }: { params: { file: string } }
) {
  const decoded = decodeURIComponent(params.file || "");
  const file = path.basename(decoded);

  if (!isSafeFilename(file)) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "..", "templates", "CVs", file);

  try {
    const data = await fs.readFile(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${file}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
