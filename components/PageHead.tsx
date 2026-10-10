// En-tête commun des pages secondaires : étiquette, titre H1 Poppins et chapeau.
export default function PageHead({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <section className="pagehead">
      <div className="wrap">
        {eyebrow ? <p className="eyebrow pagehead__eyebrow">{eyebrow}</p> : null}
        <h1 className="h1">{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </section>
  );
}
