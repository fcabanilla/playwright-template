import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './infantil.data';
import { assertInfantilNavigation } from './infantil.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Infantil y Colegios Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, infantil }) => {
    await infantil.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Infantil y Colegios page display and layout', async ({ page, infantil }, testInfo) => {
    await infantil.clickInfantilYColegios();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Infantil y Colegios display and layout');
  });

  test('Infantil y Colegios page redirection test', async ({ page, infantil }) => {
    await infantil.clickInfantilYColegios();
    await page.waitForLoadState('networkidle');
    await assertInfantilNavigation(page, expectedUrl);
  });
});