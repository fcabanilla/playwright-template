import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './purchaseConditions.data';
import { assertPurchaseConditionsNavigation } from './purchaseConditions.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Purchase Conditions Tests', () => {
  test.beforeEach(async ({ page, footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
  });

  test('Purchase Conditions page display and layout', async ({
    page,
    footer,
  }, testInfo) => {
    await allure.story('Purchase Conditions page display and layout');
    await footer.clickCondicionesCompra();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(
      page,
      testInfo,
      'Purchase Conditions display and layout'
    );
  });

  test(
    'Purchase Conditions page redirection test',
    {
      tag: ['@footer', '@purchaseconditions', '@cinesa', '@failed-prod'],
    },
    async ({ page, footer }) => {
      await allure.story('Purchase Conditions navigation and URL validation');
      await footer.clickCondicionesCompra();
      await page.waitForLoadState('networkidle');
      await assertPurchaseConditionsNavigation(page, expectedUrl);
    }
  );
});
