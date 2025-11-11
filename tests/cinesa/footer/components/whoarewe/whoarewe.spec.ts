import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './whoarewe.data';
import { assertWhoAreWeNavigation } from './whoarewe.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Who Are We Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Who Are We page display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Who Are We page display and layout');
    await footer.clickQuienesSomos();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Who Are We display and layout');
  });

  test('Who Are We page redirection test', {
    tag: ['@footer', '@whoarewe', '@cinesa', '@broken-prod'],
  }, async ({ page, footer }) => {
    await allure.story('Who Are We navigation and URL validation');
    await footer.clickQuienesSomos();
    await page.waitForLoadState('networkidle');
    await assertWhoAreWeNavigation(page, expectedUrl);
  });
});
