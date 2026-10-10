import type { Lang } from "./i18n";

type Bloc = { h: string; p: string[] };
export type Legal = { title: string; maj: string; blocs: Bloc[] };

const ID = "International BESC Business, Kanaallaan 9 bus 2, 3960 Bree, Belgique (BCE/KBO 0749.717.156)";

export const LEGAL: Record<Lang, Legal> = {
  fr: {
    title: "Confidentialité et cookies",
    maj: "Dernière mise à jour : octobre 2026",
    blocs: [
      { h: "Qui est responsable de vos données ?", p: [`${ID}. Pour toute question : info@ibescbusiness.com.`] },
      { h: "Quelles données collectons-nous ?", p: [
        "Uniquement celles que vous nous envoyez via les formulaires du site (demande de devis, envoi de documents, contact) : nom, société, adresse e-mail, téléphone, informations sur l'expédition (pays, marchandise, port de départ, chargeur), votre message et, pour l'envoi de documents, les fichiers joints (connaissement, facture, documents d'exportation).",
        "Nous conservons aussi l'adresse IP de façon temporaire pour limiter les abus (anti-spam), sans l'associer à votre demande."] },
      { h: "Pourquoi et sur quelle base ?", p: [
        "Pour répondre à votre demande, établir un devis et obtenir ou faire valider le certificat de suivi de votre cargaison. La base est la mesure précontractuelle ou l'exécution du contrat, ainsi que nos obligations légales (comptabilité).",
        "Nous n'envoyons pas de newsletter sans votre accord et nous ne faisons ni profilage ni décision automatisée."] },
      { h: "Qui reçoit vos données ?", p: [
        "Notre équipe, nos prestataires techniques (hébergement du site, messagerie) et, lorsque c'est nécessaire pour établir le certificat, les organismes ou agents émetteurs du pays concerné. Nous ne vendons jamais vos données à des tiers."] },
      { h: "Combien de temps les conservons-nous ?", p: [
        "Le temps nécessaire au traitement de votre dossier, puis pendant la durée imposée par la loi (notamment comptable). Les demandes sans suite sont supprimées dans un délai raisonnable."] },
      { h: "Sécurité", p: [
        "Connexion chiffrée (HTTPS), accès restreint à l'équipe par mot de passe, sauvegardes et mises à jour régulières."] },
      { h: "Vos droits", p: [
        "Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation ou l'opposition au traitement, ainsi que leur portabilité, en écrivant à info@ibescbusiness.com. Nous répondons dans un délai d'un mois.",
        "Vous pouvez aussi introduire une réclamation auprès de l'Autorité de protection des données (autoriteprotectiondonnees.be)."] },
      { h: "Cookies", p: [
        "Ce site n'utilise aucun cookie publicitaire, de mesure d'audience ou de suivi. Il n'utilise que des cookies strictement nécessaires, par exemple pour la session de connexion de notre équipe, qui ne concerne pas les visiteurs. Aucun consentement n'est donc requis.",
        "Vous pouvez à tout moment supprimer ou bloquer les cookies dans les réglages de votre navigateur."] },
    ],
  },
  en: {
    title: "Privacy and cookies",
    maj: "Last updated: October 2026",
    blocs: [
      { h: "Who is responsible for your data?", p: [`${ID}. For any question: info@ibescbusiness.com.`] },
      { h: "What data do we collect?", p: [
        "Only what you send us through the forms on this site (quote request, document submission, contact): name, company, email address, phone number, shipment details (country, goods, port of departure, shipper), your message and, for document submissions, the attached files (bill of lading, invoice, export documents).",
        "We also keep your IP address temporarily to limit abuse (anti-spam), without linking it to your request."] },
      { h: "Why and on what basis?", p: [
        "To answer your request, prepare a quote and obtain or validate the cargo tracking certificate for your shipment. The basis is pre-contractual steps or performance of a contract, and our legal obligations (accounting).",
        "We do not send newsletters without your consent, and we do no profiling or automated decision-making."] },
      { h: "Who receives your data?", p: [
        "Our team, our technical providers (website hosting, email) and, when needed to issue the certificate, the issuing bodies or agents of the country concerned. We never sell your data to third parties."] },
      { h: "How long do we keep it?", p: [
        "As long as needed to handle your file, then for the period required by law (notably accounting). Requests with no follow-up are deleted within a reasonable time."] },
      { h: "Security", p: [
        "Encrypted connection (HTTPS), password-restricted team access, regular backups and updates."] },
      { h: "Your rights", p: [
        "You may request access to, correction or erasure of your data, restriction of or objection to its processing, and portability, by writing to info@ibescbusiness.com. We reply within one month.",
        "You may also lodge a complaint with the Belgian Data Protection Authority (dataprotectionauthority.be)."] },
      { h: "Cookies", p: [
        "This site uses no advertising, analytics or tracking cookies. It only uses strictly necessary cookies, for example for our team's login session, which does not concern visitors. No consent is therefore required.",
        "You can delete or block cookies at any time in your browser settings."] },
    ],
  },
  nl: {
    title: "Privacy en cookies",
    maj: "Laatst bijgewerkt: oktober 2026",
    blocs: [
      { h: "Wie is verantwoordelijk voor uw gegevens?", p: [`${ID}. Voor vragen: info@ibescbusiness.com.`] },
      { h: "Welke gegevens verzamelen wij?", p: [
        "Enkel wat u ons via de formulieren op de site bezorgt (offerteaanvraag, documenten doorsturen, contact): naam, bedrijf, e-mailadres, telefoonnummer, zendinggegevens (land, goederen, vertrekhaven, lader), uw bericht en, bij het doorsturen van documenten, de bijgevoegde bestanden (cognossement, factuur, exportdocumenten).",
        "Wij bewaren uw IP-adres ook tijdelijk om misbruik te beperken (antispam), zonder het aan uw aanvraag te koppelen."] },
      { h: "Waarom en op welke grondslag?", p: [
        "Om uw aanvraag te beantwoorden, een offerte op te stellen en het cargo-trackingcertificaat voor uw zending te verkrijgen of te laten valideren. De grondslag is de precontractuele stap of de uitvoering van een overeenkomst, en onze wettelijke verplichtingen (boekhouding).",
        "Wij sturen geen nieuwsbrief zonder uw toestemming en passen geen profilering of geautomatiseerde besluitvorming toe."] },
      { h: "Wie ontvangt uw gegevens?", p: [
        "Ons team, onze technische dienstverleners (hosting, e-mail) en, wanneer nodig om het certificaat af te geven, de uitgevende instanties of agenten van het betrokken land. Wij verkopen uw gegevens nooit aan derden."] },
      { h: "Hoelang bewaren wij ze?", p: [
        "Zolang nodig voor de behandeling van uw dossier, daarna gedurende de wettelijk vereiste termijn (met name boekhoudkundig). Aanvragen zonder gevolg worden binnen een redelijke termijn verwijderd."] },
      { h: "Beveiliging", p: [
        "Versleutelde verbinding (HTTPS), toegang voor het team enkel met wachtwoord, regelmatige back-ups en updates."] },
      { h: "Uw rechten", p: [
        "U kunt inzage, verbetering of verwijdering van uw gegevens vragen, de verwerking beperken of er bezwaar tegen maken, en overdraagbaarheid vragen via info@ibescbusiness.com. Wij antwoorden binnen een maand.",
        "U kunt ook een klacht indienen bij de Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be)."] },
      { h: "Cookies", p: [
        "Deze site gebruikt geen advertentie-, analyse- of trackingcookies. Enkel strikt noodzakelijke cookies, bijvoorbeeld voor de inlogsessie van ons team, die bezoekers niet aanbelangt. Toestemming is dus niet vereist.",
        "U kunt cookies op elk moment verwijderen of blokkeren in de instellingen van uw browser."] },
    ],
  },
};

export const LIEN_LEGAL: Record<Lang, string> = { fr: "Confidentialité et cookies", en: "Privacy and cookies", nl: "Privacy en cookies" };
