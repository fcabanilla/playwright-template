import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Cinesa Experiences Tests', () => {
  test('Experiences page display and layout', async ({ page, navbar }, testInfo) => {
    await navbar.navigateToExperiences();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, testInfo, 'Experiences page display and layout');
  });
});