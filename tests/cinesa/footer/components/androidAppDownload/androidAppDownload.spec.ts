import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './androidAppDownload.data';
import { assertAndroidAppDownloadNavigation } from './androidAppDownload.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Android App Download Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Android App Download display and layout', async ({ page, footer }, testInfo) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAndroidApp()
    ]);
    await newPage.waitForLoadState('networkidle');
    await newPage.waitForSelector('body');
    await takeScreenshot(newPage, testInfo, 'Android App Download display and layout');
    await newPage.close();
  });

  test('Android App Download redirection test', async ({ page, footer }) => {
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAndroidApp()
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertAndroidAppDownloadNavigation(newPage, expectedUrl);
    await newPage.close();
  });
});
