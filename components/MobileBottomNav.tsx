"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/i18n";

type MobileBottomNavProps = {
  lang: Lang;
  labels: {
    home: string;
    countries: string;
    tracking: string;
    contact: string;
    apply: string;
  };
};

function Icon({ name }: { name: "home" | "map" | "track" | "contact" | "apply" }) {
  if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>;
  if (name === "map") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3zM9 3v15m6-12v15" /></svg>;
  if (name === "track") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17h4l3-10 4 14 3-8h4M3 5h4" /></svg>;
  if (name === "contact") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 7l8 6 8-6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" /></svg>;
}

export default function MobileBottomNav({ lang, labels }: MobileBottomNavProps) {
  const pathname = usePathname();
  const base = `/${lang}`;
  const items = [
    { href: base, label: labels.home, icon: "home" as const, match: pathname === base },
    { href: `${base}/pays`, label: labels.countries, icon: "map" as const, match: pathname.startsWith(`${base}/pays`) },
    { href: `${base}/devis`, label: labels.apply, icon: "apply" as const, match: pathname.startsWith(`${base}/devis`), primary: true },
    { href: `${base}/suivi`, label: labels.tracking, icon: "track" as const, match: pathname.startsWith(`${base}/suivi`) },
    { href: `${base}/contact`, label: labels.contact, icon: "contact" as const, match: pathname.startsWith(`${base}/contact`) },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label={labels.home}>
      <div className="mobile-bottom-nav__inner">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={item.primary ? "mobile-bottom-nav__item mobile-bottom-nav__item--primary" : "mobile-bottom-nav__item"}
            aria-current={item.match ? "page" : undefined}
          >
            <span className="mobile-bottom-nav__icon"><Icon name={item.icon} /></span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
