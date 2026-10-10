import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const DATA_DIR = process.env.DATA_DIR ?? "/data";
export const COOKIE = "ib_admin";
const DUREE = 8 * 3600; // secondes

const FICHIER_MDP = () => path.join(/*turbopackIgnore: true*/ DATA_DIR, "admin.json");
const FICHIER_SECRET = () => path.join(/*turbopackIgnore: true*/ DATA_DIR, "admin-secret");
const envMdp = () => process.env.ADMIN_PASSWORD ?? "";

// Secret de signature des sessions : aléatoire, propre au serveur, renouvelé à chaque changement de mot de passe.
let secretCache: string | null = null;
function secret(): string {
  if (secretCache) return secretCache;
  try {
    secretCache = readFileSync(FICHIER_SECRET(), "utf8").trim();
    if (secretCache) return secretCache;
  } catch { /* à créer */ }
  return renouvelerSecret();
}
function renouvelerSecret(): string {
  secretCache = randomBytes(32).toString("hex");
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FICHIER_SECRET(), secretCache, { mode: 0o600 });
  } catch { /* secret valable pour ce processus seulement */ }
  return secretCache;
}

const aMdpFichier = () => existsSync(FICHIER_MDP());
export const configure = () => aMdpFichier() || envMdp().length >= 8;

const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");
const egal = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function motDePasseOk(saisi: string): boolean {
  if (aMdpFichier()) {
    try {
      const { salt, hash } = JSON.parse(readFileSync(FICHIER_MDP(), "utf8")) as { salt: string; hash: string };
      return egal(scryptSync(saisi, Buffer.from(salt, "hex"), 64).toString("hex"), hash);
    } catch { return false; }
  }
  const ref = envMdp();
  return ref.length >= 8 && egal(createHmac("sha256", "cmp").update(saisi).digest("hex"), createHmac("sha256", "cmp").update(ref).digest("hex"));
}

export function changerMotDePasse(nouveau: string): void {
  const salt = randomBytes(16);
  const hash = scryptSync(nouveau, salt, 64).toString("hex");
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FICHIER_MDP(), JSON.stringify({ salt: salt.toString("hex"), hash, le: new Date().toISOString() }), { mode: 0o600 });
  renouvelerSecret(); // déconnecte toutes les autres sessions
}

export function creerCookie(): string {
  const exp = Math.floor(Date.now() / 1000) + DUREE;
  return `${exp}.${sign(`s:${exp}`)}`;
}

export function sessionOk(cookieHeader: string | null): boolean {
  if (!configure() || !cookieHeader) return false;
  const m = cookieHeader.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!m) return false;
  const [exp, sig] = m.slice(COOKIE.length + 1).split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return egal(sig, sign(`s:${exp}`));
}

export const cookieAttrs = (valeur: string, maxAge = DUREE) =>
  `${COOKIE}=${valeur}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

export type Devis = { ref: string; recuLe: string; pays: string; marchandise: string; nom: string; societe: string; email: string; telephone: string; message: string; langue?: string };
export type Envoi = { ref: string; recuLe: string; nom: string; email: string; telephone: string; depart: string; pays: string; chargeur: string; message: string; langue?: string; fichiers: string[] };

export async function lire<T extends { recuLe: string }>(fichier: string): Promise<T[]> {
  try {
    const brut = await readFile(path.join(/*turbopackIgnore: true*/ DATA_DIR, fichier), "utf8");
    return brut.split("\n").filter(Boolean).flatMap((l) => { try { return [JSON.parse(l) as T]; } catch { return []; } })
      .sort((a, b) => b.recuLe.localeCompare(a.recuLe));
  } catch {
    return [];
  }
}

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const REF = /^IB-\d{6}-[0-9A-F]{6}$/;
