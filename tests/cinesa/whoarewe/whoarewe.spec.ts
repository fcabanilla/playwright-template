import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './whoarewe.data';
import { assertWhoAreWeNavigation } from './whoarewe.assertions';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Who Are We Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Who Are We page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickQuienesSomos();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Who Are We display and layout');
  });

  test('Who Are We page redirection test', async ({ page, footer }) => {
    await footer.clickQuienesSomos();
    await page.waitForLoadState('networkidle');
    await assertWhoAreWeNavigation(page, expectedUrl);
  });
});