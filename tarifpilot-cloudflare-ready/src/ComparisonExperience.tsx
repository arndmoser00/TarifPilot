import { useState } from 'react';
import {
  ArrowRight, Check, ChevronDown, GitCompareArrows, RotateCcw,
  ShieldCheck, Smartphone, Tv2, Wifi, Zap, type LucideIcon,
} from 'lucide-react';
import {
  comparisonCategories, sampleOffers,
  type ComparisonCategoryId, type SampleOffer,
} from './comparisonData';

const categoryIcons: Record<string, LucideIcon> = {
  smartphone: Smartphone, wifi: Wifi, tv: Tv2, zap: Zap,
};

type Props = {
  linkTo: (path?: string) => string;
};

export default function ComparisonExperience({ linkTo }: Props) {
  const [categoryId, setCategoryId] = useState<ComparisonCategoryId>('mobilfunk');
  const [sort, setSort] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
  const [flexibleOnly, setFlexibleOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const category = comparisonCategories.find((item) => item.id === categoryId)!;
  const offers = sampleOffers.filter((offer) => offer.category === categoryId);
  const visibleOffers = offers
    .filter((offer) => !flexibleOnly || offer.contract.toLowerCase() === 'monatlich')
    .sort((a, b) => sort === 'price-asc' ? a.monthlyPrice - b.monthlyPrice : sort === 'price-desc' ? b.monthlyPrice - a.monthlyPrice : 0);
  const selectedOffers = selected.map((id) => sampleOffers.find((offer) => offer.id === id)).filter((offer): offer is SampleOffer => Boolean(offer));

  function changeCategory(id: ComparisonCategoryId) {
    setCategoryId(id);
    setSelected([]);
    setShowComparison(false);
    setFlexibleOnly(false);
    setSort('recommended');
  }

  function toggleOffer(offer: SampleOffer) {
    setSelected((current) => {
      if (current.includes(offer.id)) return current.filter((id) => id !== offer.id);
      if (current.length >= 3) return current;
      return [...current, offer.id];
    });
    setShowComparison(false);
  }

  function resetFilters() {
    setFlexibleOnly(false);
    setSort('recommended');
    setSelected([]);
    setShowComparison(false);
  }

  return <div className="comparison-experience">
    <div className="comparison-app-head">
      <div>
        <span className="eyebrow">BEISPIELDATEN, KEINE LIVE-ANGEBOTE</span>
        <h2>Tarife Schritt für Schritt vergleichen.</h2>
        <p>Wähle ein Thema und vergleiche die Musterdatensätze. So siehst du bereits jetzt, welche Angaben für einen belastbaren Tarifvergleich nötig sind.</p>
      </div>
      <span className="sample-badge"><ShieldCheck size={16} /> Funktionsdemo</span>
    </div>

    <div className="comparison-disclaimer" role="note">
      <strong>Transparente Beispieldaten:</strong> Anbieter, Tarife und Preise in dieser Tabelle sind frei erfunden. Sie sind keine aktuellen Marktangebote und stellen keine Partnerschaft mit Anbietern dar. Reale Konditionen müssen vor einer Veröffentlichung aus offiziellen Quellen geprüft und mit Stand versehen werden.
    </div>

    <div className="comparison-tabs" role="tablist" aria-label="Tarifkategorie">
      {comparisonCategories.map((item) => {
        const Icon = categoryIcons[item.icon];
        return <button key={item.id} type="button" role="tab" aria-selected={categoryId === item.id} aria-controls="tariff-comparison-panel" id={`comparison-tab-${item.id}`} className={categoryId === item.id ? 'active' : ''} onClick={() => changeCategory(item.id)}>
          <Icon size={18} />{item.shortLabel}
        </button>;
      })}
    </div>

    <div className="comparison-controls" id="tariff-comparison-panel" role="tabpanel" aria-labelledby={`comparison-tab-${categoryId}`}>
      <div className="control-heading">
        <span className="comparison-category-label">{category.label}</span>
        <span>{visibleOffers.length} Musterangebote</span>
      </div>
      <div className="control-row">
        <label className="checkbox-control">
          <input type="checkbox" checked={flexibleOnly} onChange={(event) => setFlexibleOnly(event.target.checked)} />
          <span>Nur monatlich kündbar</span>
        </label>
        <label className="sort-control">
          <span className="sr-only">Sortierung</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Tarife sortieren">
            <option value="recommended">Empfohlene Reihenfolge</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
          </select>
          <ChevronDown size={15} aria-hidden="true" />
        </label>
        <button className="reset-filter" type="button" onClick={resetFilters}><RotateCcw size={14} /> Zurücksetzen</button>
      </div>

      {visibleOffers.length ? <>
        <div className="table-scroll comparison-table-scroll" tabIndex={0} role="region" aria-label="Tarifvergleichstabelle mit Beispieldaten, bei Bedarf horizontal scrollbar">
          <table className="comparison-table">
            <caption className="sr-only">Beispielhafter Tarifvergleich für {category.label}; alle Angaben sind Musterdaten.</caption>
            <thead><tr>
              <th scope="col" className="select-column"><span className="sr-only">Auswählen</span></th>
              <th scope="col">Anbieter &amp; Tarif</th>
              <th scope="col">{category.priceNote}</th>
              <th scope="col">{category.metricLabels[0]}</th>
              <th scope="col">{category.metricLabels[1]}</th>
              <th scope="col">Laufzeit</th>
              <th scope="col">Wichtige Bedingungen</th>
            </tr></thead>
            <tbody>{visibleOffers.map((offer) => <tr key={offer.id} className={selected.includes(offer.id) ? 'is-selected' : ''}>
              <td className="select-column"><label className="table-checkbox"><input type="checkbox" checked={selected.includes(offer.id)} onChange={() => toggleOffer(offer)} disabled={!selected.includes(offer.id) && selected.length >= 3} aria-label={`${offer.provider} ${offer.product} zum Vergleich auswählen`} /><span aria-hidden="true"><Check size={13} /></span></label></td>
              <td><span className="offer-provider"><span className="provider-initial" aria-hidden="true">{offer.provider.slice(0, 1)}</span><span><strong>{offer.provider}</strong><small>{offer.product}</small>{offer.badge && <em>{offer.badge}</em>}</span></span></td>
              <td><strong className="offer-price">{offer.priceDetail.replace(' / Monat', '')}</strong><small className="price-suffix"> / Monat</small></td>
              <td><strong>{offer.metrics[0]}</strong></td>
              <td>{offer.metrics[1]}</td>
              <td>{offer.contract}</td>
              <td className="conditions-cell">{offer.conditions}</td>
            </tr>)}</tbody>
          </table>
        </div>

        <div className="comparison-mobile-cards">{visibleOffers.map((offer) => <article key={offer.id} className={`comparison-mobile-card ${selected.includes(offer.id) ? 'is-selected' : ''}`}>
          <div className="mobile-card-head"><span className="offer-provider"><span className="provider-initial" aria-hidden="true">{offer.provider.slice(0, 1)}</span><span><strong>{offer.provider}</strong><small>{offer.product}</small></span></span><label className="table-checkbox"><input type="checkbox" checked={selected.includes(offer.id)} onChange={() => toggleOffer(offer)} disabled={!selected.includes(offer.id) && selected.length >= 3} aria-label={`${offer.provider} ${offer.product} zum Vergleich auswählen`} /><span aria-hidden="true"><Check size={13} /></span></label></div>
          <div className="mobile-card-price"><strong>{offer.priceDetail.replace(' / Monat', '')}</strong><small> / Monat</small><p>{offer.priceDetail.includes('*') ? 'Beispielrechnung 2.000 kWh/Jahr' : 'Musterpreis inkl. MwSt.'}</p></div>
          <dl><div><dt>{category.metricLabels[0]}</dt><dd>{offer.metrics[0]}</dd></div><div><dt>{category.metricLabels[1]}</dt><dd>{offer.metrics[1]}</dd></div><div><dt>Laufzeit</dt><dd>{offer.contract}</dd></div></dl>
          <p className="mobile-card-conditions">{offer.conditions}</p>
          <button type="button" className={`compare-toggle ${selected.includes(offer.id) ? 'selected' : ''}`} onClick={() => toggleOffer(offer)} disabled={!selected.includes(offer.id) && selected.length >= 3}>{selected.includes(offer.id) ? <><Check size={15} /> Ausgewählt</> : <><GitCompareArrows size={15} /> Zum Vergleich</>}</button>
        </article>)}</div>
      </> : <div className="no-filter-results"><p>Für diese Auswahl gibt es in den Musterdaten keine Treffer.</p><button type="button" onClick={resetFilters}>Filter zurücksetzen</button></div>}

      <p className="comparison-footnote">* Rechenbeispiel, kein Preis. Die Beispielrechnung dient nur der Veranschaulichung. Ein Tarif mit monatlich kündbarer Laufzeit ist nicht automatisch günstiger.</p>

      <div className="compare-toolbar">
        <div><GitCompareArrows size={20} /><span><strong>{selectedOffers.length} von 3</strong> ausgewählt</span></div>
        <button type="button" className="primary-button" disabled={selectedOffers.length < 2} onClick={() => setShowComparison(true)}>Auswahl vergleichen <ArrowRight size={16} /></button>
      </div>

      {showComparison && selectedOffers.length > 1 && <section className="selected-comparison" aria-live="polite" aria-labelledby="selected-comparison-title">
        <div className="selected-heading"><span><GitCompareArrows size={20} /></span><div><span className="eyebrow">DEINE AUSWAHL</span><h3 id="selected-comparison-title">Musterangebote im direkten Vergleich</h3></div></div>
        <div className="selected-compare-grid">{selectedOffers.map((offer) => <article key={offer.id}>
          <div className="offer-provider"><span className="provider-initial" aria-hidden="true">{offer.provider.slice(0, 1)}</span><span><strong>{offer.provider}</strong><small>{offer.product}</small></span></div>
          <p className="selected-price"><strong>{offer.priceDetail.replace(' / Monat', '')}</strong><small> / Monat</small></p>
          <dl><div><dt>{category.metricLabels[0]}</dt><dd>{offer.metrics[0]}</dd></div><div><dt>{category.metricLabels[1]}</dt><dd>{offer.metrics[1]}</dd></div><div><dt>Laufzeit</dt><dd>{offer.contract}</dd></div><div><dt>Bedingungen</dt><dd>{offer.conditions}</dd></div></dl>
          <ul>{offer.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
          <button type="button" onClick={() => toggleOffer(offer)}>Aus Auswahl entfernen</button>
        </article>)}</div>
        <p className="selected-note">Auch diese Gegenüberstellung verwendet ausschließlich Musterdaten und ist keine Empfehlung oder ein aktueller Anbietervergleich.</p>
      </section>}
    </div>

    <div className="comparison-guide-link">
      <div><span className="eyebrow">PASSENDE ORIENTIERUNG</span><p>Welche Kriterien hinter den Spalten stecken, erklären unsere Ratgeber.</p></div>
      <a className="text-link" href={linkTo(`themen/${category.guidePath}`)}>Ratgeber zu {category.shortLabel} <ArrowRight size={16} /></a>
    </div>
  </div>;
}
