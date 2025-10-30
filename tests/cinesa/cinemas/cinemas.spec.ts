import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';
import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import {
  assertCinemasRedirection,
  assertCinemaSchemaMatches,
} from './cinemas.assertions';

test.describe('Cinesa Cinemas Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('should display cinemas page layout correctly',
    { tag: ['@cinemas', '@cinesa', '@smoke', '@medium'] },
    async ({ webActions, navbar }) => {
    await navbar.navigateToCinemas();
    await webActions.waitForLoadState('domcontentloaded');
    // Take screenshot for visual verification
    await webActions.screenshot();
  });

  test('should redirect to cinemas page correctly',
    { tag: ['@cinemas', '@cinesa', '@navigation', '@fast'] },
    async ({ webActions, navbar }) => {
    await navbar.navigateToCinemas();
    await webActions.waitForLoadState('domcontentloaded');
    await assertCinemasRedirection(webActions.getPage());
  });

  test('Oasiz Cinema Schema validation test',
    { tag: ['@cinemas', '@cinesa', '@schema', '@seo', '@OCG-2550'] },
    async ({ webActions, navbar, cinema, cinemaDetail }) => {
    await navbar.navigateToCinemas();
    const selectedCinemaName = await cinema.selectOasizCinema();
    const cinemaSchema = await cinemaDetail.extractCinemaSchema();
    await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
  });

  test('Grancasa Cinema Schema validation test',
    { tag: ['@cinemas', '@cinesa', '@schema', '@seo', '@grancasa'] },
    async ({ webActions, navbar, cinema, cinemaDetail }) => {
    const config = getCinesaConfig(
      (process.env.TEST_ENV as CinesaEnvironment) || 'production'
    );
    await webActions.navigateTo(config.baseUrl);
    await navbar.navigateToCinemas();
    const selectedCinemaName = await cinema.selectGrancasaCinema();
    const cinemaSchema = await cinemaDetail.extractCinemaSchema();
    await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
  });
});
