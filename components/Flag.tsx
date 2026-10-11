/* eslint-disable @next/next/no-img-element */
export default function Flag({ code, className = "flag" }: { code: string; className?: string }) {
  if (!code) return <span className={className} aria-hidden="true" />;
  // Flags are small, essential UI cues (country cards, atlas preview and forms).
  // Do not defer them: on long pages lazy loading can leave visible cards blank
  // until the browser has already painted the destination list.
  return <img className={className} src={`/flags/${code.toLowerCase()}.svg`} alt="" width={28} height={21} decoding="async" />;
}
