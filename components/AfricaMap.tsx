import { geoBounds, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { ISO_NUM } from "@/lib/countries";

const W = 560, H = 600;
const BBOX: [[number, number], [number, number]] = [[-26, -37], [60, 39]];

type F = GeoJSON.Feature<GeoJSON.Geometry, { name?: string }> & { id?: string | number };

const calc = (() => {
  const topo = world as unknown as Topology;
  const all = (feature(topo, topo.objects.countries as GeometryCollection) as unknown as GeoJSON.FeatureCollection)
    .features as F[];
  const box = { type: "MultiPoint", coordinates: [[-20, -36], [56, -36], [56, 38], [-20, 38]] } as GeoJSON.MultiPoint;
  const proj = geoMercator().fitExtent([[6, 6], [W - 6, H - 6]], box);
  const path = geoPath(proj);
  const local = all.filter((f) => {
    const [[x0, y0], [x1, y1]] = geoBounds(f);
    return x1 >= BBOX[0][0] && x0 <= BBOX[1][0] && y1 >= BBOX[0][1] && y0 <= BBOX[1][1];
  });
  const byNum = new Map<number, string>(Object.entries(ISO_NUM).map(([c, n]) => [n, c]));
  return local.map((f) => ({ d: path(f) ?? "", code: byNum.get(Number(f.id)) ?? null, key: String(f.id) }));
})();

export default function AfricaMap({
  current,
  covered,
  hrefFor,
  label,
}: {
  current?: string;
  covered?: string[];
  hrefFor?: (code: string) => string;
  label: string;
}) {
  const cov = new Set(covered ?? []);
  return (
    <svg className="map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {calc.map((c) => {
        const isCur = c.code && c.code === current;
        const isCov = c.code && (cov.has(c.code) || isCur);
        const cls = isCur ? "map__c map__c--cur" : isCov ? "map__c map__c--cov" : "map__c";
        const el = <path key={c.key} d={c.d} className={cls} />;
        return isCov && hrefFor && c.code ? (
          <a key={c.key} href={hrefFor(c.code)} aria-label={c.code}>{el}</a>
        ) : el;
      })}
    </svg>
  );
}
