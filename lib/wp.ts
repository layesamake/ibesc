import type { Lang } from "./i18n";
import { resolveCountryCode } from "./countries";
import fallbackPays from "../deploy/pays.json";

const WP_API = (process.env.WP_API_URL ?? "https://admin.ibesc.cloud/wp-json/wp/v2").replace(/\/+$/, "");

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

const normaliserLegacy = (value: string): string => value
  // Some historical CMS fields contain the two-character sequence "\\n".
  .replace(/\\r?\\n/g, "\n")
  // Other imports used a literal `n` as a line separator. Preserve a real
  // trailing `n` in words such as "cargaison" while removing the separator.
  .replace(/n+([.!?:;]?)(?=[A-ZÀ-ÖØ-Þ0-9])/g, (match, punctuation: string) =>
    `${match.length > 1 ? "n" : ""}${punctuation}\n`,
  )
  // Remove isolated legacy placeholders without touching normal words.
  .replace(/(^|\s)n+(?=\s|$)/gi, "$1");

const propre = (v: unknown): string => {
  const value = normaliserLegacy(String(v ?? "").trim()).trim();
  // Ignore placeholders left by the legacy import instead of presenting them as rules.
  if (/^(?:n|\s|\\t)+$/i.test(value)) return "";
  return value;
};

const lignes = (v: unknown): string[] =>
  propre(v).split("\n").map((l) => l.trim()).filter((l) => l && !/^n+$/i.test(l));

const presentation = (value: unknown): string[] => {
  const html = String(value ?? "").trim();
  // Preserve WYSIWYG markup and URLs; legacy line cleanup is for plain text only.
  return /<\/?[a-z][^>]*>/i.test(html) ? [html] : lignes(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPays(p: any): Pays {
  // Older REST responses expose registered fields under `meta`, while the
  // current ACF REST response exposes the same public fields under `acf`.
  const m = { ...p.meta, ...p.acf, ...p.ibesc };
  const fr = decode(p.title?.rendered ?? "");
  const code = resolveCountryCode(m.code_iso || m.iso || m.code, p.slug, fr);
  const localizedName = (lang: Lang) => /^[A-Z]{2}$/.test(code) ? new Intl.DisplayNames([lang], { type: "region" }).of(code) || fr : fr;
  const sec = (l: Lang): Sections => {
    const s = {} as Sections;
    for (const k of SECTIONS) {
      const read = k === "intro" ? presentation : lignes;
      const own = read(m[`${k}_${l}`]);
      s[k] = own.length ? own : read(m[`${k}_fr`]);
    }
    return s;
  };
  return {
    id: p.id,
    slug: p.slug,
    code,
    certificat: propre(m.certificat),
    certificatNom: propre(m.certificat_nom),
    valide: Boolean(m.valide_par_ibesc),
    updatedAt: typeof p.modified_gmt === "string" && Number.isFinite(Date.parse(`${p.modified_gmt}Z`)) ? `${p.modified_gmt}Z` : null,
    nom: { fr, en: String(m.titre_en || localizedName("en")), nl: String(m.titre_nl || localizedName("nl")) },
    sections: { fr: sec("fr"), en: sec("en"), nl: sec("nl") },
  };
}

// Le catalogue livré avec le site permet de continuer à afficher les
// destinations lorsque l'API WordPress est momentanément bloquée (403,
// panne réseau ou erreur de configuration). Les fiches CMS reprennent la
// priorité dès que l'API redevient disponible.
function toFallbackPays(lang: Lang): Pays[] {
  return (fallbackPays as any[]).map((p, index) => {
    const slug = String(p.nom ?? p.titres?.fr ?? `destination-${index + 1}`)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const code = resolveCountryCode(p.iso, slug, p.nom ?? p.titres?.fr);
    const sections = (l: Lang) => {
      const source = p.lang?.[l] ?? p.lang?.fr ?? {};
      return Object.fromEntries(SECTIONS.map((section) => [section, Array.isArray(source[section]) ? source[section].map(String) : []])) as Sections;
    };
    return {
      id: 900000 + index,
      slug,
      code,
      certificat: propre(p.cert),
      certificatNom: propre(p.cert_nom),
      valide: true,
      updatedAt: null,
      nom: {
        fr: String(p.titres?.fr ?? p.nom ?? slug),
        en: String(p.titres?.en ?? p.titres?.fr ?? p.nom ?? slug),
        nl: String(p.titres?.nl ?? p.titres?.fr ?? p.nom ?? slug),
      },
      sections: { fr: sections("fr"), en: sections("en"), nl: sections("nl") },
    } satisfies Pays;
  }).filter((p) => p.code && p.slug);
}

const fallback = (lang: Lang) => ({ items: toFallbackPays(lang), erreur: false });

export async function getPays(lang: Lang): Promise<{ items: Pays[]; erreur: boolean }> {
  try {
    const res = await fetch(`${WP_API}/pays?per_page=100`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!res.ok) return fallback(lang);
    const data = (await res.json()) as unknown[];
    const totalPages = Number(res.headers.get("X-WP-TotalPages")) || 1;
    const pages = await Promise.all(Array.from({ length: totalPages - 1 }, async (_, index) => {
      const page = await fetch(`${WP_API}/pays?per_page=100&page=${index + 2}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
      if (!page.ok) throw new Error("Impossible de charger les destinations.");
      return (await page.json()) as unknown[];
    }));
    data.push(...pages.flat());
    const items = data.map(toPays).sort((a, b) => a.nom[lang].localeCompare(b.nom[lang], lang));
    return { items, erreur: false };
  } catch {
    return fallback(lang);
  }
}

export type Circulaire = { id: number; source: string; titre: string; date: string; html: string };

export async function getCirculaires(lang: Lang): Promise<Circulaire[]> {
  try {
    const endpoints = ["circulaires", "posts"];
    const responses = await Promise.all(endpoints.map(async (endpoint) => {
      const res = await fetch(`${WP_API}/${endpoint}?per_page=50`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
      return res.ok ? { endpoint, items: (await res.json()) as any[] } : { endpoint, items: [] as any[] };
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return responses.flatMap(({ endpoint, items }) => items.map((c) => {
      const meta = { ...c.meta, ...c.acf, ...c.ibesc };
      const titre = lang === "fr" ? c.title?.rendered : meta[`titre_${lang}`];
      const html = lang === "fr" ? c.content?.rendered : meta[`contenu_${lang}`];
      return {
        id: c.id, source: endpoint,
        titre: decode(titre || c.title?.rendered || ""),
        date: String(c.date ?? ""),
        html: String(html || c.content?.rendered || ""),
      };
    })).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  } catch {
    return [];
  }
}
