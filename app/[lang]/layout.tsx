import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LANGS, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

export const metadata: Metadata = {
  title: { default: "IBESC : certificats de suivi des cargaisons pour l'Afrique", template: "%s | IBESC" },
  description: "Choisissez votre pays de destination, consultez les documents à fournir et demandez votre certificat BSC, BESC, ECTN ou CTN.",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { items } = await getPays(lang);
  const lite = items.map((p) => ({ slug: p.slug, nom: p.nom[lang], code: p.code, certificat: p.certificat }));
  return (
    <html lang={lang}>
      <body>
        <Header lang={lang} pays={lite} />
        <main id="contenu">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
