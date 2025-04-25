import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Promotions Tests', () => {
  test('Promotions page display and layout', async ({ page, navbar }, testInfo) => {
    await navbar.navigateToPromotions();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Promotions page display and layout');
  });
});
