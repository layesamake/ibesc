"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, type Lang } from "@/lib/i18n";

export default function LangSwitch({ lang }: { lang: Lang }) {
  const path = usePathname() ?? `/${lang}`;
  const reste = path.replace(/^\/(fr|en|nl)(?=\/|$)/, "");
  return (
    <ul className="lang" aria-label="Language">
      {LANGS.map((l) => (
        <li key={l}>
          <Link href={`/${l}${reste}`} hrefLang={l} lang={l} aria-current={l === lang ? "true" : undefined} className={l === lang ? "lang__a lang__a--on" : "lang__a"}>
            {l.toUpperCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}
