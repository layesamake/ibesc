import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { T, isLang, type Lang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLang(lang) ? T[lang].tracking.title : "" };
}

const ARMATEURS = [
  { name: "CMA CGM", mark: "CMA", url: "https://www.cma-cgm.com/ebusiness/tracking" },
  { name: "Maersk", mark: "MSK", url: "https://www.maersk.com/tracking/" },
  { name: "MSC", mark: "MSC", url: "https://www.msc.com/track-a-shipment" },
];

const COPY: Record<Lang, {
  eyebrow: string; title: string; titleAccent: string; lead: string; primary: string; secondary: string; assurance: string;
  visualLabel: string; visualRoute: string; launchEyebrow: string; launchTitle: string; launchLead: string;
  carrierDescriptions: string[]; carrierMeta: string[]; launchNote: string; timelineEyebrow: string; timelineTitle: string;
  timelineLead: string; timelineHints: string[]; helpEyebrow: string; helpTitle: string; helpLead: string; helpCta: string;
}> = {
  fr: {
    eyebrow: "SERVICE CARGO / 01", title: "Gardez le cap sur votre", titleAccent: "cargaison.",
    lead: "Un départ confirmé, un transbordement à surveiller ou une arrivée à anticiper ? Accédez en un clic au suivi officiel de votre armateur.",
    primary: "Choisir mon armateur", secondary: "Parler à un expert", assurance: "Une information claire à chaque étape",
    visualLabel: "CARGO TRACE / AFRICA", visualRoute: "EUROPE → AFRIQUE", launchEyebrow: "ACCÈS DIRECT",
    launchTitle: "Lancer un suivi", launchLead: "Choisissez l’armateur qui opère votre conteneur. Le suivi s’ouvre sur son outil officiel.",
    carrierDescriptions: ["Rechercher un conteneur ou un connaissement", "Suivre un conteneur par référence", "Vérifier le statut de votre expédition"],
    carrierMeta: ["Référence conteneur / BL", "Référence conteneur", "Référence conteneur / BL"],
    launchNote: "Munissez-vous de votre numéro de conteneur (ex. ABCD1234567) ou de votre connaissement (BL) avant de commencer.",
    timelineEyebrow: "CE QUE VOUS VERREZ", timelineTitle: "Lire le trajet, sans deviner.",
    timelineLead: "Les informations peuvent varier selon l’armateur. Voici les trois repères essentiels à surveiller.",
    timelineHints: ["Le navire et le port de départ apparaissent en premier.", "Un changement de navire peut signaler un transbordement.", "La date d’arrivée est une estimation à confirmer avec l’armateur."],
    helpEyebrow: "BESOIN D’UN REGARD HUMAIN", helpTitle: "Un statut vous inquiète ?",
    helpLead: "Envoyez-nous votre référence et votre destination. Nous vous aidons à comprendre la prochaine étape et les formalités associées.", helpCta: "Contacter l’équipe",
  },
  en: {
    eyebrow: "CARGO SERVICE / 01", title: "Keep your shipment", titleAccent: "on course.",
    lead: "Departure confirmed, transhipment to monitor or arrival to anticipate? Reach your carrier’s official tracking tool in one click.",
    primary: "Choose my carrier", secondary: "Talk to an expert", assurance: "Clear information at every step",
    visualLabel: "CARGO TRACE / AFRICA", visualRoute: "EUROPE → AFRICA", launchEyebrow: "DIRECT ACCESS",
    launchTitle: "Start a tracking search", launchLead: "Choose the carrier operating your container. Tracking opens on its official tool.",
    carrierDescriptions: ["Search a container or bill of lading", "Track a container by reference", "Check your shipment status"],
    carrierMeta: ["Container / BL reference", "Container reference", "Container / BL reference"],
    launchNote: "Have your container number (e.g. ABCD1234567) or bill of lading (BL) ready before you start.",
    timelineEyebrow: "WHAT YOU WILL SEE", timelineTitle: "Read the journey with confidence.",
    timelineLead: "Information may vary by carrier. These are the three essential markers to watch.",
    timelineHints: ["The vessel and departure port appear first.", "A vessel change may indicate a transhipment.", "The arrival date is an estimate to confirm with the carrier."],
    helpEyebrow: "NEED A HUMAN VIEW", helpTitle: "A status looks unclear?",
    helpLead: "Send us your reference and destination. We will help you understand the next step and the related formalities.", helpCta: "Contact the team",
  },
  nl: {
    eyebrow: "CARGO SERVICE / 01", title: "Houd uw zending", titleAccent: "op koers.",
    lead: "Vertrek bevestigd, overslag te volgen of aankomst te voorzien? Open met één klik de officiële trackingtool van uw rederij.",
    primary: "Kies mijn rederij", secondary: "Spreek met een expert", assurance: "Duidelijke informatie bij elke stap",
    visualLabel: "CARGO TRACE / AFRICA", visualRoute: "EUROPA → AFRIKA", launchEyebrow: "DIRECTE TOEGANG",
    launchTitle: "Start een trackingzoekopdracht", launchLead: "Kies de rederij die uw container vervoert. De tracking opent in haar officiële tool.",
    carrierDescriptions: ["Zoek een container of cognossement", "Volg een container met een referentie", "Controleer de status van uw zending"],
    carrierMeta: ["Container- / BL-referentie", "Containerreferentie", "Container- / BL-referentie"],
    launchNote: "Houd uw containernummer (bv. ABCD1234567) of cognossement (BL) bij de hand voordat u begint.",
    timelineEyebrow: "WAT U ZIET", timelineTitle: "Lees het traject met vertrouwen.",
    timelineLead: "De informatie kan per rederij verschillen. Dit zijn de drie belangrijkste punten om te volgen.",
    timelineHints: ["Het schip en de vertrekhaven verschijnen eerst.", "Een wijziging van schip kan op overslag wijzen.", "De aankomstdatum is een schatting die u bij de rederij bevestigt."],
    helpEyebrow: "EEN MENSELIJKE BLIK NODIG", helpTitle: "Is een status onduidelijk?",
    helpLead: "Stuur ons uw referentie en bestemming. Wij helpen u de volgende stap en de bijbehorende formaliteiten te begrijpen.", helpCta: "Contacteer het team",
  },
};

export default async function SuiviPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang].tracking;
  const copy = COPY[lang];

  return (
    <>
      <section className="tracking-hero" aria-labelledby="tracking-title">
        <div className="wrap tracking-hero__grid">
          <div className="tracking-hero__copy">
            <p className="eyebrow"><span className="dot" />{copy.eyebrow}</p>
            <h1 id="tracking-title">{copy.title} <em>{copy.titleAccent}</em></h1>
            <p>{copy.lead}</p>
            <div className="tracking-hero__actions">
              <a className="button" href="#armateurs">{copy.primary}<span aria-hidden="true">↓</span></a>
              <Link className="text-link text-link--light" href={`/${lang}/contact`}>{copy.secondary}<span aria-hidden="true">↗</span></Link>
            </div>
            <div className="tracking-hero__assurance"><span aria-hidden="true">✓</span>{copy.assurance}</div>
          </div>
          <div className="tracking-hero__visual" aria-hidden="true">
            <div className="tracking-orbit tracking-orbit--one" />
            <div className="tracking-orbit tracking-orbit--two" />
            <div className="tracking-route-line"><i /><i /><i /></div>
            <p className="tracking-visual__label">{copy.visualLabel}</p>
            <strong className="tracking-visual__code">01</strong>
            <p className="tracking-visual__route">{copy.visualRoute}</p>
            <span className="tracking-visual__stamp">BESC · ECTN · CTN</span>
          </div>
        </div>
      </section>

      <section className="tracking-launch section" id="armateurs" aria-labelledby="tracking-launch-title">
        <div className="wrap">
          <div className="tracking-section-heading">
            <div><p className="eyebrow">{copy.launchEyebrow}</p><h2 id="tracking-launch-title">{copy.launchTitle}</h2></div>
            <p>{copy.launchLead}</p>
          </div>
          <div className="tracking-carriers">
            {ARMATEURS.map((carrier, index) => (
              <a className="tracking-carrier" href={carrier.url} target="_blank" rel="noopener noreferrer" key={carrier.name}>
                <span className="tracking-carrier__index">0{index + 1}</span>
                <span className="tracking-carrier__mark" aria-hidden="true">{carrier.mark}</span>
                <span className="tracking-carrier__body">
                  <strong>{carrier.name}</strong>
                  <span>{copy.carrierDescriptions[index]}</span>
                  <small>{copy.carrierMeta[index]}</small>
                </span>
                <span className="tracking-carrier__arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <div className="tracking-launch__note"><span aria-hidden="true">i</span><p>{copy.launchNote}</p></div>
        </div>
      </section>

      <section className="tracking-journey" aria-labelledby="tracking-journey-title">
        <div className="wrap">
          <div className="tracking-section-heading tracking-section-heading--light">
            <div><p className="eyebrow">{copy.timelineEyebrow}</p><h2 id="tracking-journey-title">{copy.timelineTitle}</h2></div>
            <p>{copy.timelineLead}</p>
          </div>
          <ol className="tracking-timeline">
            {t.items.map((item, index) => (
              <li key={item}>
                <span className="tracking-timeline__number">0{index + 1}</span>
                <span className="tracking-timeline__line" aria-hidden="true" />
                <h3>{item}</h3>
                <p>{copy.timelineHints[index]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tracking-help" aria-labelledby="tracking-help-title">
        <div className="wrap tracking-help__grid">
          <div><p className="eyebrow">{copy.helpEyebrow}</p><h2 id="tracking-help-title">{copy.helpTitle}</h2></div>
          <div><p>{copy.helpLead}</p><Link className="button" href={`/${lang}/contact`}>{copy.helpCta}<span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
    </>
  );
}
