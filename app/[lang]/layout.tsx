import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { LANGS, isLang, T } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

export const metadata: Metadata = {
  title: { default: "IBESC : certificats de suivi des cargaisons pour l'Afrique", template: "%s | IBESC" },
  description: "Choisissez votre pays de destination, consultez les documents à fournir et demandez votre certificat BSC, BESC, ECTN ou CTN.",
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const { items } = await getPays(lang);
  const lite = items.map((p) => ({ slug: p.slug, nom: p.nom[lang], code: p.code, certificat: p.certificat }));
  return (
    <html lang={lang}>
      <body>
        <Header lang={lang} pays={lite} />
        <main id="contenu">{children}</main>
        <Footer lang={lang} />
        <MobileBottomNav lang={lang} labels={{ home: t.nav.home, countries: t.nav.countries, tracking: t.nav.tracking, contact: t.nav.contact, apply: t.nav.apply }} />
      </body>
    </html>
  );
}
