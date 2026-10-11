import type { Lang } from "./i18n";
import { ISO_BY_SLUG } from "./countries";

const WP_API = process.env.WP_API_URL ?? "https://ibesc.samatech.cloud/wp-json/wp/v2";

export const SECTIONS = ["intro", "ports", "docs", "infos", "procedure", "delais", "penalites"] as const;
export type Section = (typeof SECTIONS)[number];
export type Sections = Record<Section, string[]>;

export type Pays = {
  id: number;
  slug: string;
  code: string;
  certificat: string;
  certificatNom: string;
  valide: boolean;
  updatedAt: string | null;
  nom: Record<Lang, string>;
  sections: Record<Lang, Sections>;
};

const NOMMEES: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  hellip: "…", ndash: "–", mdash: "—", laquo: "«", raquo: "»",
};

export function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, n) => NOMMEES[n.toLowerCase()] ?? m);
}

const lignes = (v: unknown): string[] =>
  String(v ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPays(p: any): Pays {
  const m = p.meta ?? {};
  const fr = decode(p.title?.rendered ?? "");
  const code = String(m.code_iso ?? m.iso ?? m.code ?? "").toUpperCase() || ISO_BY_SLUG[p.slug] || "";
  const localizedName = (lang: Lang) => /^[A-Z]{2}$/.test(code) ? new Intl.DisplayNames([lang], { type: "region" }).of(code) || fr : fr;
  const sec = (l: Lang): Sections => {
    const s = {} as Sections;
    for (const k of SECTIONS) {
      const own = lignes(m[`${k}_${l}`]);
      s[k] = own.length ? own : lignes(m[`${k}_fr`]);
    }
    return s;
  };
  return {
    id: p.id,
    slug: p.slug,
    code,
    certificat: String(m.certificat ?? ""),
    certificatNom: String(m.certificat_nom ?? ""),
    valide: Boolean(m.valide_par_ibesc),
    updatedAt: typeof p.modified_gmt === "string" && Number.isFinite(Date.parse(`${p.modified_gmt}Z`)) ? `${p.modified_gmt}Z` : null,
    nom: { fr, en: String(m.titre_en || localizedName("en")), nl: String(m.titre_nl || localizedName("nl")) },
    sections: { fr: sec("fr"), en: sec("en"), nl: sec("nl") },
  };
}

export async function getPays(lang: Lang): Promise<{ items: Pays[]; erreur: boolean }> {
  try {
    const res = await fetch(`${WP_API}/pays?per_page=100`, { next: { revalidate: 60 } });
    if (!res.ok) return { items: [], erreur: true };
    const data = (await res.json()) as unknown[];
    const items = data.map(toPays).sort((a, b) => a.nom[lang].localeCompare(b.nom[lang], lang));
    return { items, erreur: false };
  } catch {
    return { items: [], erreur: true };
  }
}

export type Circulaire = { id: number; titre: string; date: string; html: string };

export async function getCirculaires(): Promise<Circulaire[]> {
  try {
    const res = await fetch(`${WP_API}/circulaires?per_page=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((await res.json()) as any[]).map((c) => ({
      id: c.id, titre: decode(c.title?.rendered ?? ""), date: String(c.date ?? ""), html: String(c.content?.rendered ?? ""),
    }));
  } catch {
    return [];
  }
}
