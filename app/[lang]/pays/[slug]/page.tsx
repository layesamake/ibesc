import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AfricaMap from "@/components/AfricaMap";
import DocumentChecklist from "@/components/DocumentChecklist";
import { EXPERIENCE } from "@/lib/experience";
import Flag from "@/components/Flag";
import { T, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

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
    ["docs", t.country.docs, s.docs], ["procedure", t.country.procedure, s.procedure], ["ports", t.country.ports, s.ports],
    ["infos", t.country.infos, s.infos], ["delais", t.country.delays, s.delais], ["penalites", t.country.penalties, s.penalites],
  ];
  const visibles = blocs.filter(([, , l]) => l.length);
  const autres = items.filter((x) => x.slug !== p.slug);

  return (
    <>
      <section className="pagehead pagehead--country">
        <div className="wrap">
          <p className="crumbs"><Link href={`/${lang}/pays`}>← {t.country.back}</Link></p>
          <p className="eyebrow pagehead__eyebrow">IBESC / {copy.notebook} / {p.code}</p>
          <h1 className="h1 pagehead__title"><Flag code={p.code} className="flag flag--lg" />{p.nom[lang]}</h1>
          {p.certificat ? (
            <p className="pagehead__cert">
              <span className="certificate-badge">{p.certificat}</span>
              {p.certificatNom ? <span>{p.certificatNom.replace(/^\(|\)$/g, "")}</span> : null}
            </p>
          ) : null}
          {s.intro.length ? <div className="pagehead__intro">{s.intro.map((l, i) => <p key={i}>{l}</p>)}</div> : null}
          {p.updatedAt && <p className="country-updated">{copy.updated} <time dateTime={p.updatedAt}>{new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(p.updatedAt))}</time></p>}
          <div className="country-summary" aria-label={copy.overview}>{p.certificat && <div><span>{t.country.certificate}</span><strong>{p.certificat}</strong></div>}{s.docs.length > 0 && <div><span>{copy.documents}</span><strong>{s.docs.length}</strong></div>}<Link className="button" href={requestUrl}>{copy.start} <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap fiche">
          <div className="fiche__main">
            {!visibles.length && <section className="bloc notebook-bloc"><p className="eyebrow">IBESC / {copy.notebook}</p><h2 className="bloc__title">{copy.documents}</h2><p>{copy.emptyDocs}</p><Link className="text-link" href={`/${lang}/contact`}>{t.nav.contact} →</Link></section>}
            {visibles.map(([id, titre, lignes], index) => (
              <section key={id} id={id} className="bloc notebook-bloc">
                <p className="eyebrow">IBESC / {String(index + 1).padStart(2, "0")}</p>
                <h2 className="bloc__title">{titre}</h2>
                {id === "docs" ? <DocumentChecklist key={p.slug} documents={lignes} lang={lang} /> : <ul className="bloc__list">{lignes.map((l, i) => <li key={i}>{l}</li>)}</ul>}
              </section>
            ))}
          </div>
          <aside className="fiche__side" aria-label={t.country.actions}>
            <div className="fiche__card">
              <p className="fiche__kicker">{t.country.certificate}</p>
              {p.certificat ? <p className="fiche__cert">{p.certificat}</p> : null}
              <AfricaMap current={p.code} label={p.nom[lang]} />
              <div className="fiche__actions">
                <Link className="button" href={requestUrl}>{t.country.quoteCta} <span aria-hidden="true">→</span></Link>
                <Link className="button button--ghost" href={`${requestUrl}&mode=documents`}>{t.country.sendCta}</Link>
              </div>
              {visibles.length > 1 ? (
                <nav className="toc" aria-label={t.country.toc}>
                  <p className="toc__title">{t.country.toc}</p>
                  <ul>{visibles.map(([id, titre]) => <li key={id}><a href={`#${id}`}>{titre}</a></li>)}</ul>
                </nav>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--tint" id="demande">
        <div className="wrap forms2">
          <div>
            <h2 className="h2">{t.country.quoteTitle}</h2>
            <p className="hint">{t.forms.quoteIntro}</p>
            <Link className="button" href={requestUrl}>{copy.quote} →</Link>
          </div>
          <div id="documents">
            <h2 className="h2">{t.country.sendTitle}</h2>
            <p className="hint">{t.forms.docsIntro}</p>
            <Link className="button button--ghost" href={`${requestUrl}&mode=documents`}>{copy.upload} →</Link>
          </div>
        </div>
      </section>

      {autres.length ? (
        <section className="section wrap neighbours" aria-labelledby="autres-pays">
          <h2 id="autres-pays" className="h3">{t.country.neighbours}</h2>
          <ul className="chips">
            {autres.map((x) => (
              <li key={x.slug}>
                <Link className="chip" href={`/${lang}/pays/${x.slug}`}><Flag code={x.code} />{x.nom[lang]}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
