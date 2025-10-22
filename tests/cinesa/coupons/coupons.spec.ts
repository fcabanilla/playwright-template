import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertCouponsRedirection } from './coupons.assertions';

test.describe('Cinesa Coupons Tests', () => {
  test('Coupons page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await navbar.navigateToCoupons();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Coupons page display and layout');
  });

  test('Cinesa Coupons page redirection test', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      navbar.navigateToCoupons(), // se abre el nuevo tab
    ]);
    await newPage.waitForLoadState('networkidle');
    assertCouponsRedirection(newPage); // se usa función de assertions
  });

  test('validate coupons opens new tab', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      navbar.navigateToCoupons(),
    ]);
    await newPage.waitForLoadState('networkidle');
    assertCouponsRedirection(newPage);
  });
});