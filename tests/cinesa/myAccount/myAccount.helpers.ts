/**
 * Helper functions for My Account tests
 * These helpers encapsulate common high-level test flows using fixtures
 *
 * Architecture: Follows clean code patterns from copilot-instructions.md
 * - Uses Page Objects via fixtures (no direct page access)
 * - No inline selectors or hardcoded values
 * - Reusable across multiple test files
 * - Returns void (no assertions - use myAccount.assertions.ts for validations)
 *
 * @module MyAccountHelpers
 */

import { LoginPage } from '../../../pageObjectsManagers/cinesa/login/login.page';
import { Navbar } from '../../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { MyAccountOverviewPage } from '../../../pageObjectsManagers/cinesa/myAccount/myAccountOverview.page';
import { PromoModalPage } from '../../../pageObjectsManagers/cinesa/promoModal/promoModal.page';

/**
 * High-level helper: Complete login flow and navigate to My Account
 *
 * This helper encapsulates the entire authentication flow:
 * 1. Navigate to home
 * 2. Dismiss promotional modals
 * 3. Open login form
 * 4. Fill credentials and submit
 * 5. Wait for authentication
 * 6. Navigate to My Account overview
 *
 * @param navbar - Navbar fixture
 * @param loginPage - LoginPage fixture
 * @param myAccountOverview - MyAccountOverviewPage fixture
 * @param promoModal - PromoModalPage fixture
 * @param email - User email address
 * @param password - User password
 * @returns Promise that resolves when user is on My Account page
 *
 * @example
 * ```typescript
 * import { testAccounts } from './myAccount.data';
 *
 * test('my test', async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
 *   await loginAndNavigateToMyAccount(
 *     navbar,
 *     loginPage,
 *     myAccountOverview,
 *     promoModal,
 *     testAccounts.noMembership.email,
 *     testAccounts.noMembership.password
 *   );
 *   // Now user is authenticated and on My Account overview page
 * });
 * ```
 */
export async function loginAndNavigateToMyAccount(
  navbar: Navbar,
  loginPage: LoginPage,
  myAccountOverview: MyAccountOverviewPage,
  promoModal: PromoModalPage,
  email: string,
  password: string
): Promise<void> {
  // Setup: Navigate to home and dismiss modals
  await navbar.navigateToHome();
  await promoModal.dismissIfVisible();

  // Authentication flow
  await navbar.clickSignin();
  await loginPage.fillData(email, password);
  await loginPage.submitAndWaitForAuth();

  // Navigate to My Account
  await navbar.navigateToMyAccount();
  await myAccountOverview.waitForPageLoad();
}

/**
 * High-level helper: Quick login flow (without navigation to My Account)
 *
 * Useful when you need to authenticate but navigate elsewhere.
 *
 * @param navbar - Navbar fixture
 * @param loginPage - LoginPage fixture
 * @param promoModal - PromoModalPage fixture
 * @param email - User email address
 * @param password - User password
 * @returns Promise that resolves when user is authenticated
 *
 * @example
 * ```typescript
 * import { testAccounts } from './myAccount.data';
 *
 * test('my test', async ({ navbar, loginPage, promoModal }) => {
 *   await quickLogin(
 *     navbar,
 *     loginPage,
 *     promoModal,
 *     testAccounts.loyaltyMember.email,
 *     testAccounts.loyaltyMember.password
 *   );
 *   // Now user is authenticated, navigate wherever you need
 *   await navbar.navigateToMovies();
 * });
 * ```
 */
export async function quickLogin(
  navbar: Navbar,
  loginPage: LoginPage,
  promoModal: PromoModalPage,
  email: string,
  password: string
): Promise<void> {
  // Setup: Navigate to home and dismiss modals
  await navbar.navigateToHome();
  await promoModal.dismissIfVisible();

  // Authentication flow
  await navbar.clickSignin();
  await loginPage.fillData(email, password);
  await loginPage.submitAndWaitForAuth();
}

/**
 * High-level helper: Navigate to My Account subsection
 *
 * Assumes user is already on My Account overview page.
 *
 * @param myAccountOverview - MyAccountOverviewPage fixture
 * @param section - Section to navigate to
 * @returns Promise that resolves when navigation is complete
 *
 * @example
 * ```typescript
 * test('navigate to bookings', async ({ myAccountOverview }) => {
 *   // ... after being on My Account overview
 *   await navigateToMyAccountSection(myAccountOverview, 'bookings');
 *   // Now on bookings page
 * });
 * ```
 */
export async function navigateToMyAccountSection(
  myAccountOverview: MyAccountOverviewPage,
  section:
    | 'bookings'
    | 'preferences'
    | 'membership'
    | 'offers'
    | 'cardWallet'
    | 'profile'
): Promise<void> {
  await myAccountOverview.navigateToSection(section);
}
