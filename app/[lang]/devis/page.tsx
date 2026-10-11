import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RequestJourney from "@/components/RequestJourney";
import PageHead from "@/components/PageHead";
import { CONTACT, T, isLang } from "@/lib/i18n";
import { EXPERIENCE } from "@/lib/experience";
import { getPays } from "@/lib/wp";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].nav.apply : "" };
}

export default async function DevisPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ pays?: string; mode?: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { pays, mode } = await searchParams;
  const t = T[lang];
  const copy = EXPERIENCE[lang];
  const { items } = await getPays(lang);
  const opts = items.map((x) => ({ slug: x.slug, nom: x.nom[lang] }));
  const choix = opts.some((o) => o.slug === pays) ? (pays as string) : "";
  return (
    <>
      <PageHead eyebrow={copy.notebook} title={t.nav.apply} lead={copy.requestLead} />
      <section className="section">
        <div className="wrap request-layout">
          {opts.length ? <RequestJourney key={`${lang}-${choix}-${mode}`} pays={opts} choix={choix} t={t.forms} lang={lang} initialMode={mode === "documents" ? "documents" : "quote"} /> : <p className="notice" role="status">{copy.noCountries}</p>}
          <aside className="request-support"><p className="eyebrow">IBESC / SUPPORT</p><h2 className="h3">{copy.help}</h2><p>{copy.helpText}</p><a href={`tel:${CONTACT.telHref}`}>{CONTACT.tel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><hr /><p>{t.forms.reqNote}</p></aside>
        </div>
      </section>
    </>
  );
}
