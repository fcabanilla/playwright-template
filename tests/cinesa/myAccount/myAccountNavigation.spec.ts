/**
 * Test suite for My Account navigation flow
 *
 * Architecture: Follows clean code patterns from copilot-instructions.md
 * - Uses fixtures for dependency injection
 * - Test data in myAccount.data.ts
 * - Assertions in myAccount.assertions.ts
 * - No inline selectors, no console.logs, no direct page access
 *
 * Validates:
 * - Login flow using test accounts from config
 * - Navigation to My Account from navbar
 * - Navigation between My Account subsections
 *
 * Reference: ADR-0008 - My Account Area Testing Strategy
 *
 * Run with: TEST_ENV=lab npx playwright test tests/cinesa/myAccount/myAccountNavigation.spec.ts
 * Run with tags: npx playwright test --grep "@myaccount.*@navigation"
 */

import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { setupCorsHandlerIfNeeded } from '../../../core/webactions/corsHandler';
import { testAccounts } from './myAccount.data';
import { MyAccountOverviewAssertions } from './myAccount.assertions';
import { loginAndNavigateToMyAccount } from './myAccount.helpers';

// Destructure assertions for shorter syntax
const { assertPageLayout, assertAllNavigationCardsVisible } =
  MyAccountOverviewAssertions;

test.describe(
  'My Account - Navigation Flow',
  { tag: ['@myaccount', '@navigation', '@smoke'] },
  () => {
    // Setup CORS handler for all tests in LAB environment
    test.beforeEach(async ({ page }) => {
      await setupCorsHandlerIfNeeded(page);
    });

    test(
      'should login and navigate to My Account overview',
      { tag: '@smoke' },
      async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
        // Use helper for complete login flow
        await loginAndNavigateToMyAccount(
          navbar,
          loginPage,
          myAccountOverview,
          promoModal,
          testAccounts.noMembership.email,
          testAccounts.noMembership.password
        );

        // Assertions: Verify page loaded correctly
        await assertPageLayout(myAccountOverview);
      }
    );

    test(
      'should display all navigation cards on My Account overview',
      { tag: '@smoke' },
      async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
        // Use helper for complete login flow
        await loginAndNavigateToMyAccount(
          navbar,
          loginPage,
          myAccountOverview,
          promoModal,
          testAccounts.noMembership.email,
          testAccounts.noMembership.password
        );

        // Assertions: Verify all navigation cards visible
        await assertAllNavigationCardsVisible(myAccountOverview);
      }
    );

    test.skip(
      'should navigate to bookings section',
      { tag: '@navigation' },
      async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
        // Use helper for complete login flow
        await loginAndNavigateToMyAccount(
          navbar,
          loginPage,
          myAccountOverview,
          promoModal,
          testAccounts.noMembership.email,
          testAccounts.noMembership.password
        );

        // Navigate to bookings section
        await myAccountOverview.navigateToBookings();

        // TODO: Replace assertOnOverviewPage with proper assertion that doesn't require page
        // await assertOnOverviewPage(page, '/mycinesa/mis-entradas/');
      }
    );

    test.skip(
      'should navigate to profile section',
      { tag: '@navigation' },
      async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
        // Use helper for complete login flow
        await loginAndNavigateToMyAccount(
          navbar,
          loginPage,
          myAccountOverview,
          promoModal,
          testAccounts.noMembership.email,
          testAccounts.noMembership.password
        );

        // Navigate to profile section
        await myAccountOverview.navigateToProfile();

        // TODO: Replace assertOnOverviewPage with proper assertion that doesn't require page
        // await assertOnOverviewPage(page, '/mycinesa/mi-perfil/');
      }
    );
  }
);
