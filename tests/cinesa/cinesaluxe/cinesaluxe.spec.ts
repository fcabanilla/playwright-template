import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './cinesaluxe.data';
import { assertCinesaLuxeNavigation } from './cinesaluxe.assertions';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Luxe Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, cinesaluxe }) => {
    await cinesaluxe.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Cinesa Luxe page display and layout', async ({ page, cinesaluxe }, testInfo) => {
    await cinesaluxe.clickCinesaLuxe();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinesa Luxe display and layout');
  });

  test('Cinesa Luxe page redirection test', async ({ page, cinesaluxe }) => {
    await cinesaluxe.clickCinesaLuxe();
    await page.waitForLoadState('networkidle');
    await assertCinesaLuxeNavigation(page, expectedUrl);
  });
});
