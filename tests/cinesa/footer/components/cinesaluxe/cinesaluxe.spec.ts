import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './cinesaluxe.data';
import { assertCinesaLuxeNavigation } from './cinesaluxe.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Luxe Tests', () => {
  test.beforeEach(async ({ page, footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test('Footer · Cinesa Luxe · Display & Layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Cinesa Luxe page display and layout');
    await footer.clickCinesaLuxe();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinesa Luxe display and layout');
  });

  test('Footer · Cinesa Luxe · Navigate · Redirect', async ({
    page,
    footer,
  }) => {
    await allure.story('Cinesa Luxe navigation and URL validation');
    await footer.clickCinesaLuxe();
    await page.waitForLoadState('networkidle');
    await assertCinesaLuxeNavigation(page, expectedUrl);
  });
});
