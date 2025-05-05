import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './appleAppDownload.data';
import { assertAppleAppDownloadNavigation } from './appleAppDownload.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Apple App Download Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Apple App Download display and layout', async ({ page, footer }, testInfo) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAppleApp()
    ]);
    await newPage.waitForLoadState('networkidle');
    await takeScreenshot(newPage, testInfo, 'Apple App Download display and layout');
    await newPage.close();
  });

  test('Apple App Download redirection test', async ({ page, footer }) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAppleApp()
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertAppleAppDownloadNavigation(newPage, expectedUrl);
    await newPage.close();
  });
});
