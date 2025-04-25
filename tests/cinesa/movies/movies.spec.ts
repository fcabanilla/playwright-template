import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Movies Tests', () => {
  test('Movies page display and layout', async ({ page, navbar }, testInfo) => {
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Movies page display and layout');
  });
});
