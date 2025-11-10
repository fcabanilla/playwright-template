import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './transparency.data';
import { assertTransparencyNavigation } from './transparency.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Transparency Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Transparency page display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Transparency page display and layout');
    await footer.clickTransparencia();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Transparency display and layout');
  });

  test('Transparency page redirection test', async ({ page, footer }) => {
    await allure.story('Transparency navigation and URL validation');
    await footer.clickTransparencia();
    await page.waitForLoadState('networkidle');
    await assertTransparencyNavigation(page, expectedUrl);
  });
});
