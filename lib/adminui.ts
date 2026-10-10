export const ENTETES = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",
};

export const CSS = `body{font:16px/1.5 system-ui,sans-serif;margin:0;color:#101828;background:#f4f6fa}
header{background:#0b1250;color:#fff;padding:.8rem 1.5rem;display:flex;justify-content:space-between;align-items:center}
header form{margin:0}main{max-width:1200px;margin:1.5rem auto;padding:0 1rem}
h1{font-size:1.4rem;margin:0}h2{margin:2rem 0 .75rem;color:#0b1250}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;font-size:.92rem}
th,td{padding:.6rem .75rem;border-bottom:1px solid #e3e7ef;text-align:left;vertical-align:top}
th{background:#eef1f6;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em}
.ref{font-family:ui-monospace,monospace;font-size:.85rem;white-space:nowrap}
.msg{color:#4b5568;max-width:28ch}a{color:#1b2a9a}
button{font:inherit;background:#0b1250;color:#fff;border:0;border-radius:6px;padding:.55rem 1rem;cursor:pointer}
.box{max-width:360px;margin:15vh auto;background:#fff;padding:2rem;border-radius:12px}
input{font:inherit;width:100%;padding:.6rem;margin:.5rem 0 1rem;border:1px solid #aab3c7;border-radius:6px}
.err{color:#a1260d}.vide{padding:1rem;background:#fff;border-radius:8px;color:#4b5568}`;

export const page = (corps: string, status = 200) =>
  new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IBESC : espace équipe</title><style>${CSS}</style></head><body>${corps}</body></html>`, { status, headers: ENTETES });


export const date = (iso: string) => { const d = new Date(iso); return isNaN(+d) ? iso : d.toLocaleString("fr-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" }); };
