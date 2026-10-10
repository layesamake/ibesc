import { page } from "@/lib/adminui";
import { configure, cookieAttrs, COOKIE, creerCookie, esc, lire, motDePasseOk, sessionOk, type Devis, type Envoi } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const login = (erreur = "") =>
  page(`<div class="box"><h1>Espace équipe IBESC</h1><form method="post" action="/admin"><label for="p">Mot de passe</label><input id="p" name="mdp" type="password" autocomplete="current-password" required autofocus>${erreur ? `<p class="err" role="alert">${esc(erreur)}</p>` : ""}<button type="submit">Se connecter</button></form></div>`, erreur ? 401 : 200);

const date = (iso: string) => { const d = new Date(iso); return isNaN(+d) ? esc(iso) : esc(d.toLocaleString("fr-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" })); };

export async function GET(req: Request) {
  if (!configure()) return page(`<div class="box"><h1>Non configuré</h1><p>Le mot de passe de l'espace équipe n'est pas défini sur le serveur.</p></div>`, 503);
  if (!sessionOk(req.headers.get("cookie"))) return login();
  const [devis, envois] = await Promise.all([lire<Devis>("demandes.jsonl"), lire<Envoi>("documents.jsonl")]);

  const lDevis = devis.slice(0, 300).map((d) => `<tr><td class="ref">${esc(d.ref)}<br>${date(d.recuLe)}</td><td>${esc(d.pays)}</td><td>${esc(d.marchandise)}</td><td>${esc(d.nom)}<br>${esc(d.societe)}</td><td><a href="mailto:${esc(d.email)}">${esc(d.email)}</a><br>${esc(d.telephone)}</td><td class="msg">${esc(d.message)}</td><td>${esc((d.langue ?? "").toUpperCase())}</td></tr>`).join("");
  const lEnvois = envois.slice(0, 300).map((d) => `<tr><td class="ref">${esc(d.ref)}<br>${date(d.recuLe)}</td><td>${esc(d.pays)}<br>départ ${esc(d.depart)}<br>chargeur : ${esc(d.chargeur)}</td><td>${esc(d.nom)}</td><td><a href="mailto:${esc(d.email)}">${esc(d.email)}</a><br>${esc(d.telephone)}</td><td>${(d.fichiers ?? []).map((f) => `<a href="/admin/fichier?ref=${encodeURIComponent(d.ref)}&amp;f=${encodeURIComponent(f)}">${esc(f)}</a>`).join("<br>")}</td><td class="msg">${esc(d.message)}</td></tr>`).join("");

  return page(`<header><h1>IBESC : espace équipe</h1><form method="post" action="/admin"><a href="/admin/mot-de-passe" style="color:#fff;margin-right:1rem">Changer le mot de passe</a><input type="hidden" name="action" value="logout"><button type="submit">Se déconnecter</button></form></header>
<main>
<h2>Demandes de devis (${devis.length})</h2>
${lDevis ? `<table><thead><tr><th>Référence</th><th>Pays</th><th>Marchandise</th><th>Contact</th><th>Coordonnées</th><th>Message</th><th>Langue</th></tr></thead><tbody>${lDevis}</tbody></table>` : `<p class="vide">Aucune demande pour le moment.</p>`}
<h2>Envois de documents (${envois.length})</h2>
${lEnvois ? `<table><thead><tr><th>Référence</th><th>Expédition</th><th>Client</th><th>Coordonnées</th><th>Fichiers</th><th>Message</th></tr></thead><tbody>${lEnvois}</tbody></table>` : `<p class="vide">Aucun envoi pour le moment.</p>`}
</main>`);
}

const essais = new Map<string, number[]>();

export async function POST(req: Request) {
  if (!configure()) return page(`<div class="box"><p>Non configuré.</p></div>`, 503);
  const f = await req.formData().catch(() => null);
  if (f?.get("action") === "logout") {
    const r = new Response(null, { status: 303, headers: { Location: "/admin" } });
    r.headers.append("Set-Cookie", cookieAttrs("", 0));
    return r;
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  const now = Date.now();
  const recents = (essais.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recents.length >= 8) return login("Trop d'essais. Réessayez dans quelques minutes.");
  const mdp = f?.get("mdp");
  if (typeof mdp !== "string" || !motDePasseOk(mdp)) {
    recents.push(now); essais.set(ip, recents);
    return login("Mot de passe incorrect.");
  }
  const r = new Response(null, { status: 303, headers: { Location: "/admin" } });
  r.headers.append("Set-Cookie", cookieAttrs(creerCookie()));
  return r;
}
void COOKIE;
