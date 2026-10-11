"use client";

import { useId, useState } from "react";
import { EXPERIENCE } from "@/lib/experience";
import type { Lang } from "@/lib/i18n";

export default function DocumentChecklist({ documents, lang }: { documents: string[]; lang: Lang }) {
  const [checked, setChecked] = useState<number[]>([]);
  const id = useId();
  const copy = EXPERIENCE[lang];
  return <div className="document-checklist">
    <p className="hint">{copy.checklist}</p>
    <p className="checklist-progress" role="status">{checked.length} / {documents.length} {copy.prepared}</p>
    <ul>{documents.map((doc, index) => <li key={index}>
      <input id={`${id}-${index}`} type="checkbox" checked={checked.includes(index)} onChange={(e) => setChecked((current) => e.target.checked ? [...current, index] : current.filter((n) => n !== index))} />
      <label htmlFor={`${id}-${index}`}>{doc}</label>
    </li>)}</ul>
  </div>;
}
