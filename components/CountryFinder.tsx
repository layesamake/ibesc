"use client";

import Link from "next/link";
import { useId, useMemo, useState, type CSSProperties } from "react";
import Flag from "./Flag";
import { regionOf, type Region } from "@/lib/countries";
import type { PaysLite } from "./CountryMenu";

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Filtre = "all" | Region;

export type FinderText = {
  filtersLabel: string; searchLabel: string; searchPh: string; none: string; reset: string;
  all: string; west: string; central: string; other: string;
  showAll: string; bottom: string; results: string;
};

// Annuaire des pays : recherche (nom, sigle), filtres régionaux, 8 cartes au repos puis tous les pays.
// `limit` = nombre de cartes visibles au repos ; une recherche ou un filtre actif affiche tous ses résultats.
export default function CountryFinder({ lang, pays, text, limit = 8, bottom = true }: {
  lang: string; pays: PaysLite[]; text: FinderText; limit?: number; bottom?: boolean;
}) {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Filtre>("all");
  const [expanded, setExpanded] = useState(false);
  const searchId = useId();

  const avecRegion = useMemo(() => pays.map((p) => ({ ...p, region: regionOf(p.code) })), [pays]);
  const terme = fold(q.trim());
  const trouves = useMemo(
    () => avecRegion.filter((p) =>
      (region === "all" || p.region === region) &&
      (!terme || fold(`${p.nom} ${p.certificat}`).includes(terme) || fold(p.code) === terme)),
    [avecRegion, region, terme],
  );
  const filtreActif = terme !== "" || region !== "all";
  const replie = !filtreActif && !expanded && trouves.length > limit;
  const visibles = replie ? trouves.slice(0, limit) : trouves;

  const filtres: [Filtre, string][] = [
    ["all", text.all], ["west", text.west], ["central", text.central], ["other", text.other],
  ];
  const reinitialiser = () => { setQ(""); setRegion("all"); };

  return (
    <div className="directory">
      <div className="directory-tools">
        <div className="filters" role="group" aria-label={text.filtersLabel}>
          {filtres.map(([cle, libelle]) => (
            <button key={cle} type="button" className={region === cle ? "selected" : undefined} aria-pressed={region === cle} onClick={() => setRegion(cle)}>
              {libelle}{cle === "all" ? <span>{pays.length}</span> : null}
            </button>
          ))}
        </div>
        <label className="search" htmlFor={searchId}>
          <span aria-hidden="true">⌕</span>
          <input id={searchId} type="search" inputMode="search" autoComplete="off" placeholder={text.searchPh} aria-label={text.searchLabel} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{trouves.length === 0 ? text.none : text.results.replace("{shown}", String(visibles.length)).replace("{total}", String(trouves.length))}</p>

      {trouves.length === 0 ? (
        <div className="directory-empty">
          <p>{text.none}</p>
          <button type="button" className="text-link" onClick={reinitialiser}>{text.reset}</button>
        </div>
      ) : (
        <ul className="country-grid">
          {visibles.map((p, i) => (
            <li key={p.slug} style={{ "--card-index": Math.min(i, 7) } as CSSProperties}>
              <Link href={`/${lang}/pays/${p.slug}`} className="country-card" aria-label={p.certificat ? `${p.nom}, ${p.certificat}` : p.nom}>
                <Flag code={p.code} />
                <span className="country-card__copy">
                  <strong>{p.nom}</strong>
                  {p.certificat ? <small>{p.certificat}</small> : null}
                </span>
                <span className="arrow" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {bottom ? (
        <div className="directory-bottom">
          <span>{text.bottom}</span>
          {replie ? (
            <button type="button" className="text-link" onClick={() => setExpanded(true)}>{text.showAll} <span aria-hidden="true">↗</span></button>
          ) : filtreActif ? (
            <button type="button" className="text-link" onClick={reinitialiser}>{text.reset}</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
