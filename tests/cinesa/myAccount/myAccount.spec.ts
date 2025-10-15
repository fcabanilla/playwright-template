/**
 * My Account Overview - Main test suite
 *
 * Architecture: Follows clean code patterns from copilot-instructions.md
 * - Uses fixtures for dependency injection
 * - Test data in myAccount.data.ts
 * - Assertions in myAccount.assertions.ts (with Allure steps)
 * - High-level helpers in myAccount.helpers.ts (optional, for complex flows)
 *
 * Covers manual test cases:
 * - COMS-6033: Overview display and layout
 * - COMS-11711: Member's area display and layout
 * - OCG-2454: Dashboard watched films total matches loyalty balance
 * - OCG-3356: Verify BBVA modal not displayed after signup
 *
 * Run with: TEST_ENV=lab npx playwright test tests/cinesa/myAccount/myAccount.spec.ts --headed
 * Run with tags: npx playwright test --grep "@myaccount"
 */

import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { setupCorsHandlerIfNeeded } from '../../../core/webactions/corsHandler';
import { testAccounts } from './myAccount.data';
import { MyAccountOverviewAssertions } from './myAccount.assertions';
import { loginAndNavigateToMyAccount } from './myAccount.helpers';

// Destructure assertions for shorter syntax
const {
  assertPageLayout,
  assertUserNameDisplayed,
  assertPointsBalanceVisible,
  assertAllNavigationCardsVisible,
  assertRecentBookingsSummary,
} = MyAccountOverviewAssertions;

test.describe(
  'My Account - Login Flow',
  { tag: ['@myaccount', '@smoke'] },
  () => {
    // Setup CORS handler for all tests in LAB environment
    test.beforeEach(async ({ page }) => {
      await setupCorsHandlerIfNeeded(page);
    });

    test(
      'should login and verify My Account overview page',
      { tag: '@smoke' },
      async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
        // Use helper for complete login flow (with options object)
        await loginAndNavigateToMyAccount({
          navbar,
          loginPage,
          myAccountOverview,
          promoModal,
          email: testAccounts.noMembership.email,
          password: testAccounts.noMembership.password,
        });

        // Assertions: Use assertion helpers with Allure steps
        await assertPageLayout(myAccountOverview);
        await assertUserNameDisplayed(myAccountOverview);
        await assertPointsBalanceVisible(myAccountOverview);
        await assertAllNavigationCardsVisible(myAccountOverview);
        await assertRecentBookingsSummary(myAccountOverview);
      }
    );

    test(
      'should verify quick navigation to My Account',
      { tag: '@smoke' },
      async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
        // Use helper for complete login flow (with options object)
        await loginAndNavigateToMyAccount({
          navbar,
          loginPage,
          myAccountOverview,
          promoModal,
          email: testAccounts.noMembership.email,
          password: testAccounts.noMembership.password,
        });

        // Quick assertion: Verify page layout only
        await assertPageLayout(myAccountOverview);
      }
    );
  }
);
