// Code numérique ISO 3166-1 de chaque pays, pour repérer son tracé sur la carte.
export const ISO_NUM: Record<string, number> = {
  AO: 24, BJ: 204, BF: 854, BI: 108, CM: 120, CF: 140, TD: 148, CD: 180, CG: 178, CI: 384,
  GA: 266, GH: 288, GW: 624, GN: 324, GQ: 226, LR: 430, LY: 434, MG: 450, ML: 466, NE: 562,
  NG: 566, SN: 686, SL: 694, SO: 706, SS: 728, TG: 768, EG: 818, GM: 270, YE: 887, DJ: 262,
};

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

export type Region = "west" | "central" | "other";
// Regroupement du prototype. « other » couvre les autres zones, Yémen compris.
const WEST = ["BJ", "BF", "CI", "GM", "GH", "GW", "GN", "LR", "ML", "NE", "NG", "SN", "SL", "TG"];
const CENTRAL = ["AO", "CM", "CF", "CG", "GA", "GQ", "CD", "TD"];
export const regionOf = (code: string): Region => {
  const c = code.toUpperCase();
  return WEST.includes(c) ? "west" : CENTRAL.includes(c) ? "central" : "other";
};
