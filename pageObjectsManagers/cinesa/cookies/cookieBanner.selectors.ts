export interface CookieBannerSelectors {
  acceptButton: string;
  acceptButtonProd?: string; // Selector específico para producción
  acceptButtonPreprod?: string; // Selector específico para preprod
  rejectButton: string;
  settingsButton: string;
  banner: string;
  bannerProd?: string;
  bannerPreprod?: string;
  overlay: string;
  overlayProd?: string;
  overlayPreprod?: string;
  settingsModal: string;
  closeButton: string;
  consentSdk: string;
  consentSdkProd?: string;
  consentSdkPreprod?: string;
}

export const cookieBannerSelectors: CookieBannerSelectors = {
  acceptButton: '#onetrust-accept-btn-handler',
  acceptButtonProd: '#onetrust-accept-btn-handler', // Producción
  acceptButtonPreprod: '#onetrust-accept-btn-handler', // Preprod (por ahora igual)
  rejectButton: '#onetrust-reject-all-handler',
  settingsButton: '#onetrust-pc-btn-handler',
  banner: '#onetrust-banner-sdk',
  bannerProd: '#onetrust-banner-sdk',
  bannerPreprod: '#onetrust-banner-sdk',
  overlay: '.onetrust-pc-dark-filter',
  overlayProd: '.onetrust-pc-dark-filter',
  overlayPreprod: '.onetrust-pc-dark-filter',
  settingsModal: '#onetrust-pc-sdk',
  closeButton: '.onetrust-close-btn-handler',
  consentSdk: '#onetrust-consent-sdk',
  consentSdkProd: '#onetrust-consent-sdk',
  consentSdkPreprod: '#onetrust-consent-sdk',
};
