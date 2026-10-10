import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountryFinder from "@/components/CountryFinder";
import { finderText } from "@/lib/finder";
import Flag from "@/components/Flag";
import { T, isLang } from "@/lib/i18n";
import { getPays } from "@/lib/wp";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const { items, erreur } = await getPays(lang);
  const lite = items.map((p) => ({ slug: p.slug, nom: p.nom[lang], code: p.code, certificat: p.certificat }));

  /* Certificate type list for the ticker */
  const certTypes = new Set<string>();
  for (const p of items) if (p.certificat) certTypes.add(p.certificat);
  const certList = [...certTypes].sort();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot"></span> {t.home.eyebrow}</p>
          <h1 id="hero-title">{t.home.titleLine1}<br />{t.home.titleLine2}<br /><em>{t.home.titleLine3}</em></h1>
          <p className="hero-lead">{t.home.lead}</p>
          <div className="hero-actions">
            <Link href={`/${lang}/devis`} className="button">{t.home.ctaLabel} <span aria-hidden="true">↗</span></Link>
            <a className="text-link" href="#fonctionnement">{t.home.howLink} <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-assurance"><span className="check-icon">✓</span> {t.home.assurance}</div>
        </div>
        <div className="hero-visual">
          <Image className="cargo" src="/cargo.webp" alt="" width={750} height={500} priority unoptimized />
          <div className="image-label"><span className="dot"></span> {lang === "nl" ? "MARKTEN VERBINDEN. HANDEL VEREENVOUDIGEN." : lang === "en" ? "CONNECTING MARKETS. SIMPLIFYING TRADE." : "CONNECTER LES MARCHÉS. SIMPLIFIER LES ÉCHANGES."}</div>
          <div className="image-coordinate">EUROPE <span>──────────→</span> AFRIQUE</div>
          <div className="floating-note">
            <span className="document-icon" aria-hidden="true">▤</span>
            <div>
              <small>{lang === "nl" ? "UW VOLGENDE TUSSENSTOP" : lang === "en" ? "YOUR NEXT PORT OF CALL" : "VOTRE PROCHAINE ESCALE"}</small>
              <strong>{lang === "nl" ? "Goed begeleide formaliteiten." : lang === "en" ? "Well-guided formalities." : "Des formalités bien accompagnées."}</strong>
              <span>{lang === "nl" ? "U gaat vooruit. Wij zorgen voor het dossier." : lang === "en" ? "You move forward. We handle the file." : "Vous avancez. Nous nous occupons du dossier."}</span>
            </div>
            <span className="note-arrow" aria-hidden="true">↗</span>
          </div>
          <span className="image-caption">{lang === "nl" ? "Documentaire expertise ten dienste van uw zendingen." : lang === "en" ? "Documentary expertise at the service of your shipments." : "L'expertise documentaire au service de vos expéditions."}</span>
        </div>
      </section>

      {/* ── Finder bar ───────────────────────────────────── */}
      <section className="finder wrap" aria-label={t.home.finderTitle}>
        <div>
          <span className="eyebrow">{t.home.finderEyebrow}</span>
          <h2>{t.home.finderTitle}</h2>
        </div>
        <form action={`/${lang}/pays`}>
          <label className="sr-only" htmlFor="destination">{t.forms.country}</label>
          <div className="select-wrap">
            <span aria-hidden="true">◎</span>
            <select id="destination" name="pays">
              <option value="">{t.home.finderPlaceholder}</option>
              {lite.map((p) => (
                <option key={p.slug} value={p.slug}>{p.nom}</option>
              ))}
            </select>
          </div>
          <button className="button" type="submit">{t.home.finderBtn} <span aria-hidden="true">→</span></button>
        </form>
      </section>

      {/* ── Certificate ticker ───────────────────────────── */}
      <div className="certificates wrap">
        <span>{t.home.certLabel}</span>
        <div>{certList.length > 0 ? certList.join(" · ") : "BESC · ECTN · BSC · CTN · FERI · CNCA · BIETC"}</div>
      </div>

      {/* ── 01 / Destinations ────────────────────────────── */}
      <section className="destinations section wrap" id="destinations" aria-labelledby="dest-title" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.home.destEyebrow}</p>
            <h2 id="dest-title">{t.home.destTitle}<br /><em>{t.home.destTitleEm}</em></h2>
          </div>
          <p>{t.home.destDesc}</p>
        </div>

        <CountryFinder lang={lang} pays={lite} text={finderText(lang, lite.length)} />
      </section>

      {/* ── 02 / Process ─────────────────────────────────── */}
      <section className="process" id="fonctionnement" data-reveal>
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.home.processEyebrow}</p>
              <h2>{t.home.processTitle}<br /><em>{t.home.processTitleEm}</em></h2>
            </div>
            <p>{t.home.processDesc}</p>
          </div>
          <div className="steps">
            {t.home.steps.map((s, i) => (
              <article key={s.t} data-reveal>
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="step-line"></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <span className="step-tag">{s.tag}</span>
              </article>
            ))}
          </div>
          <Link className="button light" href={`/${lang}/devis`}>{t.home.processBtn} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      {/* ── 03 / Expertise ───────────────────────────────── */}
      <section className="expertise section wrap" id="expertise" data-reveal>
        <div className="expertise-image">
          <Image src="/port.webp" width={750} height={500} alt="" loading="lazy" unoptimized />
          <div className="photo-tag">
            <span>{lang === "nl" ? "VOORBIJ HET CERTIFICAAT." : lang === "en" ? "BEYOND THE CERTIFICATE." : "AU-DELÀ DU CERTIFICAT."}</span>
            <strong>{lang === "nl" ? <>Een partner<br />aan uw zijde.</> : lang === "en" ? <>A partner<br />at your side.</> : <>Un partenaire<br />à vos côtés.</>}</strong>
          </div>
        </div>
        <div className="expertise-copy">
          <p className="eyebrow">{t.home.expertiseEyebrow}</p>
          <h2>{t.home.expertiseTitle}<br /><em>{t.home.expertiseTitleEm}</em></h2>
          <p className="intro">{t.home.expertiseIntro}</p>
          {t.home.benefits.map((b, i) => (
            <div className="benefit" key={b.t}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{b.t}</h3><p>{b.d}</p></div>
            </div>
          ))}
          <Link className="text-link" href={`/${lang}/a-propos`}>{t.home.expertiseLink} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="faq wrap section" data-reveal>
        <div>
          <p className="eyebrow">{t.home.faqEyebrow}</p>
          <h2>{t.home.faqTitle}<br /><em>{t.home.faqTitleEm}</em></h2>
          <Link className="text-link" href={`/${lang}/contact`}>{t.home.faqLink} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="faq-list">
          {t.home.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}<span aria-hidden="true">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contact banner ───────────────────────────────── */}
      <section className="contact-banner wrap" data-reveal>
        <div>
          <p className="eyebrow">{t.home.bannerEyebrow}</p>
          <h2>{t.home.bannerTitle} <em>{t.home.bannerTitleEm}</em></h2>
          <p>{t.home.bannerDesc}</p>
        </div>
        <Link className="button light" href={`/${lang}/devis`}>{t.home.bannerBtn} <span aria-hidden="true">↗</span></Link>
        <span className="banner-orbit" aria-hidden="true"></span>
      </section>
    </>
  );
}
