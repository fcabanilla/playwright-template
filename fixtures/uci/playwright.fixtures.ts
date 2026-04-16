import { test as base } from '@playwright/test';
import { Navbar } from '../../pageObjectsManagers/uci/navbar/navbar.page';
import { getUCIConfig, UCIEnvironment } from '../../config/environments';
import { CookieBanner } from '../../pageObjectsManagers/uci/cookies/cookieBanner.page';
import { PromoModal } from '../../pageObjectsManagers/uci/promoModal/promoModal.page';
import { Cinema } from '../../pageObjectsManagers/uci/cinemas/cinema.page';
import { CinemaDetail } from '../../pageObjectsManagers/uci/cinemas/cinemaDetail.page';
import { Films } from '../../pageObjectsManagers/uci/films/films.page';
import { FilmsAssertions } from '../../tests/uci/films/films.assertions';
import { NavbarAssertions } from '../../tests/uci/navbar/navbar.assertions';
import { CinemasAssertions } from '../../tests/uci/cinemas/cinemas.assertions';
import { WebActions } from '../../core/webactions/webActions';

type CustomFixtures = {
  navbar: Navbar;
  cookieBanner: CookieBanner;
  promoModal: PromoModal;
  cinema: Cinema;
  cinemaDetail: CinemaDetail;
  films: Films;
  filmsAssertions: FilmsAssertions;
  navbarAssertions: NavbarAssertions;
  cinemasAssertions: CinemasAssertions;
};

export const test = base.extend<CustomFixtures>({
  // Override context fixture to apply consent seeds when storageState is not available
  context: async ({ browser }, use) => {
    const env = (process.env.TEST_ENV as UCIEnvironment) || 'production';
    const config = getUCIConfig(env);

    // 1. Get native User Agent from the current browser
    const tempContext = await browser.newContext();
    const tempPage = await tempContext.newPage();
    const originalUA = await tempPage.evaluate(() => navigator.userAgent);
    await tempContext.close();

    const suffix = process.env.USER_AGENT_SUFFIX
      ? ` ${process.env.USER_AGENT_SUFFIX}`
      : '';
    const finalUserAgent = originalUA + suffix;

    const context = await browser.newContext({ userAgent: finalUserAgent });

    // Apply consent seeds if NO storageState is configured
    // This eliminates cookie banner interaction when storageState files don't exist
    const hasStorageState = context.storageState !== undefined;
    if (!hasStorageState) {
      const page = await context.newPage();
      const webActions = new WebActions(page);

      // Pre-seed consent cookies for baseUrl
      await webActions.applyConsentSeedsFor(config.baseUrl);

      await page.close();
      console.log(
        `✅ [Consent Seeds] Applied for ${config.baseUrl} (no storageState found)`
      );
    } else {
      console.log(`ℹ️  [Consent Seeds] Skipped - storageState already loaded`);
    }

    await use(context);
    await context.close();
  },

  navbar: async ({ page }, use) => {
    const env = (process.env.TEST_ENV as UCIEnvironment) || 'production';
    const config = getUCIConfig(env);
    const navbar = new Navbar(page, config.baseUrl);
    await use(navbar);
  },
  cookieBanner: async ({ page }, use) => {
    const webActions = new WebActions(page);
    const cookieBanner = new CookieBanner(webActions);
    await use(cookieBanner);
  },
  promoModal: async ({ page }, use) => {
    const promoModal = new PromoModal(page);
    await use(promoModal);
  },
  cinema: async ({ page }, use) => {
    const cinema = new Cinema(page);
    await use(cinema);
  },
  cinemaDetail: async ({ page }, use) => {
    const cinemaDetail = new CinemaDetail(page);
    await use(cinemaDetail);
  },
  films: async ({ page }, use) => {
    const films = new Films(page);
    await use(films);
  },
  filmsAssertions: async ({ films }, use) => {
    const filmsAssertions = new FilmsAssertions(films);
    await use(filmsAssertions);
  },
  navbarAssertions: async ({ page }, use) => {
    const navbarAssertions = new NavbarAssertions(page);
    await use(navbarAssertions);
  },
  cinemasAssertions: async ({ cinema, cinemaDetail }, use) => {
    const cinemasAssertions = new CinemasAssertions(cinema, cinemaDetail);
    await use(cinemasAssertions);
  },
});

export { expect } from '@playwright/test';
