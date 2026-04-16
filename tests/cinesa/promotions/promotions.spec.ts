import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertPromotionsRedirection } from './promotions.assertions';

test.describe('Cinesa Promotions Tests', () => {
  test.beforeEach(async ({ navbar, promotionalModal }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Promotions - Marketing');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'Promotions · Page · Display & Layout',
    {
      tag: [
        '@rerun-cf',
        '@lab-pass',
        '@preprod-broken',
        '@promotions',
        '@cinesa',
        '@regression',
        '@medium',
      ],
    },
    async ({ page, navbar, webActions }, testInfo) => {
      await allure.story('Promotions page display and layout');
      await navbar.navigateToPromotions();
      await webActions.waitForLoadState('domcontentloaded');
      await takeScreenshot(
        page,
        testInfo,
        'Promotions page display and layout'
      );
    }
  );

  test(
    'Promotions · Page · Navigate · Redirect',
    {
      tag: [
        '@lab-pass',
        '@preprod-pass',
        '@promotions',
        '@cinesa',
        '@regression',
        '@medium',
      ],
    },
    async ({ page, navbar, webActions }) => {
      await allure.story('Promotions page URL redirection validation');
      await navbar.navigateToPromotions();
      await webActions.waitForLoadState('domcontentloaded');
      assertPromotionsRedirection(page);
    }
  );
});
