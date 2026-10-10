import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AfricaMap from "@/components/AfricaMap";
import CountryFinder from "@/components/CountryFinder";
import { finderText } from "@/lib/finder";
import { T, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].countries.title : "Pays" };
}

export default async function PaysPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const { items, erreur } = await getPays(lang);
  const lite = items.map((p) => ({ slug: p.slug, nom: p.nom[lang], code: p.code, certificat: p.certificat }));
  const slugByCode = new Map(items.map((p) => [p.code, p.slug]));
  return (
    <>
      <section className="pagehead">
        <div className="wrap">
          <p className="eyebrow pagehead__eyebrow">{t.home.destEyebrow}</p>
          <h1 className="h1">{t.countries.title}</h1>
          <p className="lead">{t.countries.lead}</p>
        </div>
      </section>

      <section className="section wrap">
        {erreur ? <p className="notice">Service temporairement indisponible.</p> : items.length === 0 ? <p className="notice">{t.countries.empty}</p> : (
          <CountryFinder lang={lang} pays={lite} text={finderText(lang, lite.length)} limit={lite.length} bottom={false} />
        )}
      </section>

      {items.length > 0 ? (
        <section className="section section--tint">
          <div className="wrap cover">
            <div>
              <h2>{t.home.coverTitle}</h2>
              <p className="lead">{t.home.coverLead}</p>
            </div>
            <AfricaMap label={t.countries.title} covered={items.map((p) => p.code)} hrefFor={(c) => `/${lang}/pays/${slugByCode.get(c) ?? ""}`} nameFor={(c) => items.find((p) => p.code === c)?.nom[lang] ?? c} linkLabel={(c) => `${T[lang].countries.title} : ${items.find((p) => p.code === c)?.nom[lang] ?? c}`} />
          </div>
        </section>
      ) : null}
    </>
  );
}
