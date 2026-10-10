// Code numérique ISO 3166-1 de chaque pays, pour repérer son tracé sur la carte.
export const ISO_NUM: Record<string, number> = {
  AO: 24, BJ: 204, BF: 854, BI: 108, CM: 120, CF: 140, TD: 148, CD: 180, CG: 178, CI: 384,
  GA: 266, GH: 288, GW: 624, GN: 324, GQ: 226, LR: 430, LY: 434, MG: 450, ML: 466, NE: 562,
  NG: 566, SN: 686, SL: 694, SO: 706, SS: 728, TG: 768, EG: 818, GM: 270, YE: 887, DJ: 262,
};

export type Region = "west" | "central" | "other";
// Regroupement du prototype. « other » couvre les autres zones, Yémen compris.
const WEST = ["BJ", "BF", "CI", "GM", "GH", "GW", "GN", "LR", "ML", "NE", "NG", "SN", "SL", "TG"];
const CENTRAL = ["AO", "CM", "CF", "CG", "GA", "GQ", "CD", "TD"];
export const regionOf = (code: string): Region => {
  const c = code.toUpperCase();
  return WEST.includes(c) ? "west" : CENTRAL.includes(c) ? "central" : "other";
};
