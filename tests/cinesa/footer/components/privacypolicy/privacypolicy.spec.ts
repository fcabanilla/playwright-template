import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './privacypolicy.data';
import { assertPrivacyPolicyNavigation } from './privacypolicy.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Privacy Policy Tests', () => {
  test.beforeEach(async ({ footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
  });

  test('Footer · Privacy Policy · Display & Layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Privacy Policy page display and layout');
    await footer.clickPoliticaPrivacidad();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Privacy Policy display and layout');
  });

  test('Footer · Privacy Policy · Navigate · Redirect', async ({
    page,
    footer,
  }) => {
    await allure.story('Privacy Policy navigation and URL validation');
    await footer.clickPoliticaPrivacidad();
    await page.waitForLoadState('networkidle');
    await assertPrivacyPolicyNavigation(page, expectedUrl);
  });
});
