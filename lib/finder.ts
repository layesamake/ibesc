import type { FinderText } from "@/components/CountryFinder";
import type { Lang } from "./i18n";
import { T } from "./i18n";

// Textes de l'annuaire des pays, prêts à être passés au composant client.
export function finderText(lang: Lang, total: number): FinderText {
  const t = T[lang];
  return {
    filtersLabel: t.dir.filters,
    searchLabel: t.dir.search,
    searchPh: t.home.destSearchPh,
    none: t.countries.noMatch,
    reset: t.dir.reset,
    all: t.home.destFilterAll,
    west: t.home.destFilterWest,
    central: t.home.destFilterCentral,
    other: t.home.destFilterOther,
    showAll: t.dir.showAll(total),
    bottom: t.home.destBottom,
    results: t.dir.results,
  };
}
