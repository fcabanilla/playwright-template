import { test } from '../../../fixtures/cinesa/playwright.fixtures';
test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.cinesa.es/');
  });

  test('Login with valid credentials', async ({ loginPage, navbar }) => {
    await navbar.navigateToSignIn();
    await loginPage.fillData();
    await loginPage.clickSubmit();
  });

});
