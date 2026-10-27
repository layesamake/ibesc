/* eslint-disable @next/next/no-img-element */
export default function Flag({ code, className = "flag" }: { code: string; className?: string }) {
  const countryCode = code.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(countryCode)) return <span className={className} aria-hidden="true" />;
  // Flags are small, essential UI cues (country cards, atlas preview and forms).
  // Do not defer them: on long pages lazy loading can leave visible cards blank
  // until the browser has already painted the destination list.
  return <img className={className} src={`/flags/${countryCode}.svg`} alt="" width={28} height={21} decoding="async" />;
}
