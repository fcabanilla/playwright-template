import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Cinemas Tests', () => {
  test('Cinemas page display and layout', async ({ page, navbar }, testInfo) => {
    await navbar.navigateToCinemas();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Cinemas page display and layout');
  });
});
