import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertPromotionsRedirection } from './promotions.assertions';

test.describe('Cinesa Promotions Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('Promotions page display and layout', 
    { tag: ['@promotions', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, webActions }, testInfo) => {
    await navbar.navigateToPromotions();
    await webActions.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Promotions page display and layout');
  });

  test('Cinesa Promotions page redirection test',
    { tag: ['@promotions', '@cinesa', '@regression', '@medium'] },
    async ({ page, navbar, webActions }) => {
    await navbar.navigateToPromotions();
    await webActions.waitForLoadState('networkidle');
    assertPromotionsRedirection(page);
  });
});
