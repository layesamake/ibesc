import { appendFile, mkdir } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { mailDevis } from "@/lib/mail";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? "/data";
const hits = new Map<string, number[]>();

function limite(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const txt = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  if (limite(ip)) {
    return NextResponse.json({ message: "Trop de demandes envoyées. Réessayez dans quelques minutes." }, { status: 429 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ message: "Demande illisible." }, { status: 400 });
  }

  // Champ piège : on répond comme si tout allait bien, sans rien enregistrer.
  if (txt(b.site, 50)) return NextResponse.json({ ref: "IB-000000-000000" });

  const d = {
    pays: txt(b.pays, 80),
    marchandise: txt(b.marchandise, 200),
    nom: txt(b.nom, 120),
    societe: txt(b.societe, 160),
    email: txt(b.email, 160),
    telephone: txt(b.telephone, 40),
    message: txt(b.message, 2000),
    langue: txt(b.langue, 2),
  };

  if (!d.pays) return NextResponse.json({ message: "Choisissez le pays de destination." }, { status: 400 });
  if (!d.marchandise) return NextResponse.json({ message: "Décrivez la marchandise à expédier." }, { status: 400 });
  if (!d.nom) return NextResponse.json({ message: "Indiquez votre nom." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return NextResponse.json({ message: "Indiquez une adresse e-mail valide." }, { status: 400 });
  }
  if (b.consentement !== "oui") {
    return NextResponse.json({ message: "Cochez la case pour que nous puissions traiter votre demande." }, { status: 400 });
  }

  const jour = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const ref = `IB-${jour}-${randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(
      path.join(DATA_DIR, "demandes.jsonl"),
      JSON.stringify({ ref, recuLe: new Date().toISOString(), ...d }) + "\n",
      { mode: 0o600 },
    );
  } catch {
    return NextResponse.json({ message: "Votre demande n'a pas pu être enregistrée. Réessayez dans un instant." }, { status: 500 });
  }

  mailDevis({ ref, recuLe: new Date().toISOString(), ...d });
  return NextResponse.json({ ref });
}
