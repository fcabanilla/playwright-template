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

  test('Validate mandatory fields', async ({ page, navbar, signupPage }, testInfo) => {
    await test.step('TC: https://se-ocg.atlassian.net/browse/COMS-7217', async () => {});
    await navbar.navigateToSignup();
    await signupPage.validateMandatoryFields();
    await takeScreenshotForModal(page, testInfo, SIGNUP_SELECTORS.modalContainer);
  });

  test('Validate email', async ({ page, navbar, signupPage }, testInfo) => {
    await navbar.navigateToSignup();
    await signupPage.validateEmailFields();
    await takeScreenshotForModal(page, testInfo, SIGNUP_SELECTORS.modalContainer);
  });
});
