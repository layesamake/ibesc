import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { T, isLang, type Lang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].about.title : "" };
}

type AboutCopy = {
  eyebrow: string; title: string; titleAccent: string; lead: string; primary: string; secondary: string;
  visualLabel: string; visualCaption: string; positioningEyebrow: string; positioningTitle: string; positioningLead: string;
  stats: { value: string; label: string }[]; principlesEyebrow: string; principlesTitle: string; principlesLead: string;
  principles: { number: string; title: string; text: string }[]; methodEyebrow: string; methodTitle: string; methodLead: string;
  method: { number: string; title: string; text: string; tag: string }[]; valuesEyebrow: string; valuesTitle: string;
  valuesLead: string; values: { title: string; text: string }[]; ctaEyebrow: string; ctaTitle: string; ctaLead: string; ctaButton: string;
};

const COPY: Record<Lang, AboutCopy> = {
  fr: {
    eyebrow: "IBESC / NOTRE CAP", title: "La clarté documentaire au service de", titleAccent: "vos échanges.",
    lead: "Depuis plus de 18 ans, IBESC transforme les formalités maritimes en décisions simples : un interlocuteur, une méthode, une route plus sûre vers l’Afrique.",
    primary: "Demander un certificat", secondary: "Découvrir notre méthode", visualLabel: "EUROPE ↔ AFRIQUE / 01", visualCaption: "Un trait d’union documentaire entre les marchés.",
    positioningEyebrow: "NOTRE POSITIONNEMENT", positioningTitle: "Un partenaire documentaire, pas un intermédiaire de plus.",
    positioningLead: "IBESC est une entreprise indépendante qui prend en charge la partie administrative de vos certificats BESC, BSC, ECTN, CTN et autres documents de suivi. Nous rendons les exigences lisibles, les délais pilotables et chaque étape traçable.",
    stats: [{ value: "18+", label: "années d’expérience internationale" }, { value: "24", label: "destinations africaines couvertes" }, { value: "72 h", label: "pour obtenir vos documents" }],
    principlesEyebrow: "CE QUI NOUS DISTINGUE", principlesTitle: "Une expertise qui enlève de la friction.",
    principlesLead: "Votre équipe garde le cap sur son activité. Nous coordonnons les informations, les acteurs et les échéances qui font avancer le dossier.",
    principles: [
      { number: "01", title: "Indépendance", text: "Nous ne sommes ni transitaire ni agent de douane. Nous travaillons avec les acteurs de la chaîne pour défendre la fluidité de votre expédition." },
      { number: "02", title: "Point d’entrée unique", text: "Une seule équipe pour vos destinations et vos certificats. Vous évitez les allers-retours entre plusieurs interlocuteurs." },
      { number: "03", title: "Culture du terrain", text: "Notre réseau multiculturel connaît les exigences des autorités, des ports et des Conseils des Chargeurs africains." },
    ],
    methodEyebrow: "LA MÉTHODE IBESC", methodTitle: "Du premier document au bon départ.",
    methodLead: "Un parcours court, lisible et suivi par une équipe qui vous parle simplement.",
    method: [
      { number: "01", title: "Écouter", text: "Nous comprenons votre destination, votre marchandise et votre échéance.", tag: "BESOIN" },
      { number: "02", title: "Préparer", text: "Nous vérifions les pièces et construisons le projet de certificat adapté.", tag: "DOSSIER" },
      { number: "03", title: "Valider", text: "Nous coordonnons les validations et vous transmettons le document final.", tag: "CERTIFICAT" },
    ],
    valuesEyebrow: "NOS ENGAGEMENTS", valuesTitle: "Le professionnalisme se mesure dans les détails.",
    valuesLead: "Chaque demande mérite la même attention : une réponse nette, un délai tenu et une relation de confiance.",
    values: [
      { title: "Priorité client", text: "Vos contraintes guident la solution, pas l’inverse." },
      { title: "Intégrité", text: "Nous disons ce qui est possible, ce qui manque et ce qui doit être anticipé." },
      { title: "Réactivité", text: "Les questions trouvent un interlocuteur et les dossiers avancent." },
      { title: "Excellence", text: "Nous améliorons chaque étape pour dépasser les standards attendus." },
    ],
    ctaEyebrow: "PRÊT À AVANCER ?", ctaTitle: "Votre prochaine expédition mérite un partenaire fiable.",
    ctaLead: "Parlez-nous de votre destination et de votre marchandise. Nous vous indiquerons les prochaines étapes.", ctaButton: "Parler à l’équipe",
  },
  en: {
    eyebrow: "IBESC / OUR COURSE", title: "Document clarity for", titleAccent: "better trade.",
    lead: "For more than 18 years, IBESC has turned maritime formalities into clear decisions: one contact, one method and a safer route to Africa.",
    primary: "Request a certificate", secondary: "Discover our method", visualLabel: "EUROPE ↔ AFRICA / 01", visualCaption: "A documentary bridge between markets.",
    positioningEyebrow: "OUR POSITIONING", positioningTitle: "A documentation partner, not another layer of complexity.",
    positioningLead: "IBESC is an independent company handling the administrative side of BESC, BSC, ECTN, CTN and other cargo certificates. We make requirements readable, deadlines manageable and every step traceable.",
    stats: [{ value: "18+", label: "years of international experience" }, { value: "24", label: "African destinations covered" }, { value: "72 h", label: "to obtain your documents" }],
    principlesEyebrow: "WHAT SETS US APART", principlesTitle: "Expertise that removes friction.",
    principlesLead: "Your team stays focused on its business. We coordinate the information, people and deadlines that move your file forward.",
    principles: [
      { number: "01", title: "Independent", text: "We are neither a freight forwarder nor a customs agent. We work with every stakeholder to keep your shipment moving." },
      { number: "02", title: "One point of contact", text: "One team for your destinations and certificates. No more back-and-forth between multiple contacts." },
      { number: "03", title: "On-the-ground culture", text: "Our multicultural network understands the requirements of authorities, ports and African Shippers’ Councils." },
    ],
    methodEyebrow: "THE IBESC METHOD", methodTitle: "From the first document to a clear departure.",
    methodLead: "A short, transparent journey managed by a team that speaks plainly.",
    method: [
      { number: "01", title: "Listen", text: "We understand your destination, cargo and deadline.", tag: "NEED" },
      { number: "02", title: "Prepare", text: "We check the documents and build the right certificate draft.", tag: "FILE" },
      { number: "03", title: "Validate", text: "We coordinate approvals and send you the final document.", tag: "CERTIFICATE" },
    ],
    valuesEyebrow: "OUR COMMITMENTS", valuesTitle: "Professionalism lives in the details.",
    valuesLead: "Every request deserves the same care: a clear answer, a kept deadline and a relationship built on trust.",
    values: [
      { title: "Client first", text: "Your constraints shape the solution, not the other way around." },
      { title: "Integrity", text: "We say what is possible, what is missing and what needs anticipation." },
      { title: "Responsiveness", text: "Questions reach a real contact and files keep moving." },
      { title: "Excellence", text: "We improve every step to go beyond expected standards." },
    ],
    ctaEyebrow: "READY TO MOVE?", ctaTitle: "Your next shipment deserves a reliable partner.",
    ctaLead: "Tell us about your destination and cargo. We will outline the next steps.", ctaButton: "Talk to the team",
  },
  nl: {
    eyebrow: "IBESC / ONZE KOERS", title: "Duidelijke documenten voor", titleAccent: "sterke handel.",
    lead: "Al meer dan 18 jaar maakt IBESC maritieme formaliteiten eenvoudig: één contact, één methode en een veiligere route naar Afrika.",
    primary: "Certificaat aanvragen", secondary: "Onze methode ontdekken", visualLabel: "EUROPA ↔ AFRIKA / 01", visualCaption: "Een documentair verbindingsstuk tussen markten.",
    positioningEyebrow: "ONZE POSITIONERING", positioningTitle: "Een documentatiepartner, geen extra laag complexiteit.",
    positioningLead: "IBESC is een onafhankelijke onderneming die het administratieve deel van BESC-, BSC-, ECTN-, CTN- en andere vrachtcertificaten beheert. Wij maken vereisten leesbaar, termijnen beheersbaar en elke stap traceerbaar.",
    stats: [{ value: "18+", label: "jaar internationale ervaring" }, { value: "24", label: "Afrikaanse bestemmingen" }, { value: "72 u", label: "om uw documenten te verkrijgen" }],
    principlesEyebrow: "WAT ONS ONDERSCHEIDT", principlesTitle: "Expertise die wrijving wegneemt.",
    principlesLead: "Uw team houdt de focus op de eigen activiteit. Wij coördineren de informatie, partners en termijnen die uw dossier vooruithelpen.",
    principles: [
      { number: "01", title: "Onafhankelijk", text: "Wij zijn geen expediteur of douaneagent. Wij werken met alle spelers om uw zending vlot te laten verlopen." },
      { number: "02", title: "Eén contactpunt", text: "Eén team voor uw bestemmingen en certificaten. Geen heen-en-weer tussen verschillende contacten." },
      { number: "03", title: "Terreinervaring", text: "Ons multiculturele netwerk kent de vereisten van overheden, havens en Afrikaanse verladersraden." },
    ],
    methodEyebrow: "DE IBESC-METHODE", methodTitle: "Van het eerste document tot een goede start.",
    methodLead: "Een kort en duidelijk traject, opgevolgd door een team dat helder communiceert.",
    method: [
      { number: "01", title: "Luisteren", text: "Wij begrijpen uw bestemming, goederen en deadline.", tag: "BEHOEFTE" },
      { number: "02", title: "Voorbereiden", text: "Wij controleren de documenten en maken het juiste ontwerp." , tag: "DOSSIER" },
      { number: "03", title: "Valideren", text: "Wij coördineren de goedkeuringen en sturen het einddocument.", tag: "CERTIFICAAT" },
    ],
    valuesEyebrow: "ONZE ENGAGEMENTEN", valuesTitle: "Professionaliteit zit in de details.",
    valuesLead: "Elke aanvraag verdient dezelfde aandacht: een helder antwoord, een nagekomen termijn en vertrouwen.",
    values: [
      { title: "Klant eerst", text: "Uw beperkingen bepalen de oplossing." },
      { title: "Integriteit", text: "Wij zeggen wat kan, wat ontbreekt en wat vooraf moet worden voorzien." },
      { title: "Snelheid", text: "Vragen krijgen een echt aanspreekpunt en dossiers blijven vooruitgaan." },
      { title: "Excellentie", text: "Wij verbeteren elke stap om de verwachtingen te overtreffen." },
    ],
    ctaEyebrow: "KLAAR OM TE VERTREKKEN?", ctaTitle: "Uw volgende zending verdient een betrouwbare partner.",
    ctaLead: "Vertel ons over uw bestemming en goederen. Wij geven u de volgende stappen.", ctaButton: "Spreek met het team",
  },
};

export default async function AProposPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const copy = COPY[lang];
  return (
    <>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="wrap about-hero__grid">
          <div className="about-hero__copy">
            <p className="eyebrow"><span className="dot" />{copy.eyebrow}</p>
            <h1 id="about-title">{copy.title} <em>{copy.titleAccent}</em></h1>
            <p>{copy.lead}</p>
            <div className="about-hero__actions">
              <Link className="button" href={`/${lang}/devis`}>{copy.primary}<span aria-hidden="true">↗</span></Link>
              <a className="text-link text-link--light" href="#methode">{copy.secondary}<span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="about-hero__visual">
            <Image src="/port.webp" width={750} height={500} alt="" priority unoptimized />
            <div className="about-hero__visual-shade" />
            <p className="about-hero__visual-label">{copy.visualLabel}</p>
            <p className="about-hero__visual-caption">{copy.visualCaption}</p>
            <span className="about-hero__visual-index">IBB / 01</span>
          </div>
        </div>
      </section>

      <section className="about-positioning section" aria-labelledby="positioning-title">
        <div className="wrap about-positioning__grid">
          <div><p className="eyebrow">{copy.positioningEyebrow}</p><h2 id="positioning-title">{copy.positioningTitle}</h2></div>
          <div><p className="about-positioning__lead">{copy.positioningLead}</p><div className="about-stats">
            {copy.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          </div></div>
        </div>
      </section>

      <section className="about-principles section section--tint" aria-labelledby="principles-title">
        <div className="wrap">
          <div className="about-section-heading"><div><p className="eyebrow">{copy.principlesEyebrow}</p><h2 id="principles-title">{copy.principlesTitle}</h2></div><p>{copy.principlesLead}</p></div>
          <div className="about-principles__grid">
            {copy.principles.map((principle) => <article key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="about-method" id="methode" aria-labelledby="method-title">
        <div className="wrap">
          <div className="about-section-heading about-section-heading--light"><div><p className="eyebrow">{copy.methodEyebrow}</p><h2 id="method-title">{copy.methodTitle}</h2></div><p>{copy.methodLead}</p></div>
          <ol className="about-method__steps">
            {copy.method.map((step) => <li key={step.number}><span className="about-method__number">{step.number}</span><span className="about-method__line" aria-hidden="true" /><h3>{step.title}</h3><p>{step.text}</p><small>{step.tag}</small></li>)}
          </ol>
        </div>
      </section>

      <section className="about-values section" aria-labelledby="values-title">
        <div className="wrap about-values__grid">
          <div><p className="eyebrow">{copy.valuesEyebrow}</p><h2 id="values-title">{copy.valuesTitle}</h2><p className="about-values__lead">{copy.valuesLead}</p></div>
          <div className="about-values__list">{copy.values.map((value, index) => <article key={value.title}><span>0{index + 1}</span><div><h3>{value.title}</h3><p>{value.text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <div className="wrap about-cta__grid"><div><p className="eyebrow">{copy.ctaEyebrow}</p><h2 id="about-cta-title">{copy.ctaTitle}</h2></div><div><p>{copy.ctaLead}</p><Link className="button" href={`/${lang}/contact`}>{copy.ctaButton}<span aria-hidden="true">↗</span></Link></div></div>
      </section>
    </>
  );
}
