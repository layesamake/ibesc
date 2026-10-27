"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Lang } from "@/lib/i18n";

export default function CountrySwitcher({ lang, current, countries }: { lang: Lang; current: string; countries: { slug: string; name: string }[] }) {
  const [slug, setSlug] = useState(current);
  const id = useId();
  const copy = {
    fr: { label: "Changer de pays", action: "Voir la fiche", all: "Toutes les destinations" },
    en: { label: "Change destination", action: "View requirements", all: "All destinations" },
    nl: { label: "Andere bestemming", action: "Bekijk vereisten", all: "Alle bestemmingen" },
  }[lang];
  return <div className="country-switcher">
    <label htmlFor={id}>{copy.label}</label>
    <div className="country-switcher__controls">
      <select id={id} value={slug} onChange={(event) => setSlug(event.target.value)}>
        {countries.map((country) => <option key={country.slug} value={country.slug}>{country.name}</option>)}
      </select>
      <Link className="button button--ghost" href={`/${lang}/pays/${slug}`}>{copy.action} <span aria-hidden="true">→</span></Link>
    </div>
    <Link className="text-link" href={`/${lang}/pays`}>{copy.all} →</Link>
  </div>;
}
