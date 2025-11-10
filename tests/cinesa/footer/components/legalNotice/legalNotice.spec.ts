import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './legalNotice.data';
import { assertLegalNoticeNavigation } from './legalNotice.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Legal Notice Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Legal Notice page display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Legal Notice page display and layout');
    await footer.clickAvisoLegal();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Legal Notice display and layout');
  });

  test('Legal Notice page redirection test', async ({ page, footer }) => {
    await allure.story('Legal Notice navigation and URL validation');
    await footer.clickAvisoLegal();
    await page.waitForLoadState('networkidle');
    await assertLegalNoticeNavigation(page, expectedUrl);
  });
});
