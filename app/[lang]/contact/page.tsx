import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHead from "@/components/PageHead";
import { CONTACT, T, isLang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].contact.title : "" };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang].contact;
  return (
    <>
      <PageHead eyebrow={T[lang].nav.contact} title={t.title} lead={t.lead} />
      <section className="section">
        <div className="wrap">
          <dl className="contact-cards">
            <div><dt>{t.phone}</dt><dd><a href={`tel:${CONTACT.telHref}`}>{CONTACT.tel}</a></dd></div>
            <div><dt>{t.mail}</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
            <div><dt>{t.address}</dt><dd>International BESC Business<br />{CONTACT.adresse}</dd></div>
            <div><dt>{t.hours}</dt><dd>{t.hoursV}</dd></div>
          </dl>
          <p className="contact-cta">
            <Link className="button" href={`/${lang}/devis`}>{T[lang].nav.apply} <span aria-hidden="true">→</span></Link>
          </p>
        </div>
      </section>
    </>
  );
}
