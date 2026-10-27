"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Flag from "./Flag";

export type PaysLite = { slug: string; nom: string; code: string; certificat: string };
type Txt = { label: string; title: string; sub: string; search: string; all: string; none: string };

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function CountryMenu({ lang, pays, t }: { lang: string; pays: PaysLite[]; t: Txt }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const searchId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  const liste = useMemo(() => {
    const n = fold(q.trim());
    return n ? pays.filter((p) => fold(p.nom).includes(n) || fold(p.code) === n) : pays;
  }, [q, pays]);

  return (
    <div className="cmenu" ref={box}>
      <div className="cmenu__trigger">
      <Link href={`/${lang}/pays`} className="cmenu__btn cmenu__link" onClick={() => setOpen(false)}>{t.label}</Link>
      <button type="button" className="cmenu__btn cmenu__toggle" aria-label={t.title} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={open ? "cmenu__chev cmenu__chev--up" : "cmenu__chev"}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
      </button>
      </div>
      {open ? (
        <div className="cmenu__panel" id={panelId}>
          <h2 className="cmenu__title">{t.title}</h2>
          <p className="cmenu__sub">{t.sub}</p>
          <label className="sr" htmlFor={searchId}>{t.search}</label>
          <input id={searchId} className="cmenu__search" type="search" autoComplete="off" placeholder={`${t.search}…`} value={q} onChange={(e) => setQ(e.target.value)} />
          {liste.length === 0 ? <p className="cmenu__none">{t.none}</p> : (
            <ul className="cmenu__grid">
              {liste.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${lang}/pays/${p.slug}`} className="cmenu__item" onClick={() => setOpen(false)}>
                    <Flag code={p.code} />
                    <span className="cmenu__name">{p.nom}</span>
                    {p.certificat ? <span className="cmenu__cert">{p.certificat}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/${lang}/pays`} className="cmenu__all" onClick={() => setOpen(false)}>{t.all} →</Link>
        </div>
      ) : null}
    </div>
  );
}
