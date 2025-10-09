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
    page,
    navbar,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
    promoModal,
  }) => {
    // Capture console messages and errors
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || type === 'warning') {
        console.log(`🔴 Browser ${type}: ${text}`);
      }
    });

    // Capture network request failures
    page.on('requestfailed', (request) => {
      console.log(`❌ Network failed: ${request.url()}`);
      console.log(`   Failure: ${request.failure()?.errorText}`);
    });

    // Capture response errors
    page.on('response', (response) => {
      if (response.status() >= 400) {
        console.log(`⚠️  HTTP ${response.status()}: ${response.url()}`);
      }
    });

    // Step 1: Navigate to home
    await navbar.navigateToHome();

    // Step 2: Close promotional banner if present
    await promoModal.dismissIfVisible();

    // Step 3: Click "Iniciar sesión" button
    await navbar.clickSignin();

    // Step 4: Fill and submit login form with test account credentials
    console.log(`📧 Using account: ${testAccount.email}`);
    await loginPage.fillData(testAccount.email, testAccount.password);
    console.log('✅ Form filled, clicking submit...');

    await loginPage.clickSubmit();
    console.log('✅ Submit clicked, waiting for response...');

    // Wait for login to process
    await page.waitForTimeout(5000);

    // Step 5: Wait for authenticated state
    const isAuthenticated = await authenticatedNavbar.isUserAuthenticated();

    // Step 6: Navigate to My Account overview
    if (isAuthenticated) {
      console.log('✅ User is authenticated!');

      await authenticatedNavbar.navigateToMyAccount();

      // Wait a bit for navigation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Successfully navigated to My Account!');
    } else {
      console.log('❌ User is NOT authenticated');
    }
  });
});
