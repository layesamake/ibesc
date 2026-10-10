import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DevisForm from "@/components/DevisForm";
import { CONTACT, T, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].contact.title : "" };
}

const COPY = {
  fr: {
    eyebrow: "VOTRE PROCHAINE EXPÉDITION COMMENCE ICI", titleA: "Parlons de votre", titleB: "expédition.",
    lead: "Une question sur un certificat, une destination ou un délai ? Décrivez votre besoin : notre équipe vous répond avec une prochaine étape claire.",
    response: "Réponse sous 24 à 48 h ouvrées", formEyebrow: "UN PREMIER ÉCHANGE, CONCRET", formTitle: "Dites-nous où vous allez.",
    formLead: "Votre destination et votre marchandise suffisent pour démarrer. Nous revenons vers vous avec les formalités adaptées.", directEyebrow: "BESOIN D'UN ÉCHANGE HUMAIN ?", directTitle: "Un contact, pas une boîte noire.",
    directLead: "Appelez-nous ou écrivez-nous directement. Nous vous aidons à débloquer votre dossier et à éviter les mauvaises surprises au port.", call: "Appeler IBESC", mail: "Écrire un e-mail", location: "Notre bureau", availability: "Lundi — vendredi · 9 h — 18 h",
  },
  en: {
    eyebrow: "YOUR NEXT SHIPMENT STARTS HERE", titleA: "Let's talk about your", titleB: "shipment.",
    lead: "A question about a certificate, a destination or a deadline? Tell us what you need and our team will come back with a clear next step.",
    response: "Reply within 24 to 48 business hours", formEyebrow: "A PRACTICAL FIRST EXCHANGE", formTitle: "Tell us where you're going.",
    formLead: "Your destination and cargo are enough to get started. We will come back with the right formalities for your shipment.", directEyebrow: "NEED A HUMAN ANSWER?", directTitle: "One contact, no black box.",
    directLead: "Call or email us directly. We help you move your file forward and avoid surprises at the port.", call: "Call IBESC", mail: "Send an e-mail", location: "Our office", availability: "Monday — Friday · 9 am — 6 pm",
  },
  nl: {
    eyebrow: "UW VOLGENDE ZENDING BEGINT HIER", titleA: "Laten we over uw", titleB: "zending praten.",
    lead: "Een vraag over een certificaat, bestemming of deadline? Beschrijf uw behoefte en ons team antwoordt met een duidelijke volgende stap.",
    response: "Antwoord binnen 24 tot 48 werkuren", formEyebrow: "EEN CONCRETE EERSTE UITWISSELING", formTitle: "Vertel ons waar u heen gaat.",
    formLead: "Uw bestemming en goederen volstaan om te beginnen. Wij bezorgen u de juiste formaliteiten voor uw zending.", directEyebrow: "EEN MENSELIJK ANTWOORD NODIG?", directTitle: "Eén contactpersoon, geen zwarte doos.",
    directLead: "Bel of mail ons rechtstreeks. Wij helpen uw dossier vooruit en vermijden verrassingen in de haven.", call: "IBESC bellen", mail: "Een e-mail sturen", location: "Ons kantoor", availability: "Maandag — vrijdag · 9 u — 18 u",
  },
} as const;

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const c = COPY[lang];
  const { items } = await getPays(lang);
  const pays = items.map((p) => ({ slug: p.slug, nom: p.nom[lang] }));

  return (
    <>
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="wrap contact-hero__grid">
          <div className="contact-hero__copy">
            <p className="eyebrow"><span className="dot"></span> {c.eyebrow}</p>
            <h1 id="contact-title">{c.titleA}<br /><em>{c.titleB}</em></h1>
            <p>{c.lead}</p>
            <div className="contact-hero__assurance"><span aria-hidden="true">✓</span>{c.response}</div>
          </div>
          <aside className="contact-pulse">
            <span className="contact-pulse__index">IBESC / 01</span>
            <strong>{t.contact.lead}</strong>
            <a href={`tel:${CONTACT.telHref}`}>{CONTACT.tel}</a>
            <Link className="text-link text-link--light" href={`/${lang}/devis`}>{t.nav.apply} <span aria-hidden="true">↗</span></Link>
          </aside>
        </div>
      </section>

      <section className="contact-convert section" aria-labelledby="contact-form-title">
        <div className="wrap contact-convert__grid">
          <div className="contact-form-panel">
            <p className="eyebrow">{c.formEyebrow}</p>
            <h2 id="contact-form-title">{c.formTitle}</h2>
            <p className="contact-form-panel__lead">{c.formLead}</p>
            <DevisForm pays={pays} choix="" t={t.forms} lang={lang} compact />
          </div>

          <aside className="contact-aside" aria-label={t.nav.contact}>
            <p className="eyebrow">{c.directEyebrow}</p>
            <h2>{c.directTitle}</h2>
            <p className="contact-aside__lead">{c.directLead}</p>
            <div className="contact-actions">
              <a href={`tel:${CONTACT.telHref}`}><span aria-hidden="true">↗</span><strong>{c.call}</strong><small>{CONTACT.tel}</small></a>
              <a href={`mailto:${CONTACT.email}`}><span aria-hidden="true">↗</span><strong>{c.mail}</strong><small>{CONTACT.email}</small></a>
            </div>
            <dl className="contact-details">
              <div><dt>{c.location}</dt><dd>{CONTACT.adresse}</dd></div>
              <div><dt>{t.contact.hours}</dt><dd>{c.availability}</dd></div>
            </dl>
            <div className="contact-location" aria-label={CONTACT.adresse}>
              <span aria-hidden="true">◎</span>
              <div><strong>Belgique · Bree</strong><small>{CONTACT.adresse}</small></div>
              <a href="https://maps.google.com/?q=Kanaallaan+9,+3960+Bree,+Belgique" target="_blank" rel="noopener noreferrer" aria-label={`${t.contact.address} — Google Maps`}>↗</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
