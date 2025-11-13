import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './cinesaluxe.data';
import { assertCinesaLuxeNavigation } from './cinesaluxe.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Luxe Tests', () => {
  test.beforeEach(async ({ page, cinesaluxe }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await cinesaluxe.navigateToHome();
  });

  test('Footer · Cinesa Luxe · Display & Layout', async ({
    page,
    cinesaluxe,
  }, testInfo) => {
    await allure.story('Cinesa Luxe page display and layout');
    await cinesaluxe.clickCinesaLuxe();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinesa Luxe display and layout');
  });

  test('Footer · Cinesa Luxe · Navigate · Redirect', async ({
    page,
    cinesaluxe,
  }) => {
    await allure.story('Cinesa Luxe navigation and URL validation');
    await cinesaluxe.clickCinesaLuxe();
    await page.waitForLoadState('networkidle');
    await assertCinesaLuxeNavigation(page, expectedUrl);
  });
});
