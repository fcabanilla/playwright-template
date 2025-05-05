import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './legalNotice.data';
import { assertLegalNoticeNavigation } from './legalNotice.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Legal Notice Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Legal Notice page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickAvisoLegal();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Legal Notice display and layout');
  });

  test('Legal Notice page redirection test', async ({ page, footer }) => {
    await footer.clickAvisoLegal();
    await page.waitForLoadState('networkidle');
    await assertLegalNoticeNavigation(page, expectedUrl);
  });
});