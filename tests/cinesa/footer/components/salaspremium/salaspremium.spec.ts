import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './salaspremium.data';
import { assertSalasPremiumNavigation } from './salaspremium.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Salas Premium Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, salaspremium }) => {
    await salaspremium.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Salas Premium page display and layout', async ({ page, salaspremium }, testInfo) => {
    await salaspremium.clickSalasPremium();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Salas Premium display and layout');
  });

  test('Salas Premium page redirection test', async ({ page, salaspremium }) => {
    await salaspremium.clickSalasPremium();
    await page.waitForLoadState('networkidle');
    await assertSalasPremiumNavigation(page, expectedUrl);
  });
});