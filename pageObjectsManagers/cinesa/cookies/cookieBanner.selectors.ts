export interface CookieBannerSelectors {
  acceptButton: string;
  rejectButton: string;
  settingsButton: string;
  banner: string;
  overlay: string;
  settingsModal: string;
  closeButton: string;
  consentSdk: string;
}

export const cookieBannerSelectors: CookieBannerSelectors = {
  acceptButton: '#onetrust-accept-btn-handler',
  rejectButton: '#onetrust-reject-all-handler',
  settingsButton: '#onetrust-pc-btn-handler',
  banner: '#onetrust-banner-sdk',
  overlay: '.onetrust-pc-dark-filter',
  settingsModal: '#onetrust-pc-sdk',
  closeButton: '.onetrust-close-btn-handler',
  consentSdk: '#onetrust-consent-sdk',
};
