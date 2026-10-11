"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Flag from "./Flag";
import type { Lang } from "@/lib/i18n";
import { EXPERIENCE } from "@/lib/experience";

type Destination = { slug: string; nom: string; code: string; certificat: string; docs: string[] };

export default function DestinationAtlas({ pays, lang, children }: { pays: Destination[]; lang: Lang; children: ReactNode }) {
  const [slug, setSlug] = useState(pays[0]?.slug ?? "");
  const p = pays.find((item) => item.slug === slug);
  const chart = useRef<HTMLDivElement>(null);
  const copy = EXPERIENCE[lang];
  useEffect(() => {
    chart.current?.querySelectorAll("a[data-country]").forEach((link) => {
      const selected = link.getAttribute("data-country") === p?.code;
      link.setAttribute("aria-current", selected ? "true" : "false");
      link.querySelector("path")?.classList.toggle("map__c--cur", selected);
    });
  }, [p?.code]);
  if (!p) return null;
  return <section className="route-atlas section" aria-labelledby="atlas-title">
    <div className="wrap">
      <div className="section-heading"><div><p className="eyebrow">IBESC / {copy.notebook}</p><h2 id="atlas-title">{copy.select}</h2></div><p>{copy.atlasLead}</p></div>
      <div className="route-atlas__grid">
        <div className="route-atlas__chart" ref={chart} onClick={(event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          const anchor = (event.target as Element).closest("a[data-country]");
          const found = pays.find((item) => item.code === anchor?.getAttribute("data-country"));
          if (found) { event.preventDefault(); setSlug(found.slug); }
        }}>
          <span className="atlas-kicker">IBESC / AFRICA ROUTES</span>
          {children}
          <span className="route-atlas__coordinates" aria-hidden="true">N 00° — E 020° / AFRICA</span>
        </div>
        <div className="route-atlas__panel">
          <label htmlFor="atlas-destination">{copy.steps[0]}</label>
          <select id="atlas-destination" value={slug} onChange={(event) => setSlug(event.target.value)}>{pays.map((item) => <option key={item.slug} value={item.slug}>{item.nom}</option>)}</select>
          <div className="route-atlas__preview" aria-live="polite" aria-atomic="true">
            <p className="eyebrow">{copy.preview}</p>
            <h3><Flag code={p.code} className="flag flag--lg" />{p.nom}</h3>
            {p.certificat && <p className="certificate-badge">{p.certificat}</p>}
            <h4>{copy.documents}</h4>
            {p.docs.length ? <ul>{p.docs.map((doc, i) => <li key={i}>{doc}</li>)}</ul> : <p>{copy.emptyDocs}</p>}
          </div>
          <Link className="button" href={`/${lang}/devis?pays=${p.slug}`}>{copy.start} <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href={`/${lang}/pays/${p.slug}`}>{copy.requirements} <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  </section>;
}
