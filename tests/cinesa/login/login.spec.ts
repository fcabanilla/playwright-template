import { test } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('Login with valid credentials', 
    { tag: ['@login', '@cinesa', '@smoke', '@fast'] },
    async ({ loginPage, navbar }) => {
    await navbar.navigateToSignIn();
    await loginPage.fillData();
    await loginPage.clickSubmit();
  });

  test('Login form displays correctly', 
    { tag: ['@login', '@cinesa', '@smoke', '@fast'] },
    async ({ webActions, navbar }) => {
    await navbar.navigateToSignIn();
    await webActions.waitForLoadState('domcontentloaded');
  });
});
