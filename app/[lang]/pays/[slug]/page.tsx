import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AfricaMap from "@/components/AfricaMap";
import DocumentChecklist from "@/components/DocumentChecklist";
import CountrySwitcher from "@/components/CountrySwitcher";
import "./country.css";
import { EXPERIENCE } from "@/lib/experience";
import Flag from "@/components/Flag";
import { T, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";
import { presentationHtml } from "@/lib/rich-text";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const { items } = await getPays(lang);
  const p = items.find((x) => x.slug === slug);
  return p ? { title: `${p.nom[lang]} : ${p.certificat || T[lang].country.certificate}` } : {};
}

export default async function PaysDetail({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const { items } = await getPays(lang);
  const p = items.find((x) => x.slug === slug);
  if (!p) notFound();
  const s = p.sections[lang];
  const copy = EXPERIENCE[lang];
  const requestUrl = `/${lang}/devis?pays=${p.slug}`;

  const blocs: [string, string, string[]][] = [
    ["docs", t.country.docs, s.docs], ["procedure", t.country.procedure, s.procedure],
    ["delais", t.country.delays, s.delais], ["penalites", t.country.penalties, s.penalites],
    ["ports", t.country.ports, s.ports], ["infos", t.country.infos, s.infos],
  ];
  const visibles = blocs.filter(([, , l]) => l.length);

  return (
    <div className="country-detail">
      <section className="pagehead pagehead--country">
        <div className="wrap">
          <p className="crumbs"><Link href={`/${lang}/pays`}>← {t.country.back}</Link></p>
          <div className="country-hero">
          <div className="country-hero__copy">
          <p className="eyebrow pagehead__eyebrow">IBESC / {copy.notebook} / {p.code}</p>
          <h1 className="h1 pagehead__title"><Flag code={p.code} className="flag flag--lg" />{p.nom[lang]}</h1>
          {p.certificat ? (
            <p className="pagehead__cert">
              <span className="certificate-badge">{p.certificat}</span>
              {p.certificatNom ? <span>{p.certificatNom.replace(/^\(|\)$/g, "")}</span> : null}
            </p>
          ) : null}
          {s.intro.length ? <div className="pagehead__intro" dangerouslySetInnerHTML={{ __html: presentationHtml(s.intro) }} /> : null}
          {p.updatedAt && <p className="country-updated">{copy.updated} <time dateTime={p.updatedAt}>{new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(p.updatedAt))}</time></p>}
          </div>
          <aside className="country-hero__card" aria-label={t.country.actions}>
            <p className="eyebrow">{copy.preview}</p>
            <AfricaMap current={p.code} label={p.nom[lang]} />
            <div className="fiche__actions">
              <Link className="button" href={requestUrl}>{t.country.quoteCta} <span aria-hidden="true">→</span></Link>
              <Link className="button button--ghost" href={`${requestUrl}&mode=documents`}>{t.country.sendCta}</Link>
            </div>
          </aside>
          </div>
          <div className="country-facts" aria-label={copy.overview}>
            {p.certificat && <div><span>{t.country.certificate}</span><strong>{p.certificat}</strong></div>}
            {s.docs.length > 0 && <div><span>{copy.documents}</span><strong>{s.docs.length.toString().padStart(2, "0")}</strong><a href="#docs">{t.country.docs} ↓</a></div>}
            {s.delais.length > 0 && <div className="country-facts__deadline"><span>{t.country.delays}</span><p>{s.delais[0]}</p><a href="#delais">{t.country.delays} ↓</a></div>}
          </div>
        </div>
      </section>

      {visibles.length > 1 && <nav className="country-sections" aria-label={t.country.toc}>
        <div className="wrap">{visibles.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</div>
      </nav>}
      <section className="country-content">
        <div className="wrap country-blocks">
            {!visibles.length && <section className="bloc notebook-bloc"><p className="eyebrow">IBESC / {copy.notebook}</p><h2 className="bloc__title">{copy.documents}</h2><p>{copy.emptyDocs}</p><Link className="text-link" href={`/${lang}/contact`}>{t.nav.contact} →</Link></section>}
            {visibles.map(([id, titre, lignes], index) => (
              <section key={id} id={id} className={`bloc country-block country-block--${id}`}>
                <p className="eyebrow">IBESC / {String(index + 1).padStart(2, "0")}</p>
                <h2 className="bloc__title">{titre}</h2>
                {id === "docs" ? <DocumentChecklist key={p.slug} documents={lignes} lang={lang} /> : id === "procedure" ? <ol className="country-steps">{lignes.map((l, i) => <li key={i}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p>{l}</p></li>)}</ol> : <ul className="bloc__list">{lignes.map((l, i) => <li key={i}>{l}</li>)}</ul>}
              </section>
            ))}
        </div>
      </section>

      <section className="country-next wrap" id="demande">
        <div className="country-next__request">
          <div>
            <h2 className="h2">{t.country.quoteTitle}</h2>
            <p className="hint">{t.forms.quoteIntro}</p>
            <Link className="button" href={requestUrl}>{copy.quote} →</Link>
          </div>
        </div>
        <CountrySwitcher lang={lang} current={p.slug} countries={items.map((x) => ({ slug: x.slug, name: x.nom[lang] }))} />
      </section>
    </div>
  );
}
