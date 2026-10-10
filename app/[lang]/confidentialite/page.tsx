import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import { isLang } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? LEGAL[lang].title : "" };
}

export default async function ConfidentialitePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const l = LEGAL[lang];
  return (
    <>
      <PageHead title={l.title} lead={l.maj} />
      <section className="section">
        <div className="wrap wrap--narrow prose">
          {l.blocs.map((b) => (
            <div key={b.h}>
              <h2 className="h2 h2--sub">{b.h}</h2>
              {b.p.map((t, i) => <p key={i}>{t}</p>)}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
