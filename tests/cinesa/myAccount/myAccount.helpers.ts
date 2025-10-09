/**
 * Helper functions for My Account tests
 * These helpers encapsulate common test flows using fixtures
 *
 * Following ADR-0009: All helpers use Page Objects injected via fixtures
 *
 * @module MyAccountHelpers
 */

import { Page } from '@playwright/test';
import { LoginPage } from '../../../pageObjectsManagers/cinesa/login/login.page';
import { AuthenticatedNavbarPage } from '../../../pageObjectsManagers/cinesa/navbar/authenticatedNavbar.page';
import { MyAccountOverviewPage } from '../../../pageObjectsManagers/cinesa/myAccount/myAccountOverview.page';

/**
 * Common login and navigate to My Account flow
 *
 * @param page - Playwright Page object
 * @param loginPage - LoginPage fixture
 * @param authenticatedNavbar - AuthenticatedNavbarPage fixture
 * @returns Promise that resolves when navigation is complete
 *
 * @example
 * ```typescript
 * test('my test', async ({ page, loginPage, authenticatedNavbar }) => {
 *   await loginAndNavigateToMyAccount(page, loginPage, authenticatedNavbar);
 *   // Now user is logged in and on My Account page
 * });
 * ```
 */
export async function loginAndNavigateToMyAccount(
  page: Page,
  loginPage: LoginPage,
  authenticatedNavbar: AuthenticatedNavbarPage
): Promise<void> {
  // Open login modal
  await page.click('button:has-text("Inicia sesión")');

  // Fill credentials (currently hardcoded in LoginPage)
  await loginPage.fillData();

  // Submit login
  await loginPage.clickSubmit();

  // Wait for authentication
  await page.waitForLoadState('networkidle');

  // Navigate to My Account
  await authenticatedNavbar.navigateToMyAccount();
}

/**
 * Verifies user is authenticated
 *
 * @param authenticatedNavbar - AuthenticatedNavbarPage fixture
 * @returns Promise resolving to true if authenticated
 *
 * @example
 * ```typescript
 * const isAuth = await verifyAuthenticated(authenticatedNavbar);
 * expect(isAuth).toBe(true);
 * ```
 */
export async function verifyAuthenticated(
  authenticatedNavbar: AuthenticatedNavbarPage
): Promise<boolean> {
  return await authenticatedNavbar.isUserAuthenticated();
}

/**
 * Verifies user is on My Account page
 *
 * @param myAccountOverview - MyAccountOverviewPage fixture
 * @returns Promise resolving to true if on My Account page
 *
 * @example
 * ```typescript
 * const isOnPage = await verifyOnMyAccountPage(myAccountOverview);
 * expect(isOnPage).toBe(true);
 * ```
 */
export async function verifyOnMyAccountPage(
  myAccountOverview: MyAccountOverviewPage
): Promise<boolean> {
  return await myAccountOverview.isOnMyAccountPage();
}

/**
 * Performs complete login flow and verifies success
 *
 * @param page - Playwright Page object
 * @param loginPage - LoginPage fixture
 * @param authenticatedNavbar - AuthenticatedNavbarPage fixture
 * @param myAccountOverview - MyAccountOverviewPage fixture
 * @returns Promise that resolves when login is verified
 * @throws Error if login fails
 *
 * @example
 * ```typescript
 * test('my test', async ({ page, loginPage, authenticatedNavbar, myAccountOverview }) => {
 *   await performCompleteLoginFlow(page, loginPage, authenticatedNavbar, myAccountOverview);
 *   // Now user is verified as logged in and on My Account page
 * });
 * ```
 */
export async function performCompleteLoginFlow(
  page: Page,
  loginPage: LoginPage,
  authenticatedNavbar: AuthenticatedNavbarPage,
  myAccountOverview: MyAccountOverviewPage
): Promise<void> {
  await loginAndNavigateToMyAccount(page, loginPage, authenticatedNavbar);

  // Verify authentication
  const isAuthenticated = await verifyAuthenticated(authenticatedNavbar);
  if (!isAuthenticated) {
    throw new Error('Login failed: User is not authenticated');
  }

  // Wait for My Account page to load
  await myAccountOverview.waitForPageLoad();

  // Verify on My Account page
  const isOnMyAccount = await verifyOnMyAccountPage(myAccountOverview);
  if (!isOnMyAccount) {
    throw new Error('Navigation failed: Not on My Account page');
  }
}

/**
 * Logs out user and verifies logout
 *
 * @param authenticatedNavbar - AuthenticatedNavbarPage fixture
 * @returns Promise that resolves when logout is complete
 *
 * @example
 * ```typescript
 * test('logout test', async ({ authenticatedNavbar }) => {
 *   // ... after login
 *   await performLogout(authenticatedNavbar);
 *   // User is now logged out
 * });
 * ```
 */
export async function performLogout(
  authenticatedNavbar: AuthenticatedNavbarPage
): Promise<void> {
  await authenticatedNavbar.logout();

  // Verify logout (login button should be visible)
  const isLoggedOut = await authenticatedNavbar.isLoginButtonVisible();
  if (!isLoggedOut) {
    throw new Error('Logout failed: Login button not visible');
  }
}
