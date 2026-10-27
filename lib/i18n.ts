export const LANGS = ["fr", "en", "nl"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);
export const LANG_LABEL: Record<Lang, string> = { fr: "Français", en: "English", nl: "Nederlands" };

export const CONTACT = {
  tel: "+32 492 888 002",
  telHref: "+32492888002",
  email: "info@ibescbusiness.com",
  adresse: "Kanaallaan 9, 3960 Bree, Belgique",
};

type Dict = {
  preprod: string; skip: string;
  utility: { partner: string };
  nav: { home: string; about: string; countries: string; tracking: string; news: string; contact: string; apply: string; expertise: string };
  menu: { title: string; sub: string; search: string; all: string; none: string };
  home: {
    kicker: string; title: string; lead: string; finderLabel: string;
    whyTitle: string; why: { t: string; d: string }[];
    stepsTitle: string; steps: { t: string; d: string; tag: string }[];
    coverTitle: string; coverLead: string; typesTitle: string; typesLead: string;
    ctaTitle: string; ctaText: string; ctaBtn: string;
    /* New prototype keys */
    eyebrow: string; titleLine1: string; titleLine2: string; titleLine3: string;
    ctaLabel: string; howLink: string; assurance: string;
    finderEyebrow: string; finderTitle: string; finderPlaceholder: string; finderBtn: string;
    certLabel: string;
    destEyebrow: string; destTitle: string; destTitleEm: string; destDesc: string;
    destFilterAll: string; destFilterWest: string; destFilterCentral: string; destFilterOther: string;
    destSearchPh: string; destBottom: string; destShowAll: string;
    processEyebrow: string; processTitle: string; processTitleEm: string; processDesc: string; processBtn: string;
    expertiseEyebrow: string; expertiseTitle: string; expertiseTitleEm: string; expertiseIntro: string;
    benefits: { t: string; d: string }[];
    expertiseLink: string;
    faqEyebrow: string; faqTitle: string; faqTitleEm: string; faqLink: string;
    faq: { q: string; a: string }[];
    bannerEyebrow: string; bannerTitle: string; bannerTitleEm: string; bannerDesc: string; bannerBtn: string;
  };
  countries: { title: string; lead: string; count: (n: number) => string; empty: string; noMatch: string };
  dir: {
    filters: string; search: string; reset: string; showAll: (n: number) => string;
    results: string;
  };
  country: {
    back: string; certificate: string; ports: string; docs: string; infos: string; procedure: string;
    delays: string; penalties: string; quoteTitle: string; sendTitle: string; neighbours: string;
    toc: string; quoteCta: string; sendCta: string; actions: string; kicker: string;
  };
  forms: {
    country: string; choose: string; goods: string; goodsPh: string; name: string; company: string; email: string; phone: string;
    notes: string; consent: string; send: string; sending: string; sentTitle: string; sentRef: string; sentText: string;
    errNet: string; errSend: string; departure: string; shipper: string; consignee: string; filesTitle: string;
    filesHint: string; bl: string; invoice: string; exportDoc: string; other: string; sendDocs: string; spam: string;
    quoteIntro: string; docsIntro: string; reqNote: string;
    secShipment: string; secContact: string; secConfirm: string;
    errRate: string; errSize: string; errType: string; errFiles: string; errInvalid: string;
  };
  about: { title: string; lead: string };
  tracking: { title: string; lead: string; carriers: string; realtime: string; items: string[] };
  news: { title: string; lead: string; empty: string; read: string };
  contact: { title: string; hours: string; hoursV: string; phone: string; mail: string; address: string; lead: string };
  footer: { tag: string; legal: string; tagline: string; explore: string; beside: string; stayInTouch: string };
};

const fr: Dict = {
  preprod: "Version de préproduction : contenus en cours de relecture.", skip: "Aller au contenu",
  utility: { partner: "Votre partenaire à destination de l'Afrique" },
  nav: { home: "Accueil", about: "À propos", countries: "Destinations", tracking: "Suivi cargo", news: "Actualités", contact: "Contact", apply: "Demander un certificat", expertise: "Notre expertise" },
  menu: { title: "Choisissez votre pays de destination", sub: "Exigences et formalités du certificat pour chaque pays.", search: "Rechercher un pays", all: "Voir tous les pays", none: "Aucun pays ne correspond." },
  home: {
    kicker: "Certificats de suivi des cargaisons",
    title: "Vous chargez, nous vous assistons.",
    lead: "BSC, BESC, ECTN, CTN : un seul interlocuteur pour obtenir et faire valider le certificat de votre expédition vers l'Afrique, sans pénalités au port.",
    finderLabel: "Votre pays de destination",
    whyTitle: "Pourquoi travailler avec IBESC",
    why: [
      { t: "Simple", d: "Demande en ligne ou par e-mail. Vous joignez vos documents, nous nous occupons du reste." },
      { t: "Efficace", d: "Un seul interlocuteur pour tous les pays. Nous veillons aux délais de validation pour éviter les pénalités." },
      { t: "Rapide", d: "Projet de certificat sous 24 h, certificat validé en 48 à 72 h." },
    ],
    stepsTitle: "Comment ça marche",
    steps: [
      { t: "Transmettez votre dossier", d: "Adressez-nous votre demande et les documents de votre expédition.", tag: "DEMANDE" },
      { t: "Vérifiez votre projet", d: "Nous préparons le projet de certificat et vous adressons la facture.", tag: "PRÉPARATION" },
      { t: "Confirmez les informations", d: "Vérifiez le projet, confirmez les données et procédez au règlement.", tag: "CONFIRMATION" },
      { t: "Recevez votre certificat", d: "Après validation, recevez votre document pour finaliser vos formalités.", tag: "VALIDATION" },
    ],
    coverTitle: "Les pays couverts",
    coverLead: "Cliquez sur un pays pour voir les formalités à remplir.",
    typesTitle: "Un certificat différent selon le pays",
    typesLead: "Chaque pays impose son propre document. Voici ceux que nous traitons.",
    ctaTitle: "Une expédition vers l'Afrique ?",
    ctaText: "Demandez votre certificat ou un devis gratuit. Nous vous répondons sous 24 à 48 h ouvrées.",
    ctaBtn: "Demander un devis gratuit",
    /* New prototype keys */
    eyebrow: "LE CAP SUR L'AFRIQUE. L'ESPRIT LIBRE.",
    titleLine1: "Vous chargez.", titleLine2: "Nous vous", titleLine3: "assistons.",
    ctaLabel: "Demander mon certificat", howLink: "Comment ça marche",
    assurance: "BSC, BESC, ECTN, CTN et autres certificats",
    finderEyebrow: "UNE DESTINATION, UN CERTIFICAT", finderTitle: "Où expédiez-vous ?",
    finderPlaceholder: "Sélectionnez votre destination", finderBtn: "Voir les formalités",
    certLabel: "UNE EXPERTISE, TOUS VOS CERTIFICATS",
    destEyebrow: "01 / VOS DESTINATIONS",
    destTitle: "Chaque pays a ses règles.", destTitleEm: "Nous vous guidons.",
    destDesc: "Identifiez le certificat de votre destination et accédez aux informations pour préparer votre dossier.",
    destFilterAll: "Toutes les destinations", destFilterWest: "Afrique de l'Ouest", destFilterCentral: "Afrique centrale", destFilterOther: "Autres destinations",
    destSearchPh: "Rechercher un pays…", destBottom: "Le bon document, pour la bonne destination.",
    destShowAll: "Explorer les destinations",
    processEyebrow: "02 / UN PARCOURS CLAIR",
    processTitle: "Du premier document au", processTitleEm: "bon départ.",
    processDesc: "Une démarche simple, un suivi humain. Nous vous accompagnons à chaque étape.",
    processBtn: "C'est parti, préparer ma demande",
    expertiseEyebrow: "03 / L'ACCOMPAGNEMENT IBESC",
    expertiseTitle: "Le sens du service.", expertiseTitleEm: "L'expérience du terrain.",
    expertiseIntro: "Derrière chaque expédition, il y a un projet. Notre rôle : rendre vos démarches documentaires plus simples et plus lisibles.",
    benefits: [
      { t: "Un interlocuteur, plusieurs destinations", d: "Centralisez vos demandes auprès d'une équipe qui connaît vos besoins." },
      { t: "Des formalités expliquées simplement", d: "Comprenez les documents à préparer et les étapes de votre demande." },
      { t: "Un accompagnement jusqu'à la validation", d: "Avancez avec un contact disponible pour vos questions et vos ajustements." },
    ],
    expertiseLink: "Découvrir IBESC",
    faqEyebrow: "LES RÉPONSES AVANT LE DÉPART",
    faqTitle: "Une question ?", faqTitleEm: "Parlons-en.", faqLink: "Contacter notre équipe",
    faq: [
      { q: "Quel certificat choisir pour mon expédition ?", a: "Le certificat dépend du pays de destination. Utilisez notre recherche par pays pour identifier le document correspondant et consulter les formalités." },
      { q: "Quels documents dois-je préparer ?", a: "Les pièces varient selon la destination. Le connaissement (BL) et les factures font généralement partie du dossier. Consultez la fiche de votre pays et faites confirmer la liste par notre équipe." },
      { q: "Comment demander un devis ?", a: "Accédez au formulaire de demande, indiquez votre destination et les informations de votre expédition. Notre équipe vous répondra avec les éléments nécessaires à votre dossier." },
      { q: "Puis-je suivre ma cargaison ?", a: "La rubrique « Suivi cargo » vous donne accès aux outils de suivi des transporteurs. Elle permet de consulter l'acheminement de votre cargaison auprès de la compagnie concernée." },
    ],
    bannerEyebrow: "VOTRE PROCHAINE EXPÉDITION COMMENCE ICI",
    bannerTitle: "Prêt à prendre", bannerTitleEm: "le large ?",
    bannerDesc: "Confiez-nous vos formalités. Gardez le cap sur votre activité.",
    bannerBtn: "Demander un certificat",
  },
  countries: { title: "Pays et certificats", lead: "Sélectionnez le pays de destination de votre cargaison.", count: (n) => `${n} pays`, empty: "Aucun pays n'est publié pour le moment.", noMatch: "Aucun pays ne correspond." },
  dir: {
    filters: "Filtrer par région", search: "Rechercher un pays ou un certificat", reset: "Réinitialiser",
    showAll: (n) => `Explorer les ${n} destinations`,
    results: "{shown} sur {total} destinations affichées",
  },
  country: {
    back: "Tous les pays", certificate: "Formalités du certificat", ports: "Ports", docs: "Documents et informations requis",
    infos: "Informations complémentaires", procedure: "Procédure", delays: "Délais", penalties: "Pénalités",
    quoteTitle: "Demande de devis", sendTitle: "Envoi de documents", neighbours: "Autres pays",
    toc: "Sur cette page", quoteCta: "Demander un devis", sendCta: "Envoyer des documents", actions: "Votre demande", kicker: "Votre destination",
  },
  forms: {
    country: "Pays de destination", choose: "Choisir un pays", goods: "Marchandise", goodsPh: "Par exemple : pièces détachées, 2 conteneurs 20 pieds",
    name: "Nom et prénom", company: "Société", email: "Adresse e-mail", phone: "Téléphone", notes: "Commentaires",
    consent: "J'accepte que IBESC utilise ces informations pour traiter ma demande.", send: "Envoyer ma demande", sending: "Envoi en cours",
    sentTitle: "Demande envoyée", sentRef: "Votre numéro de référence est", sentText: "L'équipe IBESC vous répond à l'adresse indiquée.",
    errNet: "Connexion impossible. Vérifiez votre réseau puis réessayez.", errSend: "L'envoi a échoué. Réessayez dans un instant.",
    departure: "Date de départ", shipper: "Pays du chargeur", consignee: "Pays du destinataire", filesTitle: "Vos documents",
    filesHint: "PDF, image, Word ou Excel. 10 Mo maximum par fichier.", bl: "Connaissement", invoice: "Facture commerciale", exportDoc: "Facture / document export", other: "Autre document",
    sendDocs: "Envoyer les documents", spam: "Pensez à vérifier vos courriers indésirables : notre réponse peut s'y trouver.",
    quoteIntro: "Vos informations servent uniquement à répondre à votre demande. Prévoyez 24 à 48 h.", docsIntro: "Vous avez déjà votre devis ? Envoyez-nous directement vos documents pour lancer le certificat.",
    reqNote: "Les champs marqués d'un astérisque sont obligatoires.",
    secShipment: "Votre expédition", secContact: "Vos coordonnées", secConfirm: "Confirmation",
    errRate: "Trop de demandes envoyées depuis votre connexion. Patientez quelques minutes avant de réessayer.",
    errSize: "Un fichier dépasse la taille autorisée (10 Mo par fichier). Réduisez-le puis réessayez.",
    errType: "Un des fichiers n'est pas d'un format accepté (PDF, image, Word ou Excel).",
    errFiles: "Joignez les pièces obligatoires (connaissement et facture commerciale) avant d'envoyer.",
    errInvalid: "Certaines informations sont incomplètes ou invalides. Vérifiez les champs puis réessayez.",
  },
  about: { title: "À propos de nous", lead: "International BESC Business : vous exportez, nous vous assistons." },
  tracking: {
    title: "Suivi et traçabilité", lead: "Suivez votre cargaison par numéro de conteneur ou de connaissement.",
    carriers: "Sites de suivi des armateurs", realtime: "Suivi en temps réel",
    items: ["Date et port de départ du navire", "Informations sur le transbordement", "Date et port d'arrivée"],
  },
  news: { title: "Actualités", lead: "Conseils, changements de réglementation et informations utiles pour vos expéditions.", empty: "Aucune actualité n'est publiée pour le moment.", read: "Lire" },
  contact: { title: "Contact", lead: "Vous chargez, et nous vous assistons !", hours: "Horaires", hoursV: "Du lundi au vendredi, 9 h – 18 h", phone: "Téléphone", mail: "E-mail", address: "Adresse" },
  footer: { tag: "Vous chargez, nous vous assistons.", legal: "Politique de confidentialité et cookies : à venir.", tagline: "Vos formalités maritimes, en toute simplicité.", explore: "Explorer", beside: "À vos côtés", stayInTouch: "Restons en contact" },
};

const en: Dict = {
  preprod: "Pre-production version: content under review.", skip: "Skip to content",
  utility: { partner: "Your partner for Africa-bound shipments" },
  nav: { home: "Home", about: "About us", countries: "Destinations", tracking: "Cargo tracking", news: "News / circulars", contact: "Contact", apply: "Apply for a certificate", expertise: "Our expertise" },
  menu: { title: "Select your destination country", sub: "Certificate requirements and formalities for each country.", search: "Search a country", all: "See all countries", none: "No country matches." },
  home: {
    kicker: "Cargo tracking certificates",
    title: "You export, we assist.",
    lead: "BSC, BESC, ECTN, CTN: a single contact to obtain and validate the certificate for your shipment to Africa, with no penalties at the port.",
    finderLabel: "Your destination country",
    whyTitle: "Why work with IBESC",
    why: [
      { t: "Simple", d: "Apply online or by e-mail. Attach your documents and we take care of the rest." },
      { t: "Efficient", d: "One contact for all countries. We watch the validation deadlines to avoid penalties." },
      { t: "Fast", d: "Draft certificate within 24 hours, validated certificate in 48 to 72 hours." },
    ],
    stepsTitle: "How it works",
    steps: [
      { t: "Send your file", d: "Send us your request and your shipment documents.", tag: "REQUEST" },
      { t: "Review your draft", d: "We prepare the draft certificate and send you the invoice.", tag: "PREPARATION" },
      { t: "Confirm the details", d: "Review the draft, confirm the data and proceed with payment.", tag: "CONFIRMATION" },
      { t: "Receive your certificate", d: "After validation, receive your document to finalise your formalities.", tag: "VALIDATION" },
    ],
    coverTitle: "Countries we cover",
    coverLead: "Click a country to see the formalities.",
    typesTitle: "A different certificate for each country",
    typesLead: "Every country requires its own document. These are the ones we handle.",
    ctaTitle: "Shipping to Africa?",
    ctaText: "Request your certificate or a free quote. We reply within 24 to 48 working hours.",
    ctaBtn: "Request a free quote",
    /* New prototype keys */
    eyebrow: "SET COURSE FOR AFRICA. PEACE OF MIND.",
    titleLine1: "You export.", titleLine2: "We", titleLine3: "assist you.",
    ctaLabel: "Request my certificate", howLink: "How it works",
    assurance: "BSC, BESC, ECTN, CTN and other certificates",
    finderEyebrow: "ONE DESTINATION, ONE CERTIFICATE", finderTitle: "Where are you shipping?",
    finderPlaceholder: "Select your destination", finderBtn: "View formalities",
    certLabel: "ONE EXPERTISE, ALL YOUR CERTIFICATES",
    destEyebrow: "01 / YOUR DESTINATIONS",
    destTitle: "Every country has its rules.", destTitleEm: "We guide you.",
    destDesc: "Find the certificate for your destination and access the information to prepare your file.",
    destFilterAll: "All destinations", destFilterWest: "West Africa", destFilterCentral: "Central Africa", destFilterOther: "Other destinations",
    destSearchPh: "Search a country…", destBottom: "The right document, for the right destination.",
    destShowAll: "Explore destinations",
    processEyebrow: "02 / A CLEAR PROCESS",
    processTitle: "From first document to", processTitleEm: "smooth sailing.",
    processDesc: "A simple process, human follow-up. We guide you at every step.",
    processBtn: "Let's go, prepare my request",
    expertiseEyebrow: "03 / THE IBESC APPROACH",
    expertiseTitle: "A sense of service.", expertiseTitleEm: "Field experience.",
    expertiseIntro: "Behind every shipment, there is a project. Our role: making your documentary procedures simpler and clearer.",
    benefits: [
      { t: "One contact, multiple destinations", d: "Centralise your requests with a team that knows your needs." },
      { t: "Formalities explained simply", d: "Understand the documents to prepare and the steps of your request." },
      { t: "Support through to validation", d: "Move forward with a contact available for your questions and adjustments." },
    ],
    expertiseLink: "Discover IBESC",
    faqEyebrow: "ANSWERS BEFORE DEPARTURE",
    faqTitle: "Got a question?", faqTitleEm: "Let's talk.", faqLink: "Contact our team",
    faq: [
      { q: "Which certificate should I choose for my shipment?", a: "The certificate depends on the destination country. Use our country search to identify the corresponding document and view the formalities." },
      { q: "What documents do I need to prepare?", a: "The required documents vary by destination. The bill of lading (BL) and invoices are generally part of the file. Check your country's page and have the list confirmed by our team." },
      { q: "How do I request a quote?", a: "Go to the request form, enter your destination and shipment details. Our team will reply with the information needed for your file." },
      { q: "Can I track my cargo?", a: "The 'Cargo tracking' section gives you access to carrier tracking tools. It lets you check the progress of your cargo with the relevant shipping line." },
    ],
    bannerEyebrow: "YOUR NEXT SHIPMENT STARTS HERE",
    bannerTitle: "Ready to set", bannerTitleEm: "sail?",
    bannerDesc: "Leave the formalities to us. Keep your focus on your business.",
    bannerBtn: "Request a certificate",
  },
  countries: { title: "Countries and certificates", lead: "Select the destination country of your cargo.", count: (n) => `${n} countries`, empty: "No country is published yet.", noMatch: "No country matches." },
  dir: {
    filters: "Filter by region", search: "Search a country or a certificate", reset: "Reset",
    showAll: (n) => `Explore all ${n} destinations`,
    results: "{shown} of {total} destinations shown",
  },
  country: {
    back: "All countries", certificate: "Certificate formalities", ports: "Ports", docs: "Documents and information required",
    infos: "Additional information", procedure: "Procedure", delays: "Timeline", penalties: "Penalties",
    quoteTitle: "Quote request", sendTitle: "Send documents", neighbours: "Other countries",
    toc: "On this page", quoteCta: "Request a quote", sendCta: "Send documents", actions: "Your request", kicker: "Your destination",
  },
  forms: {
    country: "Destination country", choose: "Choose a country", goods: "Goods", goodsPh: "For example: spare parts, 2 x 20ft containers",
    name: "Full name", company: "Company", email: "E-mail address", phone: "Phone", notes: "Comments",
    consent: "I agree that IBESC uses this information to process my request.", send: "Send my request", sending: "Sending",
    sentTitle: "Request sent", sentRef: "Your reference number is", sentText: "The IBESC team will reply to the address you gave.",
    errNet: "Connection failed. Check your network and try again.", errSend: "Sending failed. Please try again in a moment.",
    departure: "Departure date", shipper: "Shipper country", consignee: "Consignee country", filesTitle: "Your documents",
    filesHint: "PDF, image, Word or Excel. 10 MB maximum per file.", bl: "Bill of lading", invoice: "Commercial invoice", exportDoc: "Export invoice / document", other: "Other document",
    sendDocs: "Send documents", spam: "Please check your spam folder: our reply may be there.",
    quoteIntro: "Your details are only used to answer your request. Allow 24 to 48 hours.", docsIntro: "Already have your quote? Send your documents directly to start the certificate.",
    reqNote: "Fields marked with an asterisk are required.",
    secShipment: "Your shipment", secContact: "Your details", secConfirm: "Confirmation",
    errRate: "Too many requests were sent from your connection. Please wait a few minutes before trying again.",
    errSize: "A file exceeds the allowed size (10 MB per file). Please reduce it and try again.",
    errType: "One of the files is not an accepted format (PDF, image, Word or Excel).",
    errFiles: "Attach the required documents (bill of lading and commercial invoice) before sending.",
    errInvalid: "Some information is incomplete or invalid. Please check the fields and try again.",
  },
  about: { title: "About us", lead: "International BESC Business: you export, we assist." },
  tracking: {
    title: "Tracking and traceability", lead: "Follow your cargo by container number or bill of lading number.",
    carriers: "Shipping line tracking sites", realtime: "Real-time follow-up",
    items: ["Vessel departure date and port", "Transhipment information", "Arrival date and port"],
  },
  news: { title: "News and circulars", lead: "Regulation changes that affect your shipments.", empty: "No circular is published yet.", read: "Read" },
  contact: { title: "Contact", lead: "You export, we assist!", hours: "Opening hours", hoursV: "Monday to Friday, 9am – 6pm", phone: "Phone", mail: "E-mail", address: "Address" },
  footer: { tag: "You export, we assist.", legal: "Privacy and cookie policy: coming soon.", tagline: "Your maritime formalities, made simple.", explore: "Explore", beside: "At your side", stayInTouch: "Stay in touch" },
};

const nl: Dict = {
  preprod: "Preproductieversie: inhoud wordt nagelezen.", skip: "Naar de inhoud",
  utility: { partner: "Uw partner voor verschepingen naar Afrika" },
  nav: { home: "Home", about: "Over ons", countries: "Bestemmingen", tracking: "Cargo tracking", news: "Nieuws / circulaires", contact: "Contact", apply: "Certificaat aanvragen", expertise: "Onze expertise" },
  menu: { title: "Kies uw bestemmingsland", sub: "Vereisten en formaliteiten van het certificaat per land.", search: "Zoek een land", all: "Alle landen bekijken", none: "Geen enkel land gevonden." },
  home: {
    kicker: "Cargo tracking certificaten",
    title: "U laadt, wij staan u bij.",
    lead: "BSC, BESC, ECTN, CTN: één aanspreekpunt om het certificaat voor uw zending naar Afrika te verkrijgen en te laten valideren, zonder boetes in de haven.",
    finderLabel: "Uw bestemmingsland",
    whyTitle: "Waarom met IBESC werken",
    why: [
      { t: "Eenvoudig", d: "Aanvraag online of per e-mail. U voegt uw documenten toe, wij regelen de rest." },
      { t: "Efficiënt", d: "Eén aanspreekpunt voor alle landen. Wij bewaken de validatietermijnen om boetes te vermijden." },
      { t: "Snel", d: "Ontwerpcertificaat binnen 24 uur, gevalideerd certificaat in 48 tot 72 uur." },
    ],
    stepsTitle: "Hoe het werkt",
    steps: [
      { t: "Stuur uw dossier", d: "Stuur ons uw aanvraag en de documenten van uw zending.", tag: "AANVRAAG" },
      { t: "Controleer uw ontwerp", d: "Wij bereiden het ontwerpcertificaat voor en sturen u de factuur.", tag: "VOORBEREIDING" },
      { t: "Bevestig de gegevens", d: "Controleer het ontwerp, bevestig de gegevens en ga over tot betaling.", tag: "BEVESTIGING" },
      { t: "Ontvang uw certificaat", d: "Na validatie ontvangt u uw document om uw formaliteiten af te ronden.", tag: "VALIDATIE" },
    ],
    coverTitle: "Landen die wij dekken",
    coverLead: "Klik op een land om de formaliteiten te zien.",
    typesTitle: "Een ander certificaat per land",
    typesLead: "Elk land eist zijn eigen document. Dit zijn de documenten die wij behandelen.",
    ctaTitle: "Een zending naar Afrika?",
    ctaText: "Vraag uw certificaat of een gratis offerte aan. Wij antwoorden binnen 24 tot 48 werkuren.",
    ctaBtn: "Gratis offerte aanvragen",
    /* New prototype keys */
    eyebrow: "KOERS NAAR AFRIKA. MET EEN GERUST GEMOED.",
    titleLine1: "U laadt.", titleLine2: "Wij staan", titleLine3: "u bij.",
    ctaLabel: "Mijn certificaat aanvragen", howLink: "Hoe het werkt",
    assurance: "BSC, BESC, ECTN, CTN en andere certificaten",
    finderEyebrow: "ÉÉN BESTEMMING, ÉÉN CERTIFICAAT", finderTitle: "Waarheen verscheept u?",
    finderPlaceholder: "Selecteer uw bestemming", finderBtn: "Formaliteiten bekijken",
    certLabel: "ÉÉN EXPERTISE, AL UW CERTIFICATEN",
    destEyebrow: "01 / UW BESTEMMINGEN",
    destTitle: "Elk land heeft zijn regels.", destTitleEm: "Wij begeleiden u.",
    destDesc: "Vind het certificaat voor uw bestemming en raadpleeg de informatie om uw dossier voor te bereiden.",
    destFilterAll: "Alle bestemmingen", destFilterWest: "West-Afrika", destFilterCentral: "Centraal-Afrika", destFilterOther: "Andere bestemmingen",
    destSearchPh: "Zoek een land…", destBottom: "Het juiste document, voor de juiste bestemming.",
    destShowAll: "Bestemmingen verkennen",
    processEyebrow: "02 / EEN DUIDELIJK TRAJECT",
    processTitle: "Van het eerste document tot een", processTitleEm: "vlot vertrek.",
    processDesc: "Een eenvoudig traject, menselijke opvolging. Wij begeleiden u bij elke stap.",
    processBtn: "Aan de slag, mijn aanvraag voorbereiden",
    expertiseEyebrow: "03 / DE IBESC-AANPAK",
    expertiseTitle: "Gevoel voor service.", expertiseTitleEm: "Ervaring uit het veld.",
    expertiseIntro: "Achter elke zending schuilt een project. Onze rol: uw documentaire procedures eenvoudiger en duidelijker maken.",
    benefits: [
      { t: "Eén aanspreekpunt, meerdere bestemmingen", d: "Centraliseer uw aanvragen bij een team dat uw behoeften kent." },
      { t: "Formaliteiten eenvoudig uitgelegd", d: "Begrijp welke documenten u moet voorbereiden en de stappen van uw aanvraag." },
      { t: "Begeleiding tot aan de validatie", d: "Ga vooruit met een contactpersoon die beschikbaar is voor uw vragen en aanpassingen." },
    ],
    expertiseLink: "Ontdek IBESC",
    faqEyebrow: "ANTWOORDEN VÓÓR VERTREK",
    faqTitle: "Een vraag?", faqTitleEm: "Laten we praten.", faqLink: "Ons team contacteren",
    faq: [
      { q: "Welk certificaat moet ik kiezen voor mijn zending?", a: "Het certificaat hangt af van het bestemmingsland. Gebruik onze landenzoeker om het bijbehorende document te vinden en de formaliteiten te raadplegen." },
      { q: "Welke documenten moet ik voorbereiden?", a: "De vereiste documenten variëren per bestemming. Het cognossement (BL) en facturen maken doorgaans deel uit van het dossier. Raadpleeg de pagina van uw land en laat de lijst bevestigen door ons team." },
      { q: "Hoe vraag ik een offerte aan?", a: "Ga naar het aanvraagformulier, vul uw bestemming en de gegevens van uw zending in. Ons team antwoordt met de nodige informatie voor uw dossier." },
      { q: "Kan ik mijn lading volgen?", a: "De rubriek 'Cargo tracking' geeft u toegang tot de trackingtools van de rederijen. Zo kunt u de voortgang van uw lading bij de betrokken rederij raadplegen." },
    ],
    bannerEyebrow: "UW VOLGENDE ZENDING BEGINT HIER",
    bannerTitle: "Klaar om", bannerTitleEm: "uit te varen?",
    bannerDesc: "Laat de formaliteiten aan ons over. Houd uw focus op uw activiteit.",
    bannerBtn: "Certificaat aanvragen",
  },
  countries: { title: "Landen en certificaten", lead: "Kies het bestemmingsland van uw lading.", count: (n) => `${n} landen`, empty: "Er is nog geen land gepubliceerd.", noMatch: "Geen enkel land gevonden." },
  dir: {
    filters: "Filteren op regio", search: "Zoek een land of een certificaat", reset: "Herstellen",
    showAll: (n) => `Alle ${n} bestemmingen verkennen`,
    results: "{shown} van {total} bestemmingen getoond",
  },
  country: {
    back: "Alle landen", certificate: "Vereisten certificaat", ports: "Zeehavens", docs: "Vereiste informatie en documenten",
    infos: "Bijkomende informatie", procedure: "Procedure", delays: "Termijnen", penalties: "Sancties",
    quoteTitle: "Offerteaanvraag", sendTitle: "Documenten versturen", neighbours: "Andere landen",
    toc: "Op deze pagina", quoteCta: "Offerte aanvragen", sendCta: "Documenten versturen", actions: "Uw aanvraag", kicker: "Uw bestemming",
  },
  forms: {
    country: "Bestemmingsland", choose: "Kies een land", goods: "Goederen", goodsPh: "Bijvoorbeeld: reserveonderdelen, 2 containers van 20 voet",
    name: "Naam en voornaam", company: "Bedrijf", email: "E-mailadres", phone: "Telefoon", notes: "Opmerkingen",
    consent: "Ik ga ermee akkoord dat IBESC deze gegevens gebruikt om mijn aanvraag te behandelen.", send: "Mijn aanvraag versturen", sending: "Bezig met verzenden",
    sentTitle: "Aanvraag verzonden", sentRef: "Uw referentienummer is", sentText: "Het IBESC-team antwoordt op het opgegeven adres.",
    errNet: "Geen verbinding. Controleer uw netwerk en probeer opnieuw.", errSend: "Verzenden mislukt. Probeer het zo meteen opnieuw.",
    departure: "Vertrekdatum", shipper: "Land van de lader", consignee: "Land van de geadresseerde", filesTitle: "Uw documenten",
    filesHint: "PDF, afbeelding, Word of Excel. Maximaal 10 MB per bestand.", bl: "Cognossement", invoice: "Handelsfactuur", exportDoc: "Exportfactuur / document", other: "Ander document",
    sendDocs: "Documenten versturen", spam: "Controleer uw spam-map: ons antwoord kan daar terechtkomen.",
    quoteIntro: "Uw gegevens worden alleen gebruikt om uw aanvraag te beantwoorden. Reken op 24 tot 48 uur.", docsIntro: "Hebt u uw offerte al? Stuur ons meteen uw documenten om het certificaat te starten.",
    reqNote: "Velden met een sterretje zijn verplicht.",
    secShipment: "Uw zending", secContact: "Uw gegevens", secConfirm: "Bevestiging",
    errRate: "Er zijn te veel aanvragen vanaf uw verbinding verstuurd. Wacht enkele minuten en probeer opnieuw.",
    errSize: "Een bestand is te groot (maximaal 10 MB per bestand). Verklein het en probeer opnieuw.",
    errType: "Een van de bestanden heeft geen toegestaan formaat (PDF, afbeelding, Word of Excel).",
    errFiles: "Voeg de verplichte documenten toe (cognossement en handelsfactuur) vóór het versturen.",
    errInvalid: "Sommige gegevens zijn onvolledig of ongeldig. Controleer de velden en probeer opnieuw.",
  },
  about: { title: "Over ons", lead: "International BESC Business: u exporteert, wij staan u bij." },
  tracking: {
    title: "Opvolging en traceerbaarheid", lead: "Volg uw lading met een containernummer of cognossementnummer.",
    carriers: "Trackingsites van de rederijen", realtime: "Opvolging in real time",
    items: ["Vertrekdatum en haven van het schip", "Informatie over overlading", "Aankomstdatum en haven"],
  },
  news: { title: "Nieuws en circulaires", lead: "Wijzigingen in de regelgeving die uw zendingen raken.", empty: "Er is nog geen circulaire gepubliceerd.", read: "Lezen" },
  contact: { title: "Contact", lead: "U laadt, en wij staan u bij!", hours: "Openingsuren", hoursV: "Maandag tot vrijdag, 9u – 18u", phone: "Telefoon", mail: "E-mail", address: "Adres" },
  footer: { tag: "U laadt, wij staan u bij.", legal: "Privacy- en cookiebeleid: binnenkort beschikbaar.", tagline: "Uw maritieme formaliteiten, eenvoudig gemaakt.", explore: "Verkennen", beside: "Aan uw zijde", stayInTouch: "Blijf in contact" },
};

export const T: Record<Lang, Dict> = { fr, en, nl };
