import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './customerservice.data';
import { assertCustomerServiceNavigation } from './customerservice.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Customer Service Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test('Customer Service page display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Customer Service page display and layout');
    await footer.clickAtencionAlCliente();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Customer Service display and layout');
  });

  test('Customer Service page redirection test', async ({ page, footer }) => {
    await allure.story('Customer Service navigation and URL validation');
    await footer.clickAtencionAlCliente();
    await page.waitForLoadState('networkidle');
    await assertCustomerServiceNavigation(page, expectedUrl);
  });
});
