import Image from "next/image";
import Link from "next/link";
import { CONTACT, T, type Lang } from "@/lib/i18n";
import { LIEN_LEGAL } from "@/lib/legal";

export default function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  const studioLabel = { fr: "Espace gestionnaire", en: "Content manager", nl: "Beheerdersruimte" }[lang];
  return (
    <footer>
      <div className="wrap footer-main">
        <div>
          <Link href={`/${lang}`} className="brand">
            <Image src="/logo.png" alt="" width={48} height={48} unoptimized />
            <span>IBESC<small>INTERNATIONAL BESC BUSINESS</small></span>
          </Link>
          <p>{t.footer.tag}<br />{t.footer.tagline}</p>
        </div>
        <div>
          <p className="footer-heading">{t.footer.explore}</p>
          <Link href={`/${lang}/pays`}>{t.nav.countries}</Link>
          <Link href={`/${lang}/suivi`}>{t.nav.tracking}</Link>
          <Link href={`/${lang}/circulaires`}>{t.nav.news}</Link>
        </div>
        <div>
          <p className="footer-heading">{t.footer.beside}</p>
          <Link href={`/${lang}/a-propos`}>{t.nav.about}</Link>
          <Link href={`/${lang}/devis`}>{t.nav.apply}</Link>
          <Link href={`/${lang}/contact`}>{t.nav.contact}</Link>
        </div>
        <div>
          <p className="footer-heading">{t.footer.stayInTouch}</p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email} ↗</a>
          <a href="https://www.linkedin.com/company/international-besc-business/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <p>{CONTACT.adresse}</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} IBESC. {t.footer.legal}</span>
        <span className="footer-links">
          <Link href={`/${lang}/confidentialite`}>{LIEN_LEGAL[lang]}</Link>
          <a className="footer-studio-link" href="https://admin.ibesc.cloud/wp-admin" target="_blank" rel="noopener noreferrer">{studioLabel}</a>
        </span>
      </div>
    </footer>
  );
}
