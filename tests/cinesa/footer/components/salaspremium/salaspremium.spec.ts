import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { expectedUrl } from './salaspremium.data';
import { assertSalasPremiumNavigation } from './salaspremium.assertions';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Salas Premium Tests', () => {
  test.beforeEach(async ({ page, salaspremium }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await salaspremium.navigateToHome();
  });

  test('Footer · Salas Premium · Display & Layout', async ({
    page,
    salaspremium,
  }, testInfo) => {
    await allure.story('Salas Premium page display and layout');
    await salaspremium.clickSalasPremium();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Salas Premium display and layout');
  });

  test(
    'Footer · Salas Premium · Navigate · Redirect',
    {
      tag: ['@footer', '@salaspremium', '@cinesa', '@broken-prod'],
    },
    async ({ page, salaspremium }) => {
      await allure.story('Salas Premium navigation and URL validation');
      await salaspremium.clickSalasPremium();
      await page.waitForLoadState('networkidle');
      await assertSalasPremiumNavigation(page, expectedUrl);
    }
  );
});
