import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './purchaseConditions.data';
import { assertPurchaseConditionsNavigation } from './purchaseConditions.assertions';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Purchase Conditions Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Purchase Conditions page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickCondicionesCompra();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Purchase Conditions display and layout');
  });

  test('Purchase Conditions page redirection test', async ({ page, footer }) => {
    await footer.clickCondicionesCompra();
    await page.waitForLoadState('networkidle');
    await assertPurchaseConditionsNavigation(page, expectedUrl);
  });
});