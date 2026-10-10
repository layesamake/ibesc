import Image from "next/image";
import Link from "next/link";
import { CONTACT, T, type Lang } from "@/lib/i18n";
import CountryMenu, { type PaysLite } from "./CountryMenu";
import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";

export default function Header({ lang, pays }: { lang: Lang; pays: PaysLite[] }) {
  const t = T[lang];
  return (
    <>
      <a className="skip" href="#contenu">{t.skip}</a>
      <div className="utility">
        <div className="wrap">
          <span data-short="IBESC">INTERNATIONAL BESC BUSINESS <i></i> {t.utility.partner}</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <header className="header">
        <div className="wrap header-inner">
          <Link href={`/${lang}`} className="brand" aria-label="International BESC Business">
            <Image src="/logo.png" alt="" width={52} height={52} priority unoptimized />
            <span>IBESC<small>INTERNATIONAL BESC BUSINESS</small></span>
          </Link>
          <MobileNav label="Menu">
              <Link href={`/${lang}`}>{t.nav.home}</Link>
              <CountryMenu lang={lang} pays={pays} t={{ label: t.nav.countries, ...t.menu }} />
              <Link href={`/${lang}/a-propos`}>{t.nav.about}</Link>
              <Link href={`/${lang}/suivi`}>{t.nav.tracking} <span aria-hidden="true">↗</span></Link>
              <Link href={`/${lang}/circulaires`}>{t.nav.news}</Link>
              <Link href={`/${lang}/contact`}>{t.nav.contact}</Link>
              <LangSwitch lang={lang} />
              <Link href={`/${lang}/devis`} className="button small">{t.nav.apply} <span aria-hidden="true">↗</span></Link>
          </MobileNav>
        </div>
      </header>
    </>
  );
}
