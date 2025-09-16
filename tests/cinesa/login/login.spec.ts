import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';
import { test } from '../../../fixtures/cinesa/playwright.fixtures';
test.describe('Login', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await navbar.navigateToHome();
  });

  test('Login with valid credentials', async ({ loginPage, navbar }) => {
    await navbar.navigateToSignIn();
    await loginPage.fillData();
    await loginPage.clickSubmit();
  });

});
