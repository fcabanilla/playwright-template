import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './privacypolicy.data';
import { assertPrivacyPolicyNavigation } from './privacypolicy.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Privacy Policy Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Privacy Policy page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickPoliticaPrivacidad();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Privacy Policy display and layout');
  });

  test('Privacy Policy page redirection test', async ({ page, footer }) => {
    await footer.clickPoliticaPrivacidad();
    await page.waitForLoadState('networkidle');
    await assertPrivacyPolicyNavigation(page, expectedUrl);
  });
});
