import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './ciclos.data';
import { assertCiclosNavigation } from './ciclos.assertions';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Ciclos Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, ciclos }) => {
    await ciclos.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Ciclos page display and layout', async ({ page, ciclos }, testInfo) => {
    await ciclos.clickCiclos();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Ciclos display and layout');
  });

  test('Ciclos page redirection test', async ({ page, ciclos }) => {
    await ciclos.clickCiclos();
    await page.waitForLoadState('networkidle');
    await assertCiclosNavigation(page, expectedUrl);
  });
});