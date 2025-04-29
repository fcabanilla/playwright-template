import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { expectedUrl } from './customerservice.data';
import { assertCustomerServiceNavigation } from './customerservice.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Customer Service Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptCookies();
  });

  test('Customer Service page display and layout', async ({ page, footer }, testInfo) => {
    await footer.clickAtencionAlCliente();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Customer Service display and layout');
  });

  test('Customer Service page redirection test', async ({ page, footer }) => {
    await footer.clickAtencionAlCliente();
    await page.waitForLoadState('networkidle');
    await assertCustomerServiceNavigation(page, expectedUrl);
  });
});
