import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Coupons Tests', () => {
  test('Coupons page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToCoupons();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Coupons page display and layout');
  });
});