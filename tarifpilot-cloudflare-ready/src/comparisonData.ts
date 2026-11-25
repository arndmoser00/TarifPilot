export type ComparisonCategoryId = 'mobilfunk' | 'internet' | 'streaming' | 'energie';

export type ComparisonCategory = {
  id: ComparisonCategoryId;
  label: string;
  shortLabel: string;
  icon: string;
  priceNote: string;
  metricLabels: [string, string];
  guidePath: string;
};

export type SampleOffer = {
  id: string;
  category: ComparisonCategoryId;
  provider: string;
  product: string;
  badge?: string;
  monthlyPrice: number;
  priceDetail: string;
  metrics: [string, string];
  performanceValue: number;
  contract: string;
  conditions: string;
  features: string[];
};

/**
 * These are deliberately fictional demonstration records. They allow the static
 * comparison interface to be tested without presenting unverified market prices
 * or implying a provider partnership. Replace only with sourced, dated data.
 */
export const comparisonCategories: ComparisonCategory[] = [
  {
    id: 'mobilfunk', label: 'Mobilfunk', shortLabel: 'Mobilfunk', icon: 'smartphone',
    priceNote: 'Monatspreis inkl. MwSt., Musterwert',
    metricLabels: ['Datenvolumen', 'Netz & Tempo'], guidePath: 'mobilfunk',
  },
  {
    id: 'internet', label: 'Internet & DSL', shortLabel: 'Internet', icon: 'wifi',
    priceNote: 'Monatspreis inkl. MwSt., Musterwert',
    metricLabels: ['Download', 'Upload'], guidePath: 'internet-dsl',
  },
  {
    id: 'streaming', label: 'Streaming & TV', shortLabel: 'Streaming', icon: 'tv',
    priceNote: 'Monatspreis inkl. MwSt., Musterwert',
    metricLabels: ['Gleichzeitige Streams', 'Qualität'], guidePath: 'streaming-tv',
  },
  {
    id: 'energie', label: 'Strom & Gas', shortLabel: 'Energie', icon: 'zap',
    priceNote: 'Beispielkosten pro Monat bei 2.000 kWh/Jahr',
    metricLabels: ['Arbeitspreis', 'Grundpreis'], guidePath: 'strom-gas',
  },
];

export const sampleOffers: SampleOffer[] = [
  {
    id: 'mf-smart-s', category: 'mobilfunk', provider: 'MusterNetz', product: 'Smart S',
    monthlyPrice: 999, priceDetail: '9,99 € / Monat', metrics: ['8 GB', 'LTE bis 50 Mbit/s'],
    performanceValue: 8, contract: '24 Monate', conditions: 'Nach Inklusivvolumen wird gedrosselt',
    features: ['Allnet-Flat', '5G nicht enthalten', 'Digitale Rechnung'],
  },
  {
    id: 'mf-flex-20', category: 'mobilfunk', provider: 'MusterFunk', product: 'Flex 20',
    badge: 'Flexibel', monthlyPrice: 1499, priceDetail: '14,99 € / Monat', metrics: ['20 GB', '5G bis 100 Mbit/s'],
    performanceValue: 20, contract: 'Monatlich', conditions: 'Jederzeit zum Monatsende kündbar',
    features: ['Allnet-Flat', '5G inklusive', 'Hotspot-Nutzung prüfen'],
  },
  {
    id: 'mf-unlimited', category: 'mobilfunk', provider: 'MusterConnect', product: 'Unlimited Komfort',
    monthlyPrice: 2999, priceDetail: '29,99 € / Monat', metrics: ['Unbegrenzt', '5G bis 300 Mbit/s'],
    performanceValue: 100, contract: '24 Monate', conditions: 'Fair-Use-Regeln in den Vertragsdetails prüfen',
    features: ['Allnet-Flat', 'Unbegrenztes Datenvolumen', 'Hotspot-Nutzung prüfen'],
  },
  {
    id: 'in-dsl-100', category: 'internet', provider: 'MusterNetz', product: 'DSL 100',
    monthlyPrice: 2499, priceDetail: '24,99 € / Monat', metrics: ['100 Mbit/s', '40 Mbit/s'],
    performanceValue: 100, contract: '24 Monate', conditions: 'Router optional; Bereitstellung möglich',
    features: ['DSL-Anschluss', 'WLAN-Router optional', 'Festnetznummer möglich'],
  },
  {
    id: 'in-fiber-300', category: 'internet', provider: 'MusterFiber', product: 'Glasfaser 300',
    badge: 'Glasfaser', monthlyPrice: 3499, priceDetail: '34,99 € / Monat', metrics: ['300 Mbit/s', '150 Mbit/s'],
    performanceValue: 300, contract: '24 Monate', conditions: 'Glasfaser-Hausanschluss erforderlich',
    features: ['FTTH-Anschluss', 'Router optional', 'Technikertermin möglich'],
  },
  {
    id: 'in-cable-500', category: 'internet', provider: 'MusterKabel', product: 'Kabel 500',
    monthlyPrice: 3999, priceDetail: '39,99 € / Monat', metrics: ['500 Mbit/s', '50 Mbit/s'],
    performanceValue: 500, contract: '24 Monate', conditions: 'Geeigneter Kabelanschluss erforderlich',
    features: ['Kabelanschluss', 'WLAN-Router optional', 'Verfügbarkeit vor Ort prüfen'],
  },
  {
    id: 'st-basis', category: 'streaming', provider: 'MusterStream', product: 'Basis',
    monthlyPrice: 599, priceDetail: '5,99 € / Monat', metrics: ['1 Stream', 'HD, mit Werbung'],
    performanceValue: 1, contract: 'Monatlich', conditions: 'Inhalte und Werbeumfang vor Abschluss prüfen',
    features: ['Monatlich kündbar', 'HD-Qualität', 'Werbung möglich'],
  },
  {
    id: 'st-plus', category: 'streaming', provider: 'MusterStream', product: 'Plus',
    badge: 'HD', monthlyPrice: 1299, priceDetail: '12,99 € / Monat', metrics: ['2 Streams', 'Full HD, ohne Werbung'],
    performanceValue: 2, contract: 'Monatlich', conditions: 'Verfügbare Inhalte können sich ändern',
    features: ['Monatlich kündbar', 'Full-HD-Qualität', 'Zwei parallele Streams'],
  },
  {
    id: 'st-familie', category: 'streaming', provider: 'MusterStream', product: 'Familie',
    monthlyPrice: 1999, priceDetail: '19,99 € / Monat', metrics: ['4 Streams', '4K, ohne Werbung'],
    performanceValue: 4, contract: '12 Monate', conditions: '4K nicht auf jedem Gerät möglich',
    features: ['Vier parallele Streams', '4K-Qualität', 'Jährliche Zahlung prüfen'],
  },
  {
    id: 'en-fix-2000', category: 'energie', provider: 'MusterStrom', product: 'Fix 2000',
    badge: 'Fester Preis', monthlyPrice: 5800, priceDetail: '58,00 € / Monat*', metrics: ['28,0 ct/kWh', '12,90 € / Monat'],
    performanceValue: 28, contract: '12 Monate', conditions: 'Preisgarantie nur für den im Vertrag genannten Umfang',
    features: ['Beispiel für 2.000 kWh', '12 Monate Preisgarantie', 'Monatlicher Abschlag'],
  },
  {
    id: 'en-flex', category: 'energie', provider: 'MusterStrom', product: 'Flex',
    monthlyPrice: 5200, priceDetail: '52,00 € / Monat*', metrics: ['26,5 ct/kWh', '9,90 € / Monat'],
    performanceValue: 26.5, contract: 'Monatlich', conditions: 'Variabler Arbeitspreis; Preisänderungen möglich',
    features: ['Beispiel für 2.000 kWh', 'Flexible Laufzeit', 'Monatlicher Abschlag'],
  },
  {
    id: 'en-oeko-2000', category: 'energie', provider: 'MusterGrün', product: 'Öko 2000',
    monthlyPrice: 6400, priceDetail: '64,00 € / Monat*', metrics: ['30,0 ct/kWh', '13,50 € / Monat'],
    performanceValue: 30, contract: '24 Monate', conditions: 'Herkunftsnachweise und Garantieumfang im Vertrag prüfen',
    features: ['Beispiel für 2.000 kWh', 'Erneuerbare Energien', '24 Monate Preisgarantie'],
  },
];
