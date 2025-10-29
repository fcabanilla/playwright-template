import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';
import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import {
  assertCinemasRedirection,
  assertCinemaSchemaMatches,
} from './cinemas.assertions';

test.describe('Cinesa Cinemas Tests', () => {
  test('Cinemas page display and layout', async ({
    page,
    navbar,
    cookieBanner,
  }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await navbar.navigateToCinemas();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinemas page display and layout');
  });

  test('Cinesa Cinemas page redirection test', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await navbar.navigateToCinemas();
    await page.waitForLoadState('networkidle');
    assertCinemasRedirection(page);
  });

  test(
    'Oasiz Cinema Schema validation test',
    { tag: ['@cinemas', '@cinesa', '@schema', '@seo', '@OCG-2550'] },
    async ({ page, navbar, cinema, cinemaDetail, cookieBanner }) => {
      await navbar.navigateToHome();
      await cookieBanner.acceptAllCookies();
      await navbar.navigateToCinemas();
      const selectedCinemaName = await cinema.selectOasizCinema();
      const cinemaSchema = await cinemaDetail.extractCinemaSchema();
      await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
    }
  );

  test('Grancasa Cinema Schema validation test', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
  }) => {
    const config = getCinesaConfig(
      (process.env.TEST_ENV as CinesaEnvironment) || 'production'
    );
    await page.goto(config.baseUrl);
    await cookieBanner.acceptAllCookies();
    await navbar.navigateToCinemas();
    const selectedCinemaName = await cinema.selectGrancasaCinema();
    const cinemaSchema = await cinemaDetail.extractCinemaSchema();
    await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
  });
});
