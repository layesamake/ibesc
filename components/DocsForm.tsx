"use client";

import { useState } from "react";
import type { T } from "@/lib/i18n";

type Opt = { slug: string; nom: string };
type F = (typeof T)["fr"]["forms"];
type Etat = { type: "repos" } | { type: "envoi" } | { type: "ok"; ref: string } | { type: "erreur"; message: string };
const MAX = 10 * 1024 * 1024;

export default function DocsForm({ pays, choix, t, lang }: { pays: Opt[]; choix: string; t: F; lang: string }) {
  const [etat, setEtat] = useState<Etat>({ type: "repos" });

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat.type === "envoi") return;
    const f = new FormData(e.currentTarget);
    for (const [, v] of f.entries()) {
      if (v instanceof File && v.size > MAX) return setEtat({ type: "erreur", message: t.errSize });
    }
    f.set("consentement", f.get("consentement") ? "oui" : "");
    f.set("langue", lang);
    setEtat({ type: "envoi" });
    try {
      const res = await fetch("/api/documents", { method: "POST", body: f });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = String(data.message ?? "");
        const message = res.status === 413 || code === "taille" ? t.errSize
          : res.status === 429 || code === "rate" ? t.errRate
          : code === "type" ? t.errType
          : code === "fichiers" ? t.errFiles
          : res.status === 400 ? t.errInvalid
          : t.errSend;
        return setEtat({ type: "erreur", message });
      }
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

  const files: [string, string, boolean][] = [["bl", t.bl, true], ["facture", t.invoice, true], ["export", t.exportDoc, false], ["autre", t.other, false]];
  return (
    <form className="form" onSubmit={envoyer}>
      <fieldset className="group">
        <legend>{t.secShipment}</legend>
        <div className="field-row">
          <div className="field">
            <label htmlFor="d-depart">{t.departure} *</label>
            <input id="d-depart" name="depart" type="date" required />
          </div>
          <div className="field">
            <label htmlFor="d-pays">{t.consignee} *</label>
            <select id="d-pays" name="pays" required defaultValue={choix}>
              <option value="">{t.choose}</option>
              {pays.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="d-chargeur">{t.shipper} *</label>
          <input id="d-chargeur" name="chargeur" required maxLength={80} />
        </div>
      </fieldset>
      <fieldset className="group">
        <legend>{t.secContact}</legend>
        <div className="field">
          <label htmlFor="d-nom">{t.name} / {t.company} *</label>
          <input id="d-nom" name="nom" required maxLength={160} autoComplete="organization" />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="d-email">{t.email} *</label>
            <input id="d-email" name="email" type="email" required maxLength={160} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="d-tel">{t.phone}</label>
            <input id="d-tel" name="telephone" type="tel" maxLength={40} autoComplete="tel" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="d-message">{t.notes}</label>
          <textarea id="d-message" name="message" rows={3} maxLength={2000} />
        </div>
      </fieldset>
      <fieldset className="group">
        <legend>{t.filesTitle}</legend>
        <p className="hint">{t.filesHint}</p>
        {files.map(([k, label, req]) => (
          <div className="field" key={k}>
            <label htmlFor={`f-${k}`}>{label}{req ? " *" : ""}</label>
            <input id={`f-${k}`} name={k} type="file" required={req} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />
          </div>
        ))}
      </fieldset>
      <div className="trap" aria-hidden="true">
        <label htmlFor="d-site">Do not fill</label>
        <input id="d-site" name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset className="group group--plain">
        <legend className="sr-only">{t.secConfirm}</legend>
        <div className="check">
          <input id="d-consent" name="consentement" type="checkbox" required />
          <label htmlFor="d-consent">{t.consent} <a href={`/${lang}/confidentialite`} target="_blank" rel="noopener">{lang === "fr" ? "Confidentialité" : "Privacy"}</a></label>
        </div>
        {etat.type === "erreur" ? <p className="notice" role="alert">{etat.message}</p> : null}
        <button className="button" type="submit" disabled={etat.type === "envoi"} aria-busy={etat.type === "envoi"}>
          {etat.type === "envoi" ? t.sending : <>{t.sendDocs} <span aria-hidden="true">→</span></>}
        </button>
      </fieldset>
    </form>
  );
}
