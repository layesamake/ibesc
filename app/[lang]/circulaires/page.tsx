import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import { T, isLang } from "@/lib/i18n";
import { getCirculaires } from "@/lib/wp";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].news.title : "" };
}

export default async function CirculairesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang].news;
  const items = await getCirculaires();
  return (
    <>
      <PageHead eyebrow={T[lang].nav.news} title={t.title} lead={t.lead} />
      <section className="section">
        <div className="wrap wrap--narrow">
          {items.length === 0 ? <p className="notice">{t.empty}</p> : items.map((c) => (
            <article key={c.id} className="circ">
              <p className="circ__date"><time dateTime={c.date}>{new Date(c.date).toLocaleDateString(lang)}</time></p>
              <h2 className="circ__title">{c.titre}</h2>
              {/* Contenu saisi dans WordPress par l'équipe IBESC (source de confiance). */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: c.html }} />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
