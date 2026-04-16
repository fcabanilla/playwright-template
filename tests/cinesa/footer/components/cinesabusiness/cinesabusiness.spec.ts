import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import { expectedUrl } from './cinesabusiness.data';
import { assertCinesaBusinessNavigation } from './cinesabusiness.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Business Tests', () => {
  test.beforeEach(async ({ page, footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test('Footer · Cinesa Business · Display & Layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Cinesa Business page display and layout');
    await footer.clickCinesaBusiness();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinesa Business display and layout');
  });

  test('Footer · Cinesa Business · Navigate · Redirect', async ({
    page,
    footer,
  }) => {
    await allure.story('Cinesa Business navigation and URL validation');
    await footer.clickCinesaBusiness();
    await page.waitForLoadState('networkidle');
    await assertCinesaBusinessNavigation(page, expectedUrl);
  });
});
