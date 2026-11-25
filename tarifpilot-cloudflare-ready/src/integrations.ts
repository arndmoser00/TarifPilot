// Contracts for a future, explicitly enabled comparison or advertising integration.
// No provider, tracker, widget or network request is active in the current site.
export interface ComparisonRequest {
  categorySlug: string;
  priority: string;
}

export interface VerifiedOffer {
  id: string;
  providerName: string;
  productName: string;
  price: { amount: number; currency: 'EUR'; unit: 'month' | 'year' | 'kWh' };
  additionalCosts: string;
  contractTerms: string;
  sourceUrl: string;
  verifiedAt: string;
  affiliateLink?: AffiliateLink;
}

export interface AffiliateLink {
  url: string;
  disclosure: string;
  requiresConsent: boolean;
}

export interface AdvertisingBanner {
  imageUrl: string;
  alt: string;
  link: AffiliateLink;
}

export interface ComparisonIntegration {
  name: string;
  getVerifiedOffers?: (request: ComparisonRequest) => Promise<{
    offers: VerifiedOffer[];
    dataAsOf: string;
    coverageAndSorting: string;
  }>;
  widgetUrl?: string;
  banner?: AdvertisingBanner;
}