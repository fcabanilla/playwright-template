import { test } from '../../../fixtures/cinesa/playwright.fixtures';
test.describe('Login', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await navbar.navigateToHome();
  });

  test('Login with valid credentials', async ({ loginPage, navbar }) => {
    await navbar.navigateToSignIn();
    // Use test credentials from config or provide inline test credentials for the spec
    // Prefer using centralised test accounts; fallback to a placeholder here
    const testEmail = 'test.user@example.com';
    const testPassword = 'Password123!';
    await loginPage.fillData(testEmail, testPassword);
    await loginPage.clickSubmit();
  });
});
