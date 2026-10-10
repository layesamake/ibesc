import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { mailEnvoi } from "@/lib/mail";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? "/data";
const MAX_FILE = 10 * 1024 * 1024;
const MAX_TOTAL = 35 * 1024 * 1024;
const EXT = new Set([".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"]);
const FIELDS = ["bl", "facture", "export", "autre"];
const hits = new Map<string, number[]>();

function limite(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 4;
}

const txt = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const nomSur = (n: string) => n.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "").slice(-80) || "fichier";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  if (limite(ip)) return NextResponse.json({ message: "rate" }, { status: 429 });

  let f: FormData;
  try { f = await req.formData(); } catch { return NextResponse.json({ message: "illisible" }, { status: 400 }); }

  if (txt(f.get("site"), 50)) return NextResponse.json({ ref: "IB-000000-000000" });

  const d = {
    nom: txt(f.get("nom"), 160), email: txt(f.get("email"), 160), telephone: txt(f.get("telephone"), 40),
    depart: txt(f.get("depart"), 10), pays: txt(f.get("pays"), 80), chargeur: txt(f.get("chargeur"), 80),
    message: txt(f.get("message"), 2000), langue: txt(f.get("langue"), 2),
  };
  if (!d.nom || !d.pays || !d.chargeur || !/^\d{4}-\d{2}-\d{2}$/.test(d.depart)) return NextResponse.json({ message: "champs" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return NextResponse.json({ message: "email" }, { status: 400 });
  if (f.get("consentement") !== "oui") return NextResponse.json({ message: "consentement" }, { status: 400 });

  const fichiers: { champ: string; file: File }[] = [];
  let total = 0;
  for (const champ of FIELDS) {
    const v = f.get(champ);
    if (!(v instanceof File) || v.size === 0) continue;
    const ext = path.extname(v.name).toLowerCase();
    if (!EXT.has(ext)) return NextResponse.json({ message: "type" }, { status: 400 });
    if (v.size > MAX_FILE) return NextResponse.json({ message: "taille" }, { status: 413 });
    total += v.size;
    fichiers.push({ champ, file: v });
  }
  if (total > MAX_TOTAL) return NextResponse.json({ message: "taille" }, { status: 413 });
  if (!fichiers.some((x) => x.champ === "bl") || !fichiers.some((x) => x.champ === "facture")) {
    return NextResponse.json({ message: "fichiers" }, { status: 400 });
  }

  const jour = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const ref = `IB-${jour}-${randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    const dir = path.join(DATA_DIR, "documents", ref);
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const noms: string[] = [];
    for (const { champ, file } of fichiers) {
      const nom = `${champ}-${nomSur(file.name)}`;
      await writeFile(path.join(dir, nom), Buffer.from(await file.arrayBuffer()), { mode: 0o600 });
      noms.push(nom);
    }
    await appendFile(path.join(DATA_DIR, "documents.jsonl"), JSON.stringify({ ref, recuLe: new Date().toISOString(), ...d, fichiers: noms }) + "\n", { mode: 0o600 });
    mailEnvoi({ ref, recuLe: new Date().toISOString(), ...d, fichiers: noms });
  } catch {
    return NextResponse.json({ message: "stockage" }, { status: 500 });
  }
  return NextResponse.json({ ref });
}
