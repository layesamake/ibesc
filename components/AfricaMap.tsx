import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { ISO_NUM } from "@/lib/countries";

const W = 560, H = 600;
type F = GeoJSON.Feature<GeoJSON.Geometry, { name?: string }> & { id?: string | number };

// Approximate markers for territories not drawn separately by Natural Earth 50m.
// Coordinates: Google DSPL countries.csv; BQ and UM use a representative island.
const TERRITORY_POINTS: Record<string, [number, number]> = {
  BQ: [-68.26, 12.18], BV: [3.41, -54.42], CX: [105.69, -10.45], CC: [96.87, -12.16],
  GF: [-53.13, 3.93], GI: [-5.35, 36.14], GP: [-61.55, 16.27], MQ: [-61.02, 14.64],
  YT: [45.17, -12.83], RE: [55.54, -21.12], SJ: [23.67, 77.55], TK: [-171.86, -8.97],
  TV: [177.65, -7.11], UM: [-177.37, 28.21],
};

const countries = (() => {
  const topo = world as unknown as Topology;
  const all = (feature(topo, topo.objects.countries as GeometryCollection) as unknown as GeoJSON.FeatureCollection)
    .features as F[];
  const byNum = new Map<number, string>(Object.entries(ISO_NUM).map(([c, n]) => [n, c]));
  for (const [code, coordinates] of Object.entries(TERRITORY_POINTS)) {
    all.push({ type: "Feature", id: ISO_NUM[code], properties: {}, geometry: { type: "Point", coordinates } });
  }
  return all.map((f, index) => ({ feature: f, code: byNum.get(Number(f.id)) ?? null, key: `${f.id ?? "territory"}-${index}` }));
})();

function mapPaths(covered: Set<string>) {
  const box: GeoJSON.Feature<GeoJSON.MultiPoint> = {
    type: "Feature", properties: {},
    geometry: { type: "MultiPoint", coordinates: [[-20, -36], [56, -36], [56, 38], [-20, 38]] },
  };
  const destinations = countries.filter((country) => country.code && covered.has(country.code));
  // Keep the Africa view by default, and expand it to include new destinations.
  const extent: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [box, ...destinations.map((country) => country.feature)] };
  const projection = geoMercator().fitExtent([[12, 12], [W - 12, H - 12]], extent).clipExtent([[0, 0], [W, H]]);
  const path = geoPath(projection);
  return countries.flatMap((country) => {
    const d = path(country.feature);
    if (!d) return [];
    // Unpublished fallback territories should not add dots to the base map.
    if (country.feature.geometry.type === "Point" && (!country.code || !covered.has(country.code))) return [];
    const marker = country.feature.geometry.type !== "Point" && country.code && covered.has(country.code) && path.area(country.feature) < 36
      ? path.centroid(country.feature) : null;
    return [{ ...country, d, marker }];
  }).sort((a, b) => Number(Boolean(a.code && covered.has(a.code))) - Number(Boolean(b.code && covered.has(b.code))));
}

export default function AfricaMap({
  current,
  covered,
  hrefFor,
  nameFor,
  linkLabel,
  label,
}: {
  current?: string;
  covered?: string[];
  hrefFor?: (code: string) => string;
  nameFor?: (code: string) => string;
  linkLabel?: (code: string) => string;
  label: string;
}) {
  const cov = new Set((covered ?? []).map((code) => code.toUpperCase()));
  if (current) cov.add(current.toUpperCase());
  const paths = mapPaths(cov);
  return (
    <svg className="map" viewBox={`0 0 ${W} ${H}`} role={hrefFor ? "group" : "img"} aria-label={label}>
      {paths.map((c) => {
        const isCur = c.code && c.code === current?.toUpperCase();
        const isCov = c.code && (cov.has(c.code) || isCur);
        const cls = isCur ? "map__c map__c--cur" : isCov ? "map__c map__c--cov" : "map__c";
        const name = c.code ? nameFor?.(c.code) : undefined;
        // A visible marker keeps small island states clickable at this scale.
        const el = <>
          <path d={c.d} className={cls} />
          {c.marker && <circle cx={c.marker[0]} cy={c.marker[1]} r={4} className={cls} />}
        </>;
        return isCov && hrefFor && c.code ? (
          <a key={c.key} href={hrefFor(c.code)} aria-label={linkLabel?.(c.code) ?? name ?? c.code} data-country={c.code}>
            <title>{name ?? c.code}</title>
            {el}
          </a>
        ) : <g key={c.key}>{el}</g>;
      })}
    </svg>
  );
}
