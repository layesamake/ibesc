import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DevisForm from "@/components/DevisForm";
import DocsForm from "@/components/DocsForm";
import PageHead from "@/components/PageHead";
import { T, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].nav.apply : "" };
}

export default async function DevisPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ pays?: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { pays } = await searchParams;
  const t = T[lang];
  const { items } = await getPays(lang);
  const opts = items.map((x) => ({ slug: x.slug, nom: x.nom[lang] }));
  const choix = opts.some((o) => o.slug === pays) ? (pays as string) : "";
  return (
    <>
      <PageHead eyebrow={t.country.actions} title={t.nav.apply} lead={t.forms.reqNote} />
      <section className="section">
        <div className="wrap forms2">
          <div>
            <h2 className="h2">{t.country.quoteTitle}</h2>
            <p className="hint">{t.forms.quoteIntro}</p>
            <DevisForm pays={opts} choix={choix} t={t.forms} lang={lang} compact />
          </div>
          <div>
            <h2 className="h2">{t.country.sendTitle}</h2>
            <p className="hint">{t.forms.docsIntro}</p>
            <DocsForm pays={opts} choix={choix} t={t.forms} lang={lang} />
          </div>
        </div>
      </section>
    </>
  );
}
