import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './ciclos.data';
import { assertCiclosNavigation } from './ciclos.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Ciclos Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, ciclos }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await ciclos.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Ciclos page display and layout', async ({ page, ciclos }, testInfo) => {
    await allure.story('Ciclos page display and layout');
    await ciclos.clickCiclos();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Ciclos display and layout');
  });

  test('Ciclos page redirection test', async ({ page, ciclos }) => {
    await allure.story('Ciclos navigation and URL validation');
    await ciclos.clickCiclos();
    await page.waitForLoadState('networkidle');
    await assertCiclosNavigation(page, expectedUrl);
  });
});
