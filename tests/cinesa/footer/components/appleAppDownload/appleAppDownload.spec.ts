import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './appleAppDownload.data';
import { assertAppleAppDownloadNavigation } from './appleAppDownload.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Apple App Download Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Apple App Download display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Apple App Download page display and layout');
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAppleApp(),
    ]);
    await newPage.waitForLoadState('networkidle');
    await takeScreenshot(
      newPage,
      testInfo,
      'Apple App Download display and layout'
    );
    await newPage.close();
  });

  test('Apple App Download redirection test', async ({ page, footer }) => {
    await allure.story('Apple App Download navigation and URL validation');
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAppleApp(),
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertAppleAppDownloadNavigation(newPage, expectedUrl);
    await newPage.close();
  });
});
