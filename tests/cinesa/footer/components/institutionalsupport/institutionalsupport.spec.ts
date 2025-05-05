import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './institutionalsupport.data';
import { assertInstitutionalSupportNavigation } from './institutionalsupport.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Institutional Support Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Institutional Support page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickApoyoInstitucional();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Institutional Support display and layout');
  });

  test('Institutional Support page redirection test', async ({ page, footer }) => {
    await footer.clickApoyoInstitucional();
    await page.waitForLoadState('networkidle');
    await assertInstitutionalSupportNavigation(page, expectedUrl);
  });
});
