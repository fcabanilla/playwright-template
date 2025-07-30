import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertCinemasRedirection, assertCinemaSchemaMatches } from './cinemas.assertions';

test.describe('Cinesa Cinemas Tests', () => {
  test('Cinemas page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinemas page display and layout');
  });

  test('Cinesa Cinemas page redirection test', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await page.waitForLoadState('networkidle');
    assertCinemasRedirection(page);
  });

  test('Oasiz Cinema Schema validation test', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner
  }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    const selectedCinemaName = await cinema.selectOasizCinema();
    const cinemaSchema = await cinemaDetail.extractCinemaSchema();
    await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
  });

  test('Grancasa Cinema Schema validation test', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner
  }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    const selectedCinemaName = await cinema.selectGrancasaCinema();
    const cinemaSchema = await cinemaDetail.extractCinemaSchema();
    await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
  });
});
