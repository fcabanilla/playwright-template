import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './blogcinesa.data';
import { assertBlogCinesaNavigation } from './blogcinesa.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Blog de Cinesa Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Blog de Cinesa page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickBlogDeCinesa();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Blog de Cinesa display and layout');
  });

  test('Blog de Cinesa page redirection test', async ({ page, footer }) => {
    await footer.clickBlogDeCinesa();
    await page.waitForLoadState('networkidle');
    await assertBlogCinesaNavigation(page, expectedUrl);
  });
});