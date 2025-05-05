import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './cookiespolicy.data';
import { assertCookiesPolicyNavigation } from './cookiespolicy.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cookies Policy Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Cookies Policy page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickPoliticaCookies();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cookies Policy display and layout');
  });

  test('Cookies Policy page redirection test', async ({ page, footer }) => {
    await footer.clickPoliticaCookies();
    await page.waitForLoadState('networkidle');
    await assertCookiesPolicyNavigation(page, expectedUrl);
  });
});
