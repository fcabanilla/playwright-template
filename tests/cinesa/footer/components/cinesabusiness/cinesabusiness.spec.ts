import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './cinesabusiness.data';
import { assertCinesaBusinessNavigation } from './cinesabusiness.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Business Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, cinesabusiness }) => {
    await cinesabusiness.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Cinesa Business page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickCinesaBusiness();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinesa Business display and layout');
  });

  test('Cinesa Business page redirection test', async ({ page, footer }) => {
    await footer.clickCinesaBusiness();
    await page.waitForLoadState('networkidle');
    await assertCinesaBusinessNavigation(page, expectedUrl);
  });
});
