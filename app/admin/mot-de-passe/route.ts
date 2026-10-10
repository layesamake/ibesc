import { changerMotDePasse, configure, cookieAttrs, creerCookie, esc, motDePasseOk, sessionOk } from "@/lib/admin";
import { page } from "@/lib/adminui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN = 8;

const formulaire = (msg = "", ok = false, status = 200) =>
  page(`<header><h1>IBESC : espace équipe</h1><a href="/admin" style="color:#fff">← Retour aux demandes</a></header>
<div class="box" style="margin-top:6vh"><h1>Changer le mot de passe</h1>
<form method="post" action="/admin/mot-de-passe">
<label for="a">Mot de passe actuel</label><input id="a" name="actuel" type="password" autocomplete="current-password" required>
<label for="n">Nouveau mot de passe (${MIN} caractères minimum)</label><input id="n" name="nouveau" type="password" autocomplete="new-password" minlength="${MIN}" required>
<label for="c">Confirmer le nouveau mot de passe</label><input id="c" name="confirmation" type="password" autocomplete="new-password" minlength="${MIN}" required>
${msg ? `<p class="${ok ? "" : "err"}" role="alert">${esc(msg)}</p>` : ""}
<button type="submit">Enregistrer</button></form>
<p style="color:#4b5568;font-size:.85rem">Les autres personnes connectées seront déconnectées et devront utiliser le nouveau mot de passe.</p></div>`, status);

export async function GET(req: Request) {
  if (!configure() || !sessionOk(req.headers.get("cookie"))) return new Response(null, { status: 303, headers: { Location: "/admin" } });
  return formulaire();
}

const essais = new Map<string, number[]>();

export async function POST(req: Request) {
  if (!configure() || !sessionOk(req.headers.get("cookie"))) return new Response(null, { status: 303, headers: { Location: "/admin" } });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  const now = Date.now();
  const recents = (essais.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recents.length >= 8) return formulaire("Trop d'essais. Réessayez dans quelques minutes.", false, 429);
  const f = await req.formData().catch(() => null);
  const g = (k: string) => { const v = f?.get(k); return typeof v === "string" ? v : ""; };
  const actuel = g("actuel"), nouveau = g("nouveau"), conf = g("confirmation");
  if (!motDePasseOk(actuel)) { recents.push(now); essais.set(ip, recents); return formulaire("Mot de passe actuel incorrect.", false, 401); }
  if (nouveau.length < MIN) return formulaire(`Le nouveau mot de passe doit contenir au moins ${MIN} caractères.`, false, 400);
  if (nouveau.length > 200) return formulaire("Mot de passe trop long.", false, 400);
  if (nouveau !== conf) return formulaire("La confirmation ne correspond pas.", false, 400);
  if (nouveau === actuel) return formulaire("Le nouveau mot de passe doit être différent de l'actuel.", false, 400);
  changerMotDePasse(nouveau);
  const r = new Response(null, { status: 303, headers: { Location: "/admin" } });
  r.headers.append("Set-Cookie", cookieAttrs(creerCookie()));
  return r;
}
