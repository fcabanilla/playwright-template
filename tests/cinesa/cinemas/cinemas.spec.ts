import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertCinemasRedirection } from './cinemas.assertions';

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
});
