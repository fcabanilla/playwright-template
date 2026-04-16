import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './appleAppDownload.data';
import { assertAppleAppDownloadNavigation } from './appleAppDownload.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Apple App Download Tests', () => {
  test.beforeEach(async ({ footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test('Footer · Apple App · Display & Layout', async ({
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

  test('Footer · Apple App · Navigate · Store link', async ({
    page,
    footer,
  }) => {
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
