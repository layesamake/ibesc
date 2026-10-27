import countryCodes from "./country-codes.json";

// ISO 3166-1 / Unicode CLDR 48. See docs/ajout-pays.md for data sources.
// This registry includes every country, independently of the CMS destinations.
export const ISO_NUM: Record<string, number> = Object.fromEntries(
  countryCodes.map(({ alpha2, numeric }) => [alpha2, numeric]),
);
const ISO3_TO_2 = new Map(countryCodes.map(({ alpha2, alpha3 }) => [alpha3, alpha2]));
const NUM_TO_2 = new Map(countryCodes.map(({ alpha2, numeric }) => [numeric, alpha2]));

const countryKey = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const CODE_BY_NAME = new Map<string, string>();
for (const lang of ["fr", "en", "nl"]) {
  const names = new Intl.DisplayNames([lang], { type: "region" });
  for (const { alpha2 } of countryCodes) {
    const name = names.of(alpha2);
    if (name) CODE_BY_NAME.set(countryKey(name), alpha2);
  }
}

// Secours pour les fiches WordPress historiques dont le champ code_iso n'est pas exposé dans l'API REST.
export const ISO_BY_SLUG: Record<string, string> = {
  angola: "AO", benin: "BJ", "burkina-faso": "BF", burundi: "BI", cameroun: "CM",
  "republique-centrafricaine": "CF", tchad: "TD", "republique-democratique-du-congo": "CD",
  "republique-du-congo": "CG", "cote-divoire": "CI", gabon: "GA", ghana: "GH",
  "guinee-bissau": "GW", "guinee-conakry": "GN", "guinee-equatoriale": "GQ", liberia: "LR",
  libye: "LY", madagascar: "MG", mali: "ML", niger: "NE", nigeria: "NG", senegal: "SN",
  "sierra-leone": "SL", somalie: "SO", "soudan-du-sud": "SS", togo: "TG", egypte: "EG",
  gambie: "GM", yemen: "YE", djibouti: "DJ",
};

export function normalizeCountryCode(value: unknown): string {
  const code = String(value ?? "").trim().toUpperCase();
  if (Object.hasOwn(ISO_NUM, code)) return code;
  if (/^\d{1,3}$/.test(code)) return NUM_TO_2.get(Number(code)) ?? "";
  return ISO3_TO_2.get(code) ?? "";
}

export function resolveCountryCode(value: unknown, slug = "", name = ""): string {
  return normalizeCountryCode(value)
    || ISO_BY_SLUG[slug]
    || CODE_BY_NAME.get(countryKey(slug))
    || CODE_BY_NAME.get(countryKey(name))
    || "";
}

export type Region = "west" | "central" | "other";
// Regroupement du prototype. « other » couvre les autres zones, Yémen compris.
const WEST = ["BJ", "BF", "CI", "GM", "GH", "GW", "GN", "LR", "ML", "NE", "NG", "SN", "SL", "TG"];
const CENTRAL = ["AO", "CM", "CF", "CG", "GA", "GQ", "CD", "TD"];
export const regionOf = (code: string): Region => {
  const c = code.toUpperCase();
  return WEST.includes(c) ? "west" : CENTRAL.includes(c) ? "central" : "other";
};
