/* eslint-disable @next/next/no-img-element */
export default function Flag({ code, className = "flag" }: { code: string; className?: string }) {
  if (!code) return <span className={className} aria-hidden="true" />;
  return <img className={className} src={`/flags/${code.toLowerCase()}.svg`} alt="" width={28} height={21} loading="lazy" />;
}
