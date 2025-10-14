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
 * Configuration object for login and My Account navigation helpers
 */
export interface LoginAndNavigateOptions {
  /** Navbar fixture */
  navbar: Navbar;
  /** LoginPage fixture */
  loginPage: LoginPage;
  /** MyAccountOverviewPage fixture */
  myAccountOverview: MyAccountOverviewPage;
  /** PromoModalPage fixture */
  promoModal: PromoModalPage;
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Configuration object for quick login helper
 */
export interface QuickLoginOptions {
  /** Navbar fixture */
  navbar: Navbar;
  /** LoginPage fixture */
  loginPage: LoginPage;
  /** PromoModalPage fixture */
  promoModal: PromoModalPage;
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

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
 * @param options - Configuration object with fixtures and credentials
 * @returns Promise that resolves when user is on My Account page
 *
 * @example
 * ```typescript
 * import { testAccounts } from './myAccount.data';
 *
 * test('my test', async ({ navbar, loginPage, myAccountOverview, promoModal }) => {
 *   await loginAndNavigateToMyAccount({
 *     navbar,
 *     loginPage,
 *     myAccountOverview,
 *     promoModal,
 *     email: testAccounts.noMembership.email,
 *     password: testAccounts.noMembership.password,
 *   });
 *   // Now user is authenticated and on My Account overview page
 * });
 * ```
 */
export async function loginAndNavigateToMyAccount(
  options: LoginAndNavigateOptions
): Promise<void> {
  const { navbar, loginPage, myAccountOverview, promoModal, email, password } =
    options;

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
 * @param options - Configuration object with fixtures and credentials
 * @returns Promise that resolves when user is authenticated
 *
 * @example
 * ```typescript
 * import { testAccounts } from './myAccount.data';
 *
 * test('my test', async ({ navbar, loginPage, promoModal }) => {
 *   await quickLogin({
 *     navbar,
 *     loginPage,
 *     promoModal,
 *     email: testAccounts.loyaltyMember.email,
 *     password: testAccounts.loyaltyMember.password,
 *   });
 *   // Now user is authenticated, navigate wherever you need
 *   await navbar.navigateToMovies();
 * });
 * ```
 */
export async function quickLogin(options: QuickLoginOptions): Promise<void> {
  const { navbar, loginPage, promoModal, email, password } = options;

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
