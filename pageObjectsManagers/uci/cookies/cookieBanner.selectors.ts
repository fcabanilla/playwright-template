export interface CookieBannerSelectors {
  acceptButton: string;
  rejectButton: string;
  settingsButton: string;
  banner: string;
}

export const cookieBannerSelectors: CookieBannerSelectors = {
  // Selectores actualizados basados en la estructura real de UCI Cinemas
  acceptButton: 'button:has-text("Accetta tutti i cookie")',
  rejectButton: '#onetrust-reject-all-handler, .cookie-reject',
  settingsButton: '#onetrust-pc-btn-handler, .cookie-settings',
  banner: '.onetrust-pc-dark-filter, #onetrust-banner-sdk',
};
