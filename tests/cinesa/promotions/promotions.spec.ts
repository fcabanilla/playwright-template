import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertPromotionsRedirection } from './promotions.assertions';

test.describe('Cinesa Promotions Tests', () => {
  test.beforeEach(async ({ navbar, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Promotions - Marketing');

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Promotions · Page · Display & Layout',
    { tag: ['@promotions', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, webActions }, testInfo) => {
      await allure.story('Promotions page display and layout');
      await navbar.navigateToPromotions();
      await webActions.waitForLoadState('networkidle');
      await takeScreenshot(
        page,
        testInfo,
        'Promotions page display and layout'
      );
    }
  );

  test(
    'Promotions · Page · Navigate · Redirect',
    { tag: ['@promotions', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, webActions }) => {
      await allure.story('Promotions page URL redirection validation');
      await navbar.navigateToPromotions();
      await webActions.waitForLoadState('networkidle');
      assertPromotionsRedirection(page);
    }
  );
});
