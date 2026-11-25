import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Cable, CalendarDays, CardSim,
  Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, ExternalLink, FileSearch,
  Lightbulb, ListFilter, Mail, Menu, Search, ShieldCheck, Signal, Smartphone,
  Tv2, Wifi, X, Zap, type LucideIcon,
} from 'lucide-react';
import { articles, categories, pageMetadata, type Article, type Category } from './content';
import { articleTradeoffs, articleVisuals, categoryFaqs, categoryVisuals, comparisonFaqs, homeFaqs, type FaqItem } from './editorial';
import type { ComparisonRequest } from './integrations';
import ComparisonExperience from './ComparisonExperience';

const base = typeof document !== 'undefined'
  ? document.querySelector('meta[name="tarifpilot-base"]')?.getAttribute('content') || import.meta.env.BASE_URL
  : import.meta.env.BASE_URL;
const linkTo = (path = '') => `${base}${path.replace(/^\/+|\/+$/g, '')}${path ? '/' : ''}`;
const asset = (path: string) => `${base}${path.replace(/^\/+/, '')}`;
const articleLink = (article: Article) => linkTo(`ratgeber/${article.slug}`);
const categoryLink = (category: Category) => linkTo(`themen/${category.slug}`);
const getCategory = (slug: string) => categories.find((category) => category.slug === slug)!;
const getArticle = (slug: string) => articles.find((article) => article.slug === slug)!;

const icons: Record<string, LucideIcon> = {
  smartphone: Smartphone, sim: CardSim, wifi: Wifi, cable: Cable,
  signal: Signal, tv: Tv2, zap: Zap,
};

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href={linkTo()} className={`logo ${light ? 'logo-light' : ''}`} aria-label="TarifPilot zur Startseite">
      <svg className="logo-mark" viewBox="0 0 44 44" aria-hidden="true">
        <rect x="1" y="1" width="42" height="42" rx="12" fill="currentColor" />
        <path d="M30.5 12.8 25.2 29.9l-4.1-6.2-6.5-3.9 15.9-7Z" fill="white" />
        <path d="m20.9 23.5-3.6 3.6" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="logo-word">Tarif<span>Pilot</span><span className="logo-period">.</span></span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const navGroup = (id: string, label: string, items: Category[]) => <div
    className={`nav-dropdown ${dropdown === id ? 'is-open' : ''}`}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(null); }}
    onKeyDown={(event) => { if (event.key === 'Escape') { setDropdown(null); event.currentTarget.querySelector('button')?.focus(); } }}
  >
    <button type="button" aria-expanded={dropdown === id} aria-controls={`nav-${id}`} onClick={() => setDropdown(dropdown === id ? null : id)}>{label} <ChevronDown size={14} /></button>
    <div className="dropdown-panel" id={`nav-${id}`}>
      {items.map((category) => <a key={category.slug} href={categoryLink(category)}>{category.name}<ChevronRight size={14} /></a>)}
    </div>
  </div>;
  return (
    <>
      <a className="skip-link" href="#hauptinhalt">Zum Inhalt springen</a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span className="utility-message"><CheckCircle2 size={14} /> Dein Wegweiser für bessere Tarifentscheidungen</span>
          <div className="utility-links"><a href={linkTo('ueber-uns')}>Über uns</a><a href={linkTo('vergleichsmethoden')}>So vergleichen wir</a><a href={linkTo('kontakt')}>Kontakt</a></div>
        </div>
      </div>
      <header className="site-header" onKeyDown={(event) => { if (event.key === 'Escape' && open) { setOpen(false); event.currentTarget.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } }}>
        <div className="container header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Hauptnavigation">
            {navGroup('mobilfunk', 'Mobilfunk', [categories[0], categories[1], categories[4]])}
            {navGroup('internet', 'Internet', [categories[2], categories[3]])}
            <a href={categoryLink(categories[5])}>Streaming & TV</a>
            <a href={categoryLink(categories[6])}>Strom & Gas</a>
            <a className="nav-blog" href={linkTo('ratgeber')}><BookOpen size={15} /> Ratgeber</a>
          </nav>
          <div className="header-actions">
            <a className="header-search" href={linkTo('suche')} aria-label="Ratgeber suchen"><Search size={20} /></a>
            <a className="header-cta" href={linkTo('vergleich')}>Tarifvergleich <ArrowRight size={16} /></a>
            <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile Navigation">
          <div className="container">
            {categories.map((category) => <a href={categoryLink(category)} key={category.slug}>{category.name}<ChevronRight size={16} /></a>)}
            <a className="mobile-nav-primary" href={linkTo('ratgeber')}><BookOpen size={17} /> Ratgeber &amp; Blog<ChevronRight size={16} /></a>
            <a className="mobile-nav-primary" href={linkTo('vergleich')}>Tarifvergleich<ChevronRight size={16} /></a>
            <a href={linkTo('ueber-uns')}>Über uns<ChevronRight size={16} /></a>
          </div>
        </nav>}
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo light />
            <p>Finde den passenden Tarif.<br />Vergleiche clever. Spare mehr.</p>
            <span>Dein Kompass für bessere Entscheidungen.</span>
          </div>
          <div className="footer-column"><h3>Unsere Themen</h3>
            {categories.map((category) => <a href={categoryLink(category)} key={category.slug}>{category.name}</a>)}
          </div>
          <div className="footer-column"><h3>TarifPilot</h3>
            <a href={linkTo('ueber-uns')}>Über uns</a><a href={linkTo('ratgeber')}>Ratgeber &amp; Blog</a><a href={linkTo('vergleich')}>Tarifvergleich</a><a href={linkTo('vergleichsmethoden')}>Vergleichsmethoden</a><a href={linkTo('redaktionelle-richtlinien')}>Redaktionelle Richtlinien</a><a href={linkTo('kontakt')}>Kontakt</a>
          </div>
          <div className="footer-column"><h3>Rechtliches</h3>
            <a href={linkTo('impressum')}>Impressum</a><a href={linkTo('datenschutz')}>Datenschutz</a><a href={linkTo('cookie-einstellungen')}>Cookie-Einstellungen</a><a href={linkTo('affiliate-hinweis')}>Affiliate-Hinweis</a><a href={linkTo('sitemap')}>Sitemap</a>
          </div>
        </div>
        <div className="footer-disclosure">Transparenz ist uns wichtig: Derzeit sind keine Affiliate-Links oder Live-Tarife eingebunden. <a href={linkTo('affiliate-hinweis')}>Mehr erfahren <ArrowRight size={14} /></a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} TarifPilot. Klarheit für deine Entscheidungen.</span><span>Mit Sorgfalt für dich gemacht.</span></div>
      </div>
    </footer>
  );
}

function SearchForm({ initial = '', compact = false }: { initial?: string; compact?: boolean }) {
  return (
    <form className={`search-form ${compact ? 'search-form-compact' : ''}`} action={linkTo('suche')} method="get" role="search">
      <Search size={21} aria-hidden="true" />
      <label className="sr-only" htmlFor={compact ? 'search-compact' : 'search-main'}>Ratgeber durchsuchen</label>
      <input id={compact ? 'search-compact' : 'search-main'} name="q" defaultValue={initial} placeholder="Wonach suchst du?" />
      <button type="submit">Suchen <ArrowRight size={17} /></button>
    </form>
  );
}

function SectionHeading({ eyebrow, title, copy, link, linkText }: { eyebrow: string; title: string; copy?: string; link?: string; linkText?: string }) {
  return <div className="section-heading">
    <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
    {link && <a className="text-link section-heading-link" href={link}>{linkText} <ArrowRight size={17} /></a>}
  </div>;
}

const featured = ['handytarife-deutschland-vergleichen', 'dsl-oder-glasfaser', 'streaming-abos-vergleichen'];
const homeCategoryNames: Record<string, string> = {
  'mobilfunk': 'Handytarife', 'sim-only-prepaid': 'SIM-Only', 'internet-dsl': 'Internet & DSL',
  'glasfaser-kabel': 'Glasfaser', '5g-unlimited': '5G & Unlimited', 'streaming-tv': 'Streaming & TV', 'strom-gas': 'Strom & Gas',
};

function EditorialCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const category = getCategory(article.category);
  const visual = articleVisuals[article.slug] || categoryVisuals[article.category];
  return <a className={`feature-card ${compact ? 'editorial-card-small' : ''}`} href={articleLink(article)}>
    <div className="feature-image"><img src={asset(`images/${visual.file}`)} alt={visual.alt} loading="lazy" /></div>
    <div className="feature-copy"><span className="article-category">{category.shortName}</span><h3>{article.title}</h3>{!compact && <p>{article.description}</p>}<span className="feature-meta"><span><Clock3 size={14} /> {readMinutes(article)} Min. Lesezeit</span><span className="feature-link">Ratgeber lesen <ArrowRight size={16} /></span></span></div>
  </a>;
}

function HomePage() {
  const recent = ['stromtarife-vergleichen', 'wie-funktioniert-5g', 'prepaid-oder-vertrag', 'internetvertrag-worauf-achten'].map(getArticle);
  return <>
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(239,246,253,.99) 0%, rgba(239,246,253,.95) 28%, rgba(239,246,253,.72) 45%, rgba(239,246,253,0) 70%), url('${asset('images/hero-tarifpilot.jpg')}')` }}>
      <div className="container hero-inner"><div className="hero-copy">
        <span className="hero-brandline">Tarif<span>Pilot</span><b>.</b></span>
        <h1>Finde den passenden Tarif.<br />Vergleiche clever.<br /><em>Spare mehr.</em></h1>
        <p>Dein Kompass für verständliche Tarife und Entscheidungen, die zu deinem Leben passen.</p>
        <SearchForm />
        <div className="hero-trust" aria-label="Unsere Grundsätze"><span><Check size={14} /> Verständlich erklärt</span><span><Check size={14} /> Transparent informiert</span><span><Check size={14} /> Ohne erfundene Angebote</span></div>
      </div></div>
    </section>

    <section className="category-section section-space">
      <div className="container">
        <SectionHeading eyebrow="DEINE THEMEN IM ÜBERBLICK" title="Was möchtest du vergleichen?" copy="Finde genau die Informationen, die du für deine Entscheidung brauchst." />
        <div className="category-grid">
          {categories.map((category) => {
            const Icon = icons[category.icon];
            const count = articles.filter((article) => article.category === category.slug).length;
            return <a className="category-card" href={categoryLink(category)} key={category.slug}>
              <span className="category-top"><span className="category-icon"><Icon size={25} strokeWidth={1.8} /></span><span className="category-count">{count} <span>Ratgeber</span></span></span>
              <span className="category-name">{homeCategoryNames[category.slug]}</span><span className="category-desc">{category.description}</span><span className="category-arrow"><ArrowRight size={17} /></span>
            </a>;
          })}
        </div>
      </div>
    </section>

    <section className="featured-section section-space">
      <div className="container">
        <SectionHeading eyebrow="WISSEN, DAS WEITERHILFT" title="Gute Entscheidungen fangen hier an." copy="Verständliche Ratgeber für die Fragen, die wirklich zählen." link={linkTo('ratgeber')} linkText="Alle Ratgeber ansehen" />
        <div className="feature-grid">
          {featured.map((slug) => <EditorialCard article={getArticle(slug)} key={slug} />)}
        </div>
      </div>
    </section>

    <section className="guidance-section">
      <div className="container guidance-inner">
        <div className="guidance-heading"><span className="eyebrow eyebrow-light">WARUM TARIFPILOT?</span><h2>Weniger Tarifdschungel.<br />Mehr Durchblick.</h2><p>Wir machen komplexe Tarifthemen verständlich, damit du mit einem guten Gefühl entscheiden kannst.</p><a className="light-link" href={linkTo('vergleich')}>Vergleich vorbereiten <ArrowRight size={17} /></a></div>
        <div className="guidance-steps">
          <div><span>01</span><div><h3>Bedarf kennen</h3><p>Was brauchst du im Alltag wirklich?</p></div></div>
          <div><span>02</span><div><h3>Details vergleichen</h3><p>Auf Leistung, Laufzeit und Gesamtkosten achten.</p></div></div>
          <div><span>03</span><div><h3>Bewusst entscheiden</h3><p>Aktuelle Bedingungen vor dem Abschluss prüfen.</p></div></div>
        </div>
      </div>
    </section>

    <section className="latest-section section-space">
      <div className="container">
        <SectionHeading eyebrow="FRISCH AUS DEM RATGEBER" title="Wissen, das dich weiterbringt." copy="Praktische Antworten für deinen digitalen Alltag." link={linkTo('ratgeber')} linkText="Alle Artikel entdecken" />
        <div className="latest-grid">{recent.map((article) => <EditorialCard article={article} compact key={article.slug} />)}</div>
      </div>
    </section>

    <FaqSection eyebrow="GUT ZU WISSEN" title="Noch Fragen? Wir helfen weiter." description="Das Wichtigste über TarifPilot auf einen Blick." faqs={homeFaqs} />
    <NewsletterSection />
    <section className="bottom-note"><div className="container bottom-note-inner"><span className="bottom-note-icon"><ShieldCheck size={26} /></span><div><h2>Orientierung, auf die du zählen kannst.</h2><p>Keine erfundenen Angebote. Keine leeren Versprechen. Einfach hilfreiches Wissen.</p></div><a className="text-link" href={linkTo('redaktionelle-richtlinien')}>Unsere redaktionellen Grundsätze <ArrowRight size={17} /></a></div></section>
  </>;
}

function FaqSection({ eyebrow, title, description, faqs, compact = false }: { eyebrow: string; title: string; description?: string; faqs: FaqItem[]; compact?: boolean }) {
  return <section className={`faq-section ${compact ? 'faq-section-compact' : ''}`}>
    <div className="container faq-layout"><div className="faq-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}<a className="text-link" href={linkTo('ratgeber')}>Alle Ratgeber entdecken <ArrowRight size={16} /></a></div>
      <div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div>
    </div>
  </section>;
}

function NewsletterSection() {
  return <section className="newsletter-section"><div className="container newsletter-inner">
    <div className="newsletter-copy"><span className="eyebrow">TARIFPILOT NEWSLETTER</span><h2>Gutes Wissen bleibt aktuell.</h2><p>In Zukunft möchten wir dir hilfreiche Tipps direkt ins Postfach bringen.</p></div>
    <form className="newsletter-form" onSubmit={(event) => event.preventDefault()} aria-label="Newsletter-Anmeldung derzeit nicht verfügbar">
      <label htmlFor="newsletter-email">Deine E-Mail-Adresse</label>
      <div className="newsletter-controls"><Mail size={19} /><input id="newsletter-email" type="email" placeholder="name@beispiel.de" disabled /><button type="submit" disabled>Noch nicht verfügbar</button></div>
      <p>Die Anmeldung ist noch nicht eingerichtet. Es werden keine E-Mail-Adressen erfasst.</p>
    </form>
  </div></section>;
}

function ArticleRow({ article }: { article: Article }) {
  const category = getCategory(article.category);
  return <a className="article-row" href={articleLink(article)}><span className="article-row-icon"><BookOpen size={20} /></span><span className="article-row-copy"><span className="article-category">{category.shortName}</span><strong>{article.title}</strong></span><ArrowUpRight className="article-row-arrow" size={19} /></a>;
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumb" aria-label="Brotkrumennavigation"><a href={linkTo()}>Startseite</a>{items.map((item, index) => <span key={`${item.label}-${index}`}><ChevronRight size={14} />{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}

function CategoryPage({ category }: { category: Category }) {
  const Icon = icons[category.icon];
  const categoryArticles = articles.filter((article) => article.category === category.slug);
  const related = categories.filter((item) => item.slug !== category.slug).slice(0, 4);
  return <>
    <section className="inner-hero"><div className="container"><Breadcrumb items={[{ label: category.name }]} /><div className="category-intro"><div><span className="eyebrow">THEMENWELT</span><h1>{category.name}</h1><p>{category.intro}</p></div><span className="category-intro-icon"><Icon size={42} strokeWidth={1.5} /></span></div></div></section>
    <section className="section-space"><div className="container category-layout">
      <div><div className="content-heading"><span className="eyebrow">GUT ZU WISSEN</span><h2>Unsere Ratgeber</h2><p>Wissen, das dir bei deiner Entscheidung weiterhilft.</p></div><div className="guide-list">{categoryArticles.map((article) => <a href={articleLink(article)} className="guide-list-item" key={article.slug}><span className="guide-list-number">{String(categoryArticles.indexOf(article) + 1).padStart(2, '0')}</span><span><span className="article-category">{category.shortName}</span><strong>{article.title}</strong><span className="guide-description">{article.description}</span></span><ArrowUpRight size={21} /></a>)}</div></div>
      <aside className="category-aside"><span className="aside-icon"><ListFilter size={22} /></span><h2>Darauf kommt es an</h2><p>Diese Fragen helfen dir, Angebote sinnvoll einzuordnen.</p><ul>{category.criteria.map(([name, detail]) => <li key={name}><Check size={16} /><span><strong>{name}</strong>{detail}</span></li>)}</ul><a className="text-link" href={linkTo('vergleich')}>Vergleich vorbereiten <ArrowRight size={16} /></a></aside>
    </div></section>
    <FaqSection eyebrow="HÄUFIGE FRAGEN" title={`Noch Fragen zu ${category.shortName}?`} description="Die wichtigsten Antworten für deinen Einstieg." faqs={categoryFaqs[category.slug]} compact />
    <section className="related-section"><div className="container"><SectionHeading eyebrow="NOCH MEHR ENTDECKEN" title="Weitere Themen für dich" /><div className="related-topics">{related.map((item) => <a href={categoryLink(item)} key={item.slug}>{item.name}<ArrowRight size={17} /></a>)}</div></div></section>
  </>;
}

function readMinutes(article: Article) {
  const text = [article.intro, ...article.sections.flatMap((section) => section.paragraphs), article.conclusion].join(' ');
  return Math.max(3, Math.ceil(text.split(/\s+/).length / 150));
}

function sourceFor(category: string) {
  if (category === 'strom-gas') return { name: 'Verbraucherzentrale: Energieanbieter wechseln', url: 'https://www.verbraucherzentrale.de/wissen/energie/preise-tarife-anbieterwechsel/so-klappt-der-wechsel-zu-einem-neuen-energieanbieter-85945' };
  if (category === 'streaming-tv') return { name: 'Verbraucherzentrale: Digitale Welt', url: 'https://www.verbraucherzentrale.de/wissen/digitale-welt' };
  if (category === 'internet-dsl' || category === 'glasfaser-kabel') return { name: 'Bundesnetzagentur: Breitbandmessung', url: 'https://www.breitbandmessung.de/' };
  if (category === 'mobilfunk' || category === '5g-unlimited') return { name: 'Bundesnetzagentur: Mobilfunk-Monitoring', url: 'https://gigabitgrundbuch.bund.de/' };
  return { name: 'Bundesnetzagentur: Anbieterwechsel und Umzug', url: 'https://www.bundesnetzagentur.de/DE/Vportal/TK/InternetTelefon/Wechsel/start.html' };
}

function ArticlePage({ article }: { article: Article }) {
  const category = getCategory(article.category);
  const source = sourceFor(article.category);
  const visual = articleVisuals[article.slug] || categoryVisuals[article.category];
  const tradeoffs = articleTradeoffs[article.slug];
  const published = article.publishedAt ? new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${article.publishedAt}T12:00:00Z`)) : null;
  return <>
    <div className="article-top"><div className="container"><Breadcrumb items={[{ label: category.name, href: categoryLink(category) }, { label: 'Ratgeber' }]} /><div className="article-head"><span className="article-category">{category.name} <span className="category-dot">·</span> RATGEBER</span><h1>{article.title}</h1><p>{article.description}</p><div className="article-meta"><span><span className="mini-logo">T</span> TarifPilot Redaktion</span>{published && <span><CalendarDays size={16} /> <time dateTime={article.publishedAt}>{published}</time></span>}<span><BookOpen size={16} /> Redaktioneller Ratgeber</span><span><Clock3 size={16} /> {readMinutes(article)} Min. Lesezeit</span></div></div><figure className="article-cover"><img src={asset(`images/${visual.file}`)} alt={visual.alt} width="1200" height="720" fetchPriority="high" decoding="async" /></figure></div></div>
    <div className="container article-layout">
      <aside className="article-toc"><span>IN DIESEM ARTIKEL</span><a href="#ueberblick">Überblick</a>{article.sections.map((section, index) => <a key={section.heading} href={`#abschnitt-${index + 1}`}>{section.heading}</a>)}{tradeoffs && <a href="#vor-und-nachteile">Vorteile und wichtige Fragen</a>}<a href="#fazit">Unser Fazit</a></aside>
      <article className="article-body"><p className="article-lead" id="ueberblick">{article.intro}</p>
        {article.sections.map((section, index) => <div key={section.heading}>
          <section id={`abschnitt-${index + 1}`}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          {index === 1 && <div className="comparison-table-wrap"><h2>{article.table.title}</h2><div className="table-scroll"><table><thead><tr>{article.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{article.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div><p className="table-note">Einordnung zur Orientierung, kein Vergleich aktueller Anbieterangebote.</p></div>}
          {index === 1 && tradeoffs && <section className="tradeoffs" id="vor-und-nachteile"><h2>{tradeoffs.subject}: Vorteile und wichtige Fragen</h2><div className="tradeoff-grid"><div><h3>Das spricht dafür</h3><ul>{tradeoffs.positives.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></div><div><h3>Das solltest du beachten</h3><ul>{tradeoffs.considerations.map((item) => <li key={item}><Lightbulb size={17} />{item}</li>)}</ul></div></div></section>}
        </div>)}
        <section id="fazit" className="conclusion"><span><Lightbulb size={21} /></span><div><h2>Das Wichtigste zum Schluss</h2><p>{article.conclusion}</p></div></section>
        <section className="article-recommendation"><span className="eyebrow">DEIN NÄCHSTER SCHRITT</span><h2>Gut vorbereitet zum passenden Tarif.</h2><p>Erstelle deine persönliche Checkliste und erfahre, welche Kriterien für deinen Vergleich wichtig sind. Aktuelle Anbieterangebote zeigen wir derzeit nicht.</p><a className="primary-button inline-button" href={linkTo('vergleich')}>Vergleich vorbereiten <ArrowRight size={16} /></a><a className="recommendation-disclosure" href={linkTo('affiliate-hinweis')}>Mehr über unsere Transparenz</a></section>
        <div className="article-sources"><strong>Gut zu wissen</strong><p>Unsere Ratgeber dienen der allgemeinen Information und ersetzen keine individuelle Beratung. Angaben und Vertragsbedingungen können sich ändern.</p><a href={source.url} target="_blank" rel="noopener noreferrer">Zum Weiterlesen: {source.name} <ExternalLink size={14} /></a></div>
      </article>
    </div>
    <section className="related-section"><div className="container"><SectionHeading eyebrow="DAS KÖNNTE DICH AUCH INTERESSIEREN" title="Wissen, das weiterhilft." link={categoryLink(category)} linkText={`Mehr zu ${category.shortName}`} /><div className="related-articles">{article.related.map((slug) => getArticle(slug)).filter(Boolean).map((item) => <EditorialCard article={item} compact key={item.slug} />)}</div></div></section>
  </>;
}

function GuideHub() {
  const [selected, setSelected] = useState('alle');
  const feature = getArticle('handytarife-deutschland-vergleichen');
  const featureVisual = articleVisuals[feature.slug] || categoryVisuals[feature.category];
  const shown = articles
    .filter((article) => selected === 'alle' || article.category === selected)
    .filter((article) => selected !== 'alle' || article.slug !== feature.slug);
  const activeLabel = selected === 'alle' ? 'allen Themen' : getCategory(selected).name;
  return <>
    <section className="blog-hero">
      <div className="container">
        <Breadcrumb items={[{ label: 'Ratgeber & Blog' }]} />
        <div className="blog-hero-grid">
          <div className="blog-hero-copy">
            <span className="eyebrow eyebrow-light">RATGEBER &amp; BLOG</span>
            <h1>Wissen, das deine Tarifentscheidung leichter macht.</h1>
            <p>Von Mobilfunk bis Energie: verständliche Erklärungen, konkrete Checklisten und hilfreiche Vergleiche – ohne erfundene Live-Angebote.</p>
            <SearchForm compact />
            <div className="blog-hero-stats"><span><strong>{articles.length}</strong> ausführliche Ratgeber</span><span><strong>{categories.length}</strong> Themenwelten</span></div>
          </div>
          <a className="blog-feature-story" href={articleLink(feature)}>
            <div className="blog-feature-image"><img src={asset(`images/${featureVisual.file}`)} alt={featureVisual.alt} width="900" height="560" fetchPriority="high" /></div>
            <div className="blog-feature-copy"><span className="article-category">IM FOKUS · {getCategory(feature.category).shortName}</span><h2>{feature.title}</h2><span className="feature-link">Ratgeber lesen <ArrowRight size={16} /></span></div>
          </a>
        </div>
      </div>
    </section>
    <section className="blog-archive section-space">
      <div className="container">
        <div className="blog-toolbar">
          <div><span className="eyebrow">RATGEBER-ARCHIV</span><h2>Alle Artikel</h2><p>{shown.length} {shown.length === 1 ? 'Ratgeber' : 'Ratgeber'} zu {activeLabel}. Durchsuche die Übersicht nach Thema oder nutze die Suche.</p></div>
          <div className="blog-filters" role="group" aria-label="Ratgeber nach Thema filtern">
            <button type="button" aria-pressed={selected === 'alle'} className={selected === 'alle' ? 'active' : ''} onClick={() => setSelected('alle')}>Alle <span>{articles.length}</span></button>
            {categories.map((category) => <button type="button" key={category.slug} aria-pressed={selected === category.slug} className={selected === category.slug ? 'active' : ''} onClick={() => setSelected(category.slug)}>{category.shortName} <span>{articles.filter((article) => article.category === category.slug).length}</span></button>)}
          </div>
        </div>
        <div className="blog-results-meta"><span><BookOpen size={15} /> Redaktionelle Beiträge</span><span>{shown.length + (selected === 'alle' ? 1 : 0)} Artikel gesamt</span></div>
        <div className="blog-grid">{shown.map((article) => <EditorialCard article={article} compact key={article.slug} />)}</div>
      </div>
    </section>
    <FaqSection eyebrow="RATGEBER & BLOG" title="Du weißt noch nicht, wo du anfangen sollst?" description="Diese Antworten helfen dir bei der Orientierung auf TarifPilot." faqs={homeFaqs} compact />
  </>;
}

function normalize(text: string) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u'); }

function SearchPage() {
  const query = new URLSearchParams(window.location.search).get('q')?.trim() || '';
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const results = query ? articles.filter((article) => {
    const text = normalize([article.title, article.description, article.intro, getCategory(article.category).name, ...article.sections.map((section) => `${section.heading} ${section.paragraphs.join(' ')}`)].join(' '));
    return words.every((word) => text.includes(word));
  }) : [];
  return <><section className="inner-hero"><div className="container"><Breadcrumb items={[{ label: 'Suche' }]} /><PageIntro eyebrow="SCHNELL GEFUNDEN" title="Wonach suchst du?" description="Durchsuche unsere Ratgeber nach Themen und Antworten." /><div className="hub-search"><SearchForm compact initial={query} /></div></div></section><section className="section-space search-results"><div className="container"><span className="eyebrow">SUCHERGEBNISSE</span><h2>{query ? `${results.length} ${results.length === 1 ? 'Ergebnis' : 'Ergebnisse'} für „${query}“` : 'Gib einen Suchbegriff ein'}</h2>{query && results.length === 0 && <p>Leider haben wir nichts Passendes gefunden. Versuche es mit einem anderen Begriff oder entdecke alle Themen.</p>}{!query && <p>Zum Beispiel „Datenvolumen“, „Glasfaser“ oder „Strom“.</p>}{results.length > 0 ? <div className="hub-list">{results.map((article) => <ArticleRow key={article.slug} article={article} />)}</div> : <a className="text-link" href={linkTo('ratgeber')}>Alle Ratgeber ansehen <ArrowRight size={16} /></a>}</div></section></>;
}

function ComparisonSlot({ category, priority }: { category: Category; priority: string }) {
  const priorityAdvice: Record<string, string> = {
    'Ein gutes Preis-Leistungs-Verhältnis': 'Vergleiche nur Leistungen, die du tatsächlich brauchst, und rechne alle Kosten über denselben Zeitraum.',
    'Flexibilität und kurze Bindung': 'Prüfe Mindestlaufzeit, Kündigungsfrist und die Möglichkeiten für einen späteren Wechsel.',
    'Passende Leistung für meinen Alltag': 'Notiere deine typische Nutzung und prüfe, ob die enthaltenen Leistungen dazu passen.',
    'Planbare und transparente Kosten': 'Achte auf Einmalkosten, Preisänderungen und den Betrag nach einer möglichen Rabattphase.',
  };
  return <div className="comparison-result" aria-live="polite"><div className="result-heading"><CheckCircle2 size={23} /><div><span className="eyebrow">DEINE CHECKLISTE</span><h2>Gut vorbereitet für {category.shortName}</h2></div></div><p>Dein Schwerpunkt: <strong>{priority}</strong>. Nimm diese Punkte in deinen Vergleich mit:</p><ul>{category.criteria.map(([name, detail]) => <li key={name}><Check size={17} /><span><strong>{name}:</strong> {detail}.</span></li>)}<li><Check size={17} /><span><strong>Dein Schwerpunkt:</strong> {priorityAdvice[priority]}</span></li></ul><div className="comparison-disclosure"><strong>Wichtig zu wissen</strong><p>TarifPilot zeigt derzeit keine aktuellen Anbieterangebote oder Live-Preise. Diese Checkliste ist eine redaktionelle Orientierung und kein Tarifrechner. Prüfe konkrete Konditionen direkt beim Anbieter.</p></div><a className="text-link" href={categoryLink(category)}>Passende Ratgeber entdecken <ArrowRight size={17} /></a></div>;
}

function ComparisonPage() {
  const [category, setCategory] = useState(categories[0].slug);
  const [priority, setPriority] = useState('Ein gutes Preis-Leistungs-Verhältnis');
  const [result, setResult] = useState<ComparisonRequest | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setResult({ categorySlug: category, priority }); }
  return <>
    <section className="inner-hero comparison-hero"><div className="container"><Breadcrumb items={[{ label: 'Tarifvergleich' }]} /><PageIntro eyebrow="TARIFVERGLEICH" title="Tarife vergleichen. Unterschiede verstehen." description="Ein aufgeräumter Vergleich mit klaren Kriterien: Wähle eine Kategorie, filtere die Musterangebote und stelle bis zu drei Tarife direkt gegenüber." /><div className="hero-trust comparison-hero-trust"><span><Check size={14} /> Klar gekennzeichnete Beispieldaten</span><span><Check size={14} /> Preis, Leistung und Laufzeit</span><span><Check size={14} /> Ohne versteckte Anbieterempfehlung</span></div></div></section>
    <section className="comparison-main-section"><div className="container"><ComparisonExperience linkTo={linkTo} /></div></section>
    <section className="comparison-checklist-section"><div className="container">
      <div className="checklist-heading"><span className="eyebrow">VOR DEM VERGLEICH</span><h2>Deine persönliche Vergleichs-Checkliste</h2><p>Ergänzend zum Mustervergleich kannst du deinen wichtigsten Schwerpunkt festhalten.</p></div>
      <div className="comparison-layout"><div><form className="comparison-form" onSubmit={submit}><label htmlFor="comparison-category">1. Was möchtest du vergleichen?</label><select id="comparison-category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select><label htmlFor="comparison-priority">2. Was ist dir besonders wichtig?</label><select id="comparison-priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option>Ein gutes Preis-Leistungs-Verhältnis</option><option>Flexibilität und kurze Bindung</option><option>Passende Leistung für meinen Alltag</option><option>Planbare und transparente Kosten</option></select><button className="primary-button" type="submit">Meine Checkliste anzeigen <ArrowRight size={17} /></button></form></div><div>{result ? <ComparisonSlot category={getCategory(result.categorySlug)} priority={result.priority} /> : <div className="comparison-empty"><span><FileSearch size={28} /></span><h2>Dein nächster Schritt</h2><p>Deine persönliche Checkliste erscheint hier. Sie hilft dir, Angebote anhand deiner Bedürfnisse zu prüfen.</p><p className="small-note">Die Checkliste ist eine redaktionelle Orientierung und kein Tarifrechner.</p></div>}</div></div>
    </div></section>
    <FaqSection eyebrow="HÄUFIGE FRAGEN" title="Rund um den Tarifvergleich" description="Transparent erklärt, was die Tabelle kann und was noch fehlt." faqs={comparisonFaqs} compact />
  </>;
}

function StandardPage({ path, title, eyebrow = 'TARIFPILOT', children }: { path: string; title: string; eyebrow?: string; children: ReactNode }) {
  return <><section className="inner-hero inner-hero-small"><div className="container"><Breadcrumb items={[{ label: title }]} /><PageIntro eyebrow={eyebrow} title={title} description={pageMetadata[path]?.description || ''} /></div></section><div className="container standard-layout"><article className="standard-content">{children}</article><aside className="standard-aside"><span className="aside-icon"><ShieldCheck size={23} /></span><h2>Gut zu wissen</h2><p>Transparenz und verständliche Informationen stehen bei TarifPilot im Mittelpunkt.</p><a className="text-link" href={linkTo('vergleichsmethoden')}>So vergleichen wir <ArrowRight size={16} /></a></aside></div></>;
}

function PublicationNotice() { return <div className="publication-notice"><strong>Wichtig vor der Veröffentlichung</strong><p>Bitte ergänze die gekennzeichneten Angaben des tatsächlichen Betreibers und lasse sie rechtlich prüfen. Die Anforderungen hängen von der konkreten Betreiberkonstellation ab.</p></div>; }

function CookieSettings() {
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);
  function save() { try { localStorage.setItem('tarifpilot-cookie-choice', 'essential'); setSaved(true); setCleared(false); } catch { setSaved(false); setCleared(true); } }
  function reset() { try { localStorage.removeItem('tarifpilot-cookie-choice'); } catch { /* Storage can be disabled in the browser. */ } setSaved(false); setCleared(true); }
  return <><h2>Deine Einstellungen</h2><p>TarifPilot verwendet derzeit keine Analyse-, Marketing- oder Werbe-Cookies und lädt keine externen Trackingdienste. Schriftarten und Bilder werden zusammen mit der Website ausgeliefert.</p><div className="cookie-option"><div><strong>Notwendige Speicherung</strong><p>Wenn du speicherst, wird deine Auswahl lokal im Browser unter „tarifpilot-cookie-choice“ abgelegt. Diese Einstellung dient ausschließlich der Funktion dieser Seite.</p></div><span>Immer aktiv</span></div><div className="button-row"><button className="primary-button" onClick={save}>Einstellung speichern <Check size={17} /></button><button className="secondary-button" onClick={reset}>Gespeicherte Auswahl löschen</button></div><p className="save-message" role="status">{saved ? 'Deine Einstellung wurde in diesem Browser gespeichert.' : cleared ? 'Es ist keine gespeicherte Auswahl vorhanden oder der Browser blockiert lokalen Speicher.' : ''}</p><p>Sollten künftig einwilligungspflichtige Dienste hinzukommen, werden diese erst nach einer entsprechenden Auswahl aktiviert. Weitere Informationen findest du in der <a href={linkTo('datenschutz')}>Datenschutzerklärung</a>.</p></>;
}

function InfoPage({ path }: { path: string }) {
  switch (path) {
    case 'ueber-uns': return <StandardPage path={path} title="Über TarifPilot" eyebrow="SCHÖN, DASS DU DA BIST"><p className="standard-lead">Tarife sollten kein Rätsel sein. TarifPilot hilft dir, die richtigen Fragen zu stellen und Angebote besser einzuordnen.</p><h2>Weniger Kleingedrucktes. Mehr Klarheit.</h2><p>Mobilfunk, Internet, Streaming und Energie begleiten uns jeden Tag. Trotzdem sind Vertragsdetails, technische Begriffe und wechselnde Bedingungen oft schwer zu überblicken. Genau hier setzt TarifPilot an: mit verständlichen Erklärungen und praktischen Entscheidungshilfen.</p><h2>Was du bei uns findest</h2><p>Unsere Ratgeber erklären Grundlagen, zeigen wichtige Vergleichskriterien und helfen dir, deinen eigenen Bedarf zu erkennen. Wir nennen keine erfundenen Preise oder vermeintlich aktuellen Angebote. Derzeit sind keine Live-Vergleichsrechner integriert.</p><h2>Unser Anspruch</h2><p>Wir möchten transparent arbeiten, Werbung klar kennzeichnen und redaktionelle Inhalte nicht nach einer möglichen Provision ausrichten. Wie wir dabei vorgehen, erfährst du in unseren <a href={linkTo('redaktionelle-richtlinien')}>redaktionellen Richtlinien</a> und <a href={linkTo('vergleichsmethoden')}>Vergleichsmethoden</a>.</p><a className="primary-button inline-button" href={linkTo('ratgeber')}>Ratgeber entdecken <ArrowRight size={17} /></a></StandardPage>;
    case 'kontakt': return <StandardPage path={path} title="Kontakt" eyebrow="KONTAKT ZUR REDAKTION"><p className="standard-lead">Fragen, Hinweise oder eine Korrektur zu einem unserer Ratgeber? Rückmeldungen helfen dabei, TarifPilot besser zu machen.</p><PublicationNotice /><h2>Kontakt zur Redaktion</h2><p>E-Mail: <strong>[E-Mail-Adresse des Betreibers vor Veröffentlichung ergänzen]</strong></p><p>Die Kontaktadresse muss vom Betreiber eingerichtet und hier sowie im Impressum und in der Datenschutzerklärung ergänzt werden. Diese statische Website versendet keine Nachrichten und enthält bewusst kein nicht funktionierendes Kontaktformular.</p><p>Informationen zum verantwortlichen Anbieter findest du im <a href={linkTo('impressum')}>Impressum</a>.</p></StandardPage>;
    case 'impressum': return <StandardPage path={path} title="Impressum" eyebrow="RECHTLICHE INFORMATIONEN"><PublicationNotice /><h2>Angaben gemäß § 5 DDG</h2><p><strong>[Vollständiger Name beziehungsweise Firma des tatsächlichen Betreibers]</strong><br />[Rechtsform, sofern zutreffend]<br />[Straße und Hausnummer]<br />[Postleitzahl und Ort]<br />Deutschland</p><h2>Kontakt</h2><p>E-Mail: [gültige E-Mail-Adresse ergänzen]<br />Telefon: [Angabe für eine schnelle unmittelbare Kontaktaufnahme prüfen und ergänzen]</p><h2>Vertretungsberechtigte Person</h2><p>[Bei juristischen Personen: Name der vertretungsberechtigten Person ergänzen; andernfalls diesen Abschnitt anpassen.]</p><h2>Registereintrag und Umsatzsteuer</h2><p>[Falls einschlägig: Registergericht und Registernummer sowie Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer ergänzen. Nicht zutreffende Angaben entfernen.]</p><h2>Verantwortlich für journalistisch-redaktionelle Inhalte</h2><p>[Sofern § 18 Abs. 2 MStV anwendbar ist: verantwortliche Person mit vollständigem Namen und ladungsfähiger Anschrift ergänzen.]</p><h2>Verbraucherstreitbeilegung</h2><p>[Ob und welche Angaben zur Teilnahme an einem Streitbeilegungsverfahren erforderlich sind, für den tatsächlichen Betreiber prüfen und ergänzen.]</p><p>Die Angaben auf dieser Seite sind vor Veröffentlichung auf Vollständigkeit und Aktualität zu prüfen.</p></StandardPage>;
    case 'datenschutz': return <StandardPage path={path} title="Datenschutz" eyebrow="DEINE DATEN"><PublicationNotice /><p className="standard-lead">Der Schutz deiner Daten ist uns wichtig. Diese Erklärung beschreibt die gegenwärtige statische Website und muss vor Veröffentlichung an den tatsächlichen Betrieb angepasst werden.</p><h2>1. Verantwortliche Stelle</h2><p>[Name beziehungsweise Firma, vollständige Anschrift und E-Mail-Adresse des datenschutzrechtlich Verantwortlichen ergänzen. Falls erforderlich, Kontaktdaten des Datenschutzbeauftragten ergänzen.]</p><h2>2. Hosting und Serverprotokolle</h2><p>Diese Website ist für das Hosting über GitHub Pages vorgesehen. Beim Aufruf verarbeitet der Hostinganbieter technisch erforderliche Verbindungsdaten, insbesondere die IP-Adresse, Zeitpunkt und angeforderte Ressource. Je nach Konfiguration können weitere technische Protokolldaten anfallen. Die Verarbeitung dient der Bereitstellung und Sicherheit der Website; als mögliche Rechtsgrundlage kommt Art. 6 Abs. 1 lit. f DSGVO in Betracht.</p><p>GitHub kann Daten auch außerhalb des Europäischen Wirtschaftsraums verarbeiten. Der Betreiber muss vor Veröffentlichung die tatsächlichen Verarbeitungen, Speicherfristen, geeigneten Garantien und gegebenenfalls erforderliche Vereinbarungen mit dem Anbieter prüfen und diese Erklärung ergänzen. Weitere Informationen: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub-Datenschutzerklärung <ExternalLink size={14} /></a>.</p><h2>3. Lokale Speicherung, Cookies und Suche</h2><p>Die Website bindet derzeit keine Analyse-, Marketing- oder Affiliate-Trackingdienste ein. Wenn du die Cookie-Einstellung speicherst, wird die Auswahl als technisch genutzter Eintrag im lokalen Speicher deines Browsers abgelegt. Du kannst sie in den <a href={linkTo('cookie-einstellungen')}>Cookie-Einstellungen</a> oder über deinen Browser löschen.</p><p>Die Artikelsuche wird im Browser ausgeführt. Der Suchbegriff erscheint in der URL und kann daher in technischen Zugriffsprotokollen des Hostinganbieters enthalten sein. Gib bitte keine sensiblen personenbezogenen Daten in die Suche ein.</p><h2>4. Kontaktaufnahme</h2><p>Wenn du nach Einrichtung der Kontaktadresse eine Nachricht sendest, verarbeitet der Betreiber deine Angaben zur Bearbeitung deiner Anfrage. Rechtsgrundlage und Speicherdauer sind abhängig vom konkreten Anliegen und müssen durch den Betreiber vor Veröffentlichung ergänzt werden. Ein Kontaktformular ist derzeit nicht vorhanden.</p><h2>5. Externe Links</h2><p>Beim Anklicken externer Links verlässt du TarifPilot. Für die anschließende Datenverarbeitung gelten die Datenschutzhinweise der jeweiligen Zielseite.</p><h2>6. Deine Rechte</h2><p>Je nach gesetzlichen Voraussetzungen hast du Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Außerdem kannst du dich bei einer Datenschutzaufsichtsbehörde beschweren. Wende dich zur Ausübung deiner Rechte an die oben zu ergänzende verantwortliche Stelle.</p><h2>7. Änderungen</h2><p>Bei neuen Diensten, Vergleichsrechnern, Werbung oder einem anderen Hosting muss diese Erklärung vor deren Einsatz überprüft und aktualisiert werden.</p></StandardPage>;
    case 'cookie-einstellungen': return <StandardPage path={path} title="Cookie-Einstellungen" eyebrow="DEINE PRIVATSPHÄRE"><CookieSettings /></StandardPage>;
    case 'affiliate-hinweis': return <StandardPage path={path} title="Affiliate-Hinweis" eyebrow="TRANSPARENZ"><p className="standard-lead">Gute Orientierung beginnt mit Transparenz. Deshalb erklären wir, wie sich TarifPilot künftig finanzieren könnte.</p><h2>Was sind Affiliate-Links?</h2><p>Ein Affiliate-Link ist ein speziell gekennzeichneter Verweis auf ein Angebot. Wenn über einen solchen Link eine qualifizierte Handlung oder ein Abschluss erfolgt, kann der Websitebetreiber eine Vergütung erhalten. Für dich entsteht dadurch nicht automatisch ein zusätzlicher Preis; die konkreten Bedingungen hängen vom Angebot ab.</p><h2>Der aktuelle Stand</h2><p>Derzeit sind auf TarifPilot keine Affiliate-Trackinglinks, Werbebanner oder provisionsbasierten Tarifrechner eingebunden. Es werden keine bestehenden Partnerschaften oder Zulassungen bei Werbepartnern behauptet.</p><h2>Unsere redaktionelle Trennung</h2><p>Sollten künftig Affiliate-Links oder Vergleichsrechner hinzukommen, werden kommerzielle Verweise transparent gekennzeichnet. Eine mögliche Vergütung soll weder redaktionelle Aussagen noch die Auswahl sachlicher Vergleichskriterien bestimmen.</p><p>Mehr dazu erfährst du in unseren <a href={linkTo('redaktionelle-richtlinien')}>redaktionellen Richtlinien</a> und <a href={linkTo('vergleichsmethoden')}>Vergleichsmethoden</a>.</p></StandardPage>;
    case 'redaktionelle-richtlinien': return <StandardPage path={path} title="Redaktionelle Richtlinien" eyebrow="UNSER ANSPRUCH"><p className="standard-lead">Unsere Inhalte sollen dir helfen, selbst eine informierte Entscheidung zu treffen. Dafür gelten bei TarifPilot klare Grundsätze.</p><h2>Verständlich und nützlich</h2><p>Wir erklären Fachbegriffe in alltäglicher Sprache und konzentrieren uns auf Fragen, die für Verbraucherinnen und Verbraucher relevant sind. Tabellen sollen Unterschiede verdeutlichen, nicht eine nicht vorhandene Marktabdeckung suggerieren.</p><h2>Sorgfalt statt unbelegter Versprechen</h2><p>Wir orientieren uns an nachvollziehbaren Informationen und verlinken, wo sinnvoll, weiterführende Stellen. Wir erfinden weder Preise noch Testsiegel, Bewertungen oder Anbieterangebote. Beispiele werden als solche kenntlich gemacht.</p><h2>Redaktion und Werbung trennen</h2><p>Redaktionelle Inhalte werden nach ihrem Nutzen und nicht nach möglichen Provisionen gestaltet. Sollten künftig kommerzielle Links oder Platzierungen hinzukommen, werden sie gekennzeichnet. Aktuell sind keine solchen Integrationen aktiv.</p><h2>Hinweise und Korrekturen</h2><p>Informationen und Vertragsbedingungen können sich ändern. Der Betreiber sollte Inhalte regelmäßig überprüfen und sachliche Fehler korrigieren. Hinweise können nach Einrichtung der <a href={linkTo('kontakt')}>Kontaktadresse</a> gemeldet werden.</p></StandardPage>;
    case 'vergleichsmethoden': return <StandardPage path={path} title="Vergleichsmethoden" eyebrow="SO ARBEITEN WIR"><p className="standard-lead">Ein hilfreicher Vergleich beginnt nicht mit einem angeblichen Sieger, sondern mit nachvollziehbaren Kriterien.</p><h2>Was TarifPilot heute vergleicht</h2><p>Unsere Ratgeber vergleichen Eigenschaften und Vertragsmodelle, zum Beispiel DSL und Glasfaser oder Prepaid und Laufzeitvertrag. Tabellen sind redaktionelle Orientierungshilfen. Sie enthalten keine aktuellen Providerdaten, Preise, Bewertungen oder Ranglisten.</p><h2>Welche Kriterien wichtig sind</h2><p>Je nach Thema betrachten wir Verfügbarkeit, Leistung, tatsächlichen Bedarf, Gesamtkosten, Laufzeit und Kündigung. Bei Energie kommen insbesondere Jahresverbrauch, Grundpreis, Arbeitspreis und Preisgarantie hinzu. Die persönliche Gewichtung kann unterschiedlich ausfallen.</p><h2>Grenzen unserer Informationen</h2><p>TarifPilot prüft nicht automatisch die Verfügbarkeit an deiner Adresse und zeigt derzeit keine live verfügbaren Tarife. Konkrete Leistungen und Preise musst du vor Vertragsabschluss direkt anhand der aktuellen Anbieterunterlagen prüfen.</p><h2>Falls später ein Tarifrechner hinzukommt</h2><p>Vor einer Integration müssen Datenquelle, Marktabdeckung, Aktualität, Sortierung, Vergütung und gegebenenfalls Tracking transparent erklärt werden. Eine Platzierung oder Provision darf nicht als unabhängiges Testergebnis ausgegeben werden.</p><a className="primary-button inline-button" href={linkTo('vergleich')}>Vergleich vorbereiten <ArrowRight size={17} /></a></StandardPage>;
    case 'sitemap': return <StandardPage path={path} title="Sitemap" eyebrow="ALLES AUF EINEN BLICK"><p className="standard-lead">Alle Themen, Ratgeber und Informationsseiten von TarifPilot.</p><h2>Start und Orientierung</h2><ul className="sitemap-list"><li><a href={linkTo()}>Startseite</a></li><li><a href={linkTo('ratgeber')}>Alle Ratgeber</a></li><li><a href={linkTo('vergleich')}>Vergleich vorbereiten</a></li><li><a href={linkTo('suche')}>Suche</a></li></ul>{categories.map((category) => <div key={category.slug}><h2><a href={categoryLink(category)}>{category.name}</a></h2><ul className="sitemap-list">{articles.filter((article) => article.category === category.slug).map((article) => <li key={article.slug}><a href={articleLink(article)}>{article.title}</a></li>)}</ul></div>)}<h2>Über TarifPilot und Rechtliches</h2><ul className="sitemap-list">{['ueber-uns', 'kontakt', 'impressum', 'datenschutz', 'cookie-einstellungen', 'affiliate-hinweis', 'redaktionelle-richtlinien', 'vergleichsmethoden'].map((key) => <li key={key}><a href={linkTo(key)}>{pageMetadata[key].title.replace(' | TarifPilot', '')}</a></li>)}</ul></StandardPage>;
    default: return <NotFoundPage />;
  }
}

function NotFoundPage() { return <section className="not-found"><div className="container"><span className="eyebrow">SEITE NICHT GEFUNDEN</span><div className="not-found-number">404</div><h1>Dieser Weg führt leider ins Leere.</h1><p>Die gesuchte Seite gibt es nicht oder sie wurde verschoben. Auf der Startseite findest du wieder Orientierung.</p><a className="primary-button inline-button" href={linkTo()}><ArrowLeft size={17} /> Zur Startseite</a></div></section>; }

function currentPath() {
  const pathname = decodeURIComponent(window.location.pathname);
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return (pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.replace(/^\/+/, '')).replace(/^\/+|\/+$/g, '').replace(/(^|\/)index\.html$/, '');
}

function updateMetadata(path: string) {
  let metadata = pageMetadata[path];
  if (path.startsWith('themen/')) {
    const category = categories.find((item) => item.slug === path.slice(7));
    if (category) metadata = { title: `${category.name}: Ratgeber & Tipps | TarifPilot`, description: category.intro };
  } else if (path.startsWith('ratgeber/')) {
    const article = articles.find((item) => item.slug === path.slice(9));
    if (article) metadata = { title: `${article.title} | TarifPilot`, description: article.description };
  }
  const exists = Boolean(metadata);
  metadata ||= { title: 'Seite nicht gefunden | TarifPilot', description: 'Die gesuchte Seite wurde nicht gefunden. Entdecke die Ratgeber von TarifPilot.' };
  document.title = metadata.title;
  const canonical = new URL(linkTo(path), window.location.origin).href;
  const values: [string, string, string][] = [
    ['name', 'description', metadata.description], ['property', 'og:title', metadata.title],
    ['property', 'og:description', metadata.description], ['property', 'og:url', canonical],
    ['property', 'og:image', new URL(asset('images/og-tarifpilot.jpg'), window.location.origin).href],
    ['name', 'twitter:image', new URL(asset('images/og-tarifpilot.jpg'), window.location.origin).href],
    ['name', 'robots', exists && path !== 'suche' ? 'index,follow' : 'noindex,follow'],
  ];
  values.forEach(([attribute, key, value]) => { let element = document.head.querySelector(`meta[${attribute}="${key}"]`); if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); } element.setAttribute('content', value); });
  let canonicalElement = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalElement) { canonicalElement = document.createElement('link'); canonicalElement.setAttribute('rel', 'canonical'); document.head.appendChild(canonicalElement); }
  canonicalElement.setAttribute('href', canonical);
}

export default function App() {
  const path = currentPath();
  useEffect(() => { updateMetadata(path); }, [path]);
  let page: ReactNode;
  if (!path) page = <HomePage />;
  else if (path === 'ratgeber') page = <GuideHub />;
  else if (path === 'suche') page = <SearchPage />;
  else if (path === 'vergleich') page = <ComparisonPage />;
  else if (path.startsWith('themen/')) { const category = categories.find((item) => item.slug === path.slice(7)); page = category ? <CategoryPage category={category} /> : <NotFoundPage />; }
  else if (path.startsWith('ratgeber/')) { const article = articles.find((item) => item.slug === path.slice(9)); page = article ? <ArticlePage article={article} /> : <NotFoundPage />; }
  else page = <InfoPage path={path} />;
  return <><Header /><main id="hauptinhalt">{page}</main><Footer /></>;
}