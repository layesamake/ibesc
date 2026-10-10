import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import data from "@/lib/apropos.json";
import { T, isLang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].about.title : "" };
}

// Les titres de section de l'ancien texte sont des lignes courtes sans ponctuation finale.
const estTitre = (l: string) => l.length < 48 && !/[.:;!?»”"]$/.test(l) && !/^[«"“]/.test(l);

export default async function AProposPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const lignes: string[] = (data.apropos as Record<string, string[]>)[lang];
  const [accroche, ...reste] = lignes;
  return (
    <>
      <PageHead eyebrow="IBESC" title={t.about.title} lead={accroche.replace(/^[«"“]\s*|\s*[»"”]$/g, "")} />
      <section className="section">
        <div className="wrap about">
          <div className="prose">
            {reste.map((l, i) => estTitre(l) ? <h2 key={i} className="h2 h2--sub">{l}</h2> : <p key={i}>{l}</p>)}
          </div>
          <div className="about__photo">
            <Image src="/port.webp" width={750} height={500} alt="" loading="lazy" unoptimized />
          </div>
        </div>
      </section>
    </>
  );
}
