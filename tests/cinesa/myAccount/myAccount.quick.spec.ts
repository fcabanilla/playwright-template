/**
 * @tag @myaccount @quick
 * Simple login flow test for My Account
 * Run with: TEST_ENV=lab npx playwright test tests/cinesa/myAccount/myAccount.quick.spec.ts --headed
 */

import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { cinesaTestAccounts } from '../../../config/testAccounts';
import { setupCorsHandlerIfNeeded } from '../../../core/webactions/corsHandler';

// Use no-membership account (basic user without loyalty/unlimited)
// LAB environment user: fcabanilla+lab-basic@cinesa.es
const testAccount = cinesaTestAccounts.valid.noMembership;

test.describe('My Account - Login Flow @quick', () => {
  // Setup CORS handler for all tests in LAB environment
  test.beforeEach(async ({ page }) => {
    await setupCorsHandlerIfNeeded(page);
  });
  test('should login and access My Account dropdown @smoke', async ({
    navbar,
    loginPage,
    authenticatedNavbar,
    promoModal,
  }) => {
    // Step 1: Navigate to home (navbar normal, not authenticated)
    await navbar.navigateToHome();

    // Step 2: Close promotional banner if present
    await promoModal.dismissIfVisible();

    // Step 3: Click "Iniciar sesión" button
    await navbar.clickSignin();

    // Step 4: Fill login form with test account credentials
    await loginPage.fillData(testAccount.email, testAccount.password);

    // Step 5: Submit login form
    await loginPage.clickSubmit();

    // Step 6: Wait and verify authenticated state (account button visible)
    const isAuthenticated = await authenticatedNavbar.isUserAuthenticated();

    // Step 7: Open account menu dropdown
    if (isAuthenticated) {
      await authenticatedNavbar.openAccountMenu();
    }
  });

  test('should navigate to My Account overview page @smoke', async ({
    navbar,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
    promoModal,
  }) => {
    // Step 1: Navigate to home
    await navbar.navigateToHome();

    // Step 2: Close promotional banner if present
    await promoModal.dismissIfVisible();

    // Step 3: Click "Iniciar sesión" button
    await navbar.clickSignin();

    // Step 4: Fill and submit login form with test account credentials
    await loginPage.fillData(testAccount.email, testAccount.password);

    // Step 5: Submit login form
    await loginPage.clickSubmit();

    // Step 6: Wait for authentication to complete
    await authenticatedNavbar.isUserAuthenticated();

    // Step 7: Navigate to My Account overview
    await authenticatedNavbar.navigateToMyAccount();

    // Step 8: Verify My Account page loaded
    await myAccountOverview.waitForPageLoad();
  });
});
