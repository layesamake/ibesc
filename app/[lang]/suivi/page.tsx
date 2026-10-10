import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import { T, isLang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].tracking.title : "" };
}

const ARMATEURS = [
  ["CMA CGM", "https://www.cma-cgm.com/ebusiness/tracking"],
  ["Maersk", "https://www.maersk.com/tracking/"],
  ["MSC", "https://www.msc.com/track-a-shipment"],
];

export default async function SuiviPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang].tracking;
  return (
    <>
      <PageHead eyebrow={T[lang].nav.tracking} title={t.title} lead={t.lead} />
      <section className="section">
        <div className="wrap">
          <h2 className="h2 h2--sub h2--first">{t.carriers}</h2>
          <ul className="link-cards">
            {ARMATEURS.map(([n, u]) => (
              <li key={n}>
                <a className="link-card" href={u} target="_blank" rel="noopener noreferrer">
                  <strong>{n}</strong>
                  <span className="arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <h2 className="h2 h2--sub">{t.realtime}</h2>
          <ul className="bloc__list bloc__list--wide">{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      </section>
    </>
  );
}
