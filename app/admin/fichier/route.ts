import { readFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR, lire, REF, sessionOk, type Envoi } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!sessionOk(req.headers.get("cookie"))) return new Response("Non autorisé", { status: 401 });
  const u = new URL(req.url);
  const ref = u.searchParams.get("ref") ?? "";
  const f = u.searchParams.get("f") ?? "";
  if (!REF.test(ref)) return new Response("Introuvable", { status: 404 });
  // Seuls les fichiers enregistrés dans la demande peuvent être téléchargés.
  const envoi = (await lire<Envoi>("documents.jsonl")).find((e) => e.ref === ref);
  if (!envoi || !envoi.fichiers.includes(f) || f !== path.basename(f)) return new Response("Introuvable", { status: 404 });
  try {
    const data = await readFile(path.join(/*turbopackIgnore: true*/ DATA_DIR, "documents", ref, f));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${f.replace(/[^A-Za-z0-9._-]/g, "_")}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
