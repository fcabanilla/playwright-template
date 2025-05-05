import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './transparency.data';
import { assertTransparencyNavigation } from './transparency.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Transparency Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Transparency page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickTransparencia();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Transparency display and layout');
  });

  test('Transparency page redirection test', async ({ page, footer }) => {
    await footer.clickTransparencia();
    await page.waitForLoadState('networkidle');
    await assertTransparencyNavigation(page, expectedUrl);
  });
});
