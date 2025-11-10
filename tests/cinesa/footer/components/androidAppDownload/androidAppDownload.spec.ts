import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './androidAppDownload.data';
import { assertAndroidAppDownloadNavigation } from './androidAppDownload.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Android App Download Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Android App Download display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Android App Download page display and layout');
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAndroidApp(),
    ]);
    await newPage.waitForLoadState('networkidle');
    await newPage.waitForSelector('body');
    await takeScreenshot(
      newPage,
      testInfo,
      'Android App Download display and layout'
    );
    await newPage.close();
  });

  test('Android App Download redirection test', async ({ page, footer }) => {
    await allure.story('Android App Download navigation and URL validation');
    const context = page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      footer.clickAndroidApp(),
    ]);
    await newPage.waitForLoadState('networkidle');
    await assertAndroidAppDownloadNavigation(newPage, expectedUrl);
    await newPage.close();
  });
});
