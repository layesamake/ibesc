"use client";

import { useState } from "react";
import type { T } from "@/lib/i18n";

type Opt = { slug: string; nom: string };
type F = (typeof T)["fr"]["forms"];
type Etat = { type: "repos" } | { type: "envoi" } | { type: "ok"; ref: string } | { type: "erreur"; message: string };

export default function DevisForm({ pays, choix, t, lang, compact = false }: { pays: Opt[]; choix: string; t: F; lang: string; compact?: boolean }) {
  const [etat, setEtat] = useState<Etat>({ type: "repos" });

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat.type === "envoi") return;
    setEtat({ type: "envoi" });
    const f = new FormData(e.currentTarget);
    const corps = Object.fromEntries(f.entries());
    corps.consentement = f.get("consentement") ? "oui" : "";
    corps.langue = lang;
    try {
      const res = await fetch("/api/devis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setEtat({ type: "erreur", message: res.status === 429 ? t.errRate : res.status === 400 ? t.errInvalid : t.errSend });
      setEtat({ type: "ok", ref: data.ref });
    } catch {
      setEtat({ type: "erreur", message: t.errNet });
    }
  }

  if (etat.type === "ok") {
    return (
      <div className="done" role="status">
        <h3 className="h3">{t.sentTitle}</h3>
        <p>{t.sentRef} <strong className="ref">{etat.ref}</strong>.</p>
        <p>{t.sentText} {t.spam}</p>
      </div>
    );
  }

  const id = compact ? "q-" : "";
  return (
    <form className="form" onSubmit={envoyer}>
      <fieldset className="group">
        <legend>{t.secShipment}</legend>
        <div className="field">
          <label htmlFor={`${id}pays`}>{t.country} *</label>
          <select id={`${id}pays`} name="pays" required defaultValue={choix}>
            <option value="">{t.choose}</option>
            {pays.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}marchandise`}>{t.goods} *</label>
          <input id={`${id}marchandise`} name="marchandise" required maxLength={200} placeholder={t.goodsPh} />
        </div>
      </fieldset>
      <fieldset className="group">
        <legend>{t.secContact}</legend>
        <div className="field-row">
          <div className="field">
            <label htmlFor={`${id}nom`}>{t.name} *</label>
            <input id={`${id}nom`} name="nom" required autoComplete="name" maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor={`${id}societe`}>{t.company}</label>
            <input id={`${id}societe`} name="societe" autoComplete="organization" maxLength={160} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor={`${id}email`}>{t.email} *</label>
            <input id={`${id}email`} name="email" type="email" required autoComplete="email" maxLength={160} />
          </div>
          <div className="field">
            <label htmlFor={`${id}telephone`}>{t.phone}</label>
            <input id={`${id}telephone`} name="telephone" type="tel" autoComplete="tel" maxLength={40} />
          </div>
        </div>
        <div className="field">
          <label htmlFor={`${id}message`}>{t.notes}</label>
          <textarea id={`${id}message`} name="message" rows={4} maxLength={2000} />
        </div>
      </fieldset>
      <div className="trap" aria-hidden="true">
        <label htmlFor={`${id}site`}>Do not fill</label>
        <input id={`${id}site`} name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset className="group group--plain">
        <legend className="sr-only">{t.secConfirm}</legend>
        <div className="check">
          <input id={`${id}consentement`} name="consentement" type="checkbox" required />
          <label htmlFor={`${id}consentement`}>{t.consent} <a href={`/${lang}/confidentialite`} target="_blank" rel="noopener">{lang === "fr" ? "Confidentialité" : "Privacy"}</a></label>
        </div>
        {etat.type === "erreur" ? <p className="notice" role="alert">{etat.message}</p> : null}
        <button className="button" type="submit" disabled={etat.type === "envoi"} aria-busy={etat.type === "envoi"}>
          {etat.type === "envoi" ? t.sending : <>{t.send} <span aria-hidden="true">→</span></>}
        </button>
      </fieldset>
    </form>
  );
}
