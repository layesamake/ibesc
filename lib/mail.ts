import nodemailer from "nodemailer";
import type { Devis, Envoi } from "./admin";

const SITE = process.env.SITE_URL ?? "https://ibesc.cloud";

const configure = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_TO);

function transport() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
  });
}

const une = (s: unknown, max = 200) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
const from = () => process.env.MAIL_FROM || process.env.SMTP_USER || "";

async function envoyer(m: { to: string; subject: string; text: string; replyTo?: string }) {
  await transport().sendMail({ from: `International BESC Business <${from()}>`, to: m.to, subject: une(m.subject, 150), text: m.text, replyTo: m.replyTo });
}

const ACCUSE: Record<string, { sujet: (r: string) => string; corps: (nom: string, r: string, docs: boolean) => string }> = {
  fr: {
    sujet: (r) => `IBESC : votre demande ${r} est bien reçue`,
    corps: (n, r, docs) => `Bonjour ${n},\n\n${docs ? "Nous avons bien reçu vos documents." : "Nous avons bien reçu votre demande de devis."} Votre numéro de référence est ${r}.\n\nNotre équipe vous répond sous 24 à 48 heures ouvrées. Pensez à vérifier vos courriers indésirables si vous ne voyez rien venir.\n\nCordialement,\nInternational BESC Business\nVous chargez, nous vous assistons.\n+32 492 888 002 · info@ibescbusiness.com`,
  },
  en: {
    sujet: (r) => `IBESC: your request ${r} has been received`,
    corps: (n, r, docs) => `Hello ${n},\n\n${docs ? "We have received your documents." : "We have received your quote request."} Your reference number is ${r}.\n\nOur team will reply within 24 to 48 working hours. Please check your spam folder if you do not hear from us.\n\nKind regards,\nInternational BESC Business\nYou export, we assist.\n+32 492 888 002 · info@ibescbusiness.com`,
  },
  nl: {
    sujet: (r) => `IBESC: uw aanvraag ${r} is ontvangen`,
    corps: (n, r, docs) => `Beste ${n},\n\n${docs ? "Wij hebben uw documenten ontvangen." : "Wij hebben uw offerteaanvraag ontvangen."} Uw referentienummer is ${r}.\n\nOns team antwoordt binnen 24 tot 48 werkuren. Controleer uw spam-map als u niets van ons hoort.\n\nMet vriendelijke groeten,\nInternational BESC Business\nU laadt, wij staan u bij.\n+32 492 888 002 · info@ibescbusiness.com`,
  },
};

async function notifier(alerte: { subject: string; text: string }, client: { email: string; nom: string; langue?: string; ref: string; docs: boolean }) {
  if (!configure()) { console.warn("[mail] SMTP non configuré : aucun e-mail envoyé"); return; }
  const a = ACCUSE[client.langue ?? ""] ?? ACCUSE.fr;
  const resultats = await Promise.allSettled([
    envoyer({ to: process.env.MAIL_TO as string, subject: alerte.subject, text: alerte.text, replyTo: client.email }),
    envoyer({ to: client.email, subject: a.sujet(client.ref), text: a.corps(une(client.nom, 80) || "", client.ref, client.docs), replyTo: process.env.MAIL_REPLY_TO || "info@ibescbusiness.com" }),
  ]);
  resultats.forEach((r, i) => r.status === "rejected" && console.error(`[mail] échec ${i === 0 ? "alerte équipe" : "accusé client"} ${client.ref}:`, (r.reason as Error)?.message));
}

export function mailDevis(d: Devis) {
  void notifier(
    { subject: `[IBESC] Nouveau devis ${d.ref} : ${une(d.pays, 60)}`,
      text: `Nouvelle demande de devis ${d.ref}\n\nPays : ${une(d.pays)}\nMarchandise : ${une(d.marchandise)}\nNom : ${une(d.nom)}\nSociété : ${une(d.societe)}\nE-mail : ${une(d.email)}\nTéléphone : ${une(d.telephone)}\nLangue : ${une(d.langue, 2)}\n\nMessage :\n${String(d.message ?? "").slice(0, 2000)}\n\nVoir : ${SITE}/admin\n(Répondre à cet e-mail répond directement au client.)` },
    { email: d.email, nom: d.nom, langue: d.langue, ref: d.ref, docs: false });
}

export function mailEnvoi(d: Envoi) {
  void notifier(
    { subject: `[IBESC] Documents reçus ${d.ref} : ${une(d.pays, 60)}`,
      text: `Nouvel envoi de documents ${d.ref}\n\nDestination : ${une(d.pays)}\nDépart : ${une(d.depart)}\nPays du chargeur : ${une(d.chargeur)}\nClient : ${une(d.nom)}\nE-mail : ${une(d.email)}\nTéléphone : ${une(d.telephone)}\nFichiers : ${(d.fichiers ?? []).join(", ")}\nLangue : ${une(d.langue, 2)}\n\nMessage :\n${String(d.message ?? "").slice(0, 2000)}\n\nTélécharger les fichiers : ${SITE}/admin\n(Répondre à cet e-mail répond directement au client.)` },
    { email: d.email, nom: d.nom, langue: d.langue, ref: d.ref, docs: true });
}
