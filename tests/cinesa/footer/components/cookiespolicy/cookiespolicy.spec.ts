import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './cookiespolicy.data';
import { assertCookiesPolicyNavigation } from './cookiespolicy.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cookies Policy Tests', () => {
  test.beforeEach(async ({ footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
  });

  test(
    'Cookies Policy page display and layout',
    {
      tag: ['@footer', '@cookiespolicy', '@cinesa', '@broken-prod'],
    },
    async ({ page, footer }, testInfo) => {
      await allure.story('Cookies Policy page display and layout');
      await footer.clickPoliticaCookies();
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, testInfo, 'Cookies Policy display and layout');
    }
  );

  test('Cookies Policy page redirection test', async ({ page, footer }) => {
    await allure.story('Cookies Policy navigation and URL validation');
    await footer.clickPoliticaCookies();
    await page.waitForLoadState('networkidle');
    await assertCookiesPolicyNavigation(page, expectedUrl);
  });
});
