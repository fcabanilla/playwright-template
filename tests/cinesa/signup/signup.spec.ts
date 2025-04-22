import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshotForModal } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { SIGNUP_SELECTORS } from '../../../pageObjectsManagers/cinesa/signup/signup.selectors';

test.describe('Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/');
  });

  test('Signup display and layout', async ({ page, navbar }, testInfo) => {
    await navbar.navigateToSignup();
    await takeScreenshotForModal(page, testInfo, SIGNUP_SELECTORS.modalContainer);
  });
});
