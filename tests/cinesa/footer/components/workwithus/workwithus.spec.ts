import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './workwithus.data';
import { assertWorkWithUsNavigation } from './workwithus.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Work With Us Tests', () => {
  test.beforeEach(async ({ page, cookieBanner, workwithus }) => {
    await workwithus.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Work With Us page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickTrabajaConNosotros();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Work With Us display and layout');
  });

  test('Work With Us page redirection test', async ({ page, footer }) => {
    await footer.clickTrabajaConNosotros();
    await page.waitForLoadState('networkidle');
    await assertWorkWithUsNavigation(page, expectedUrl);
  });
});
