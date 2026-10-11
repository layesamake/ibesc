"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Lang, T } from "@/lib/i18n";
import { EXPERIENCE } from "@/lib/experience";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Mode = "quote" | "documents";
type FormText = (typeof T)["fr"]["forms"];

export default function RequestJourney({ pays, choix, lang, t, initialMode }: {
  pays: { slug: string; nom: string }[]; choix: string; lang: Lang; t: FormText; initialMode: Mode;
}) {
  const copy = EXPERIENCE[lang];
  const id = useId();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState(initialMode);
  const [destination, setDestination] = useState(choix);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");
  const [reference, setReference] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    if (!hasMoved.current) return;
    const field = pendingFocus.current ? form.current?.elements.namedItem(pendingFocus.current) as Control | null : null;
    (field ?? heading.current)?.focus();
    pendingFocus.current = null;
  }, [step, reference]);

  const errorProps = (name: string) => ({
    id: `${id}-${name}`, name,
    "aria-invalid": errors[name] ? true as const : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const errorMessage = (name: string) => errors[name] ? <p id={`${id}-${name}-error`} className="field-error">{errors[name]}</p> : null;

  function validate(all: boolean) {
    if (!form.current) return false;
    const nextErrors: Record<string, string> = {};
    let first: Control | undefined;
    const controls = Array.from(form.current.querySelectorAll<Control>("input, select, textarea"));
    let total = 0;
    for (const el of controls) {
      if (el.matches(":disabled")) continue;
      const group = Number(el.closest("[data-step]")?.getAttribute("data-step"));
      if (!all && group !== step) continue;
      let message = "";
      if (el.required && (el instanceof HTMLInputElement && el.type === "checkbox" ? !el.checked : !el.value.trim())) {
        message = el.name === "consentement" ? copy.consentError : copy.required;
      } else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) {
        message = copy.emailError;
      } else if (!el.validity.valid) message = t.errInvalid;
      if (el instanceof HTMLInputElement && el.type === "file" && el.files?.[0]) {
        const file = el.files[0];
        total += file.size;
        if (file.size > 10 * 1024 * 1024) message = t.errSize;
        else if (!/\.(pdf|jpe?g|png|docx?|xlsx?)$/i.test(file.name)) message = t.errType;
        else if (!file.size) message = t.errFiles;
        else if (total > 35 * 1024 * 1024) message = copy.totalSize;
      }
      if (message) { nextErrors[el.name] = message; first ??= el; }
    }
    setErrors(nextErrors);
    if (first) {
      const invalidStep = Number(first.closest("[data-step]")?.getAttribute("data-step"));
      if (invalidStep !== step) { pendingFocus.current = first.name; setStep(invalidStep); }
      else first.focus();
      return false;
    }
    return true;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    hasMoved.current = true;
    setFailure("");
    if (!validate(step === 2)) return;
    if (step < 2) { setStep(step + 1); return; }
    const data = new FormData(event.currentTarget);
    data.set("consentement", "oui");
    data.set("langue", lang);
    setSending(true);
    try {
      const response = await fetch(mode === "quote" ? "/api/devis" : "/api/documents", mode === "quote"
        ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data.entries())) }
        : { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || typeof result.ref !== "string" || !result.ref) {
        setFailure(response.status === 429 ? t.errRate : response.status === 413 ? t.errSize : result.message === "type" ? t.errType : response.status === 400 ? t.errInvalid : t.errSend);
      } else setReference(result.ref);
    } catch { setFailure(t.errNet); }
    finally { setSending(false); }
  }

  if (reference) return <div className="journey done" role="status"><h2 ref={heading} tabIndex={-1}>{t.sentTitle}</h2><p>{t.sentRef} <strong className="ref">{reference}</strong></p><p>{t.sentText} {t.spam}</p></div>;

  return <div className="journey">
    <ol className="journey-steps" aria-label={copy.notebook}>{copy.steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined} data-complete={index < step}><span aria-hidden="true">{index < step ? "✓" : `0${index + 1}`}</span>{label}</li>)}</ol>
    <form className="form journey-form" ref={form} noValidate onSubmit={submit} onChange={(event) => {
      const field = event.target;
      if ((field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) && field.name) setErrors((current) => { const next = { ...current }; delete next[field.name]; return next; });
    }}>
      <p className="eyebrow">{copy.step} {step + 1} / 3</p>
      <h2 className="h2" ref={heading} tabIndex={-1}>{copy.steps[step]}</h2>
      <p className="hint">{t.reqNote}</p>
      <fieldset className="journey-stage" data-step="0" hidden={step !== 0} disabled={sending}>
        <legend className="sr-only">{copy.steps[0]}</legend>
        <div className="field"><label htmlFor={`${id}-pays`}>{t.country} *</label>
          <select {...errorProps("pays")} required value={destination} onChange={(event) => setDestination(event.target.value)}><option value="">{t.choose}</option>{pays.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}</select>{errorMessage("pays")}
        </div>
        <fieldset className="journey-choice"><legend>{copy.purpose}</legend>
          {(["quote", "documents"] as const).map((value) => <label key={value} data-selected={mode === value}><input type="radio" name="mode" value={value} checked={mode === value} onChange={() => { setMode(value); setErrors({}); }} /><span><strong>{value === "quote" ? copy.quote : copy.upload}</strong><small>{value === "quote" ? t.quoteIntro : t.docsIntro}</small></span></label>)}
        </fieldset>
      </fieldset>
      <fieldset className="journey-stage" data-step="1" hidden={step !== 1} disabled={sending}>
        <legend className="sr-only">{copy.steps[1]}</legend>
        <fieldset className="journey-stage" hidden={mode !== "quote"} disabled={mode !== "quote"}>
          <legend className="sr-only">{copy.quote}</legend>
          <div className="field"><label htmlFor={`${id}-marchandise`}>{t.goods} *</label><input {...errorProps("marchandise")} required maxLength={200} placeholder={t.goodsPh} />{errorMessage("marchandise")}</div>
          <div className="field"><label htmlFor={`${id}-societe`}>{t.company}</label><input {...errorProps("societe")} autoComplete="organization" maxLength={160} /></div>
        </fieldset>
        <fieldset className="journey-stage" hidden={mode !== "documents"} disabled={mode !== "documents"}>
          <legend className="sr-only">{copy.upload}</legend>
          <div className="field"><label htmlFor={`${id}-depart`}>{t.departure} *</label><input {...errorProps("depart")} type="date" required />{errorMessage("depart")}</div>
          <div className="field"><label htmlFor={`${id}-chargeur`}>{t.shipper} *</label><input {...errorProps("chargeur")} required maxLength={80} />{errorMessage("chargeur")}</div>
        </fieldset>
      </fieldset>
      <fieldset className="journey-stage" data-step="2" hidden={step !== 2} disabled={sending}>
        <legend className="sr-only">{copy.steps[2]}</legend>
        <div className="journey-summary"><strong>{copy.review}</strong><span>{pays.find((p) => p.slug === destination)?.nom} / {mode === "quote" ? copy.quote : copy.upload}</span></div>
        <div className="field"><label htmlFor={`${id}-nom`}>{t.name} *</label><input {...errorProps("nom")} required autoComplete="name" maxLength={120} />{errorMessage("nom")}</div>
        <div className="field-row">
          <div className="field"><label htmlFor={`${id}-email`}>{t.email} *</label><input {...errorProps("email")} type="email" autoComplete="email" required maxLength={160} />{errorMessage("email")}</div>
          <div className="field"><label htmlFor={`${id}-telephone`}>{t.phone}</label><input {...errorProps("telephone")} type="tel" autoComplete="tel" maxLength={40} /></div>
        </div>
        <div className="field"><label htmlFor={`${id}-message`}>{t.notes}</label><textarea {...errorProps("message")} rows={3} maxLength={2000} /></div>
        <fieldset className="group" hidden={mode !== "documents"} disabled={mode !== "documents"}>
          <legend>{t.filesTitle}</legend><p className="hint">{t.filesHint} {copy.totalSize}</p>
          {[["bl", t.bl], ["facture", t.invoice], ["export", t.exportDoc], ["autre", t.other]].map(([name, label], i) => <div className="field" key={name}><label htmlFor={`${id}-${name}`}>{label}{i < 2 ? " *" : ""}</label><input {...errorProps(name)} type="file" required={i < 2} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />{errorMessage(name)}</div>)}
        </fieldset>
        <div className="check"><input {...errorProps("consentement")} type="checkbox" required /><label htmlFor={`${id}-consentement`}>{t.consent} <a href={`/${lang}/confidentialite`} target="_blank" rel="noopener">{lang === "fr" ? "Confidentialité" : "Privacy"}</a></label></div>{errorMessage("consentement")}
      </fieldset>
      <div className="trap" aria-hidden="true"><label htmlFor={`${id}-site`}>Do not fill</label><input id={`${id}-site`} name="site" tabIndex={-1} autoComplete="off" /></div>
      {failure && <p className="notice" role="alert">{failure}</p>}
      <div className="journey-actions">
        {step > 0 && <button className="button button--ghost" type="button" disabled={sending} onClick={() => { hasMoved.current = true; setStep(step - 1); }}>{copy.back}</button>}
        <button className="button" type="submit" disabled={sending || !pays.length} aria-busy={sending}>{sending ? t.sending : step < 2 ? copy.next : mode === "quote" ? t.send : t.sendDocs}<span aria-hidden="true">→</span></button>
      </div>
    </form>
  </div>;
}
