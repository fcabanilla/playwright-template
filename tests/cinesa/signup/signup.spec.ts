import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';

test.describe('Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/');
  });

  test('Signup display and layout', async ({ page, navbar }, testInfo) => {
    await navbar.navigateToSignup();
    await takeScreenshot(page, testInfo);
  });
});
