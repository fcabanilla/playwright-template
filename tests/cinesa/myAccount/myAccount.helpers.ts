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
import { Navbar } from '../../../pageObjectsManagers/cinesa/navbar/navbar.page';
import { MyAccountOverviewPage } from '../../../pageObjectsManagers/cinesa/myAccount/myAccountOverview.page';

/**
 * Common login and navigate to My Account flow
 * Uses unified Navbar that handles both authenticated and unauthenticated states
 *
 * @param page - Playwright Page object
 * @param loginPage - LoginPage fixture
 * @param navbar - Navbar fixture (unified, handles both states)
 * @param email - Email for login
 * @param password - Password for login
 * @returns Promise that resolves when navigation is complete
 *
 * @example
 * ```typescript
 * test('my test', async ({ page, loginPage, navbar }) => {
 *   await loginAndNavigateToMyAccount(page, loginPage, navbar, 'user@test.com', 'pass123');
 *   // Now user is logged in and on My Account page
 * });
 * ```
 */
export async function loginAndNavigateToMyAccount(
  page: Page,
  loginPage: LoginPage,
  navbar: Navbar,
  email: string,
  password: string
): Promise<void> {
  // Open login modal (using unified navbar)
  await navbar.clickSignin();

  // Fill credentials
  await loginPage.fillData(email, password);

  // Submit login
  await loginPage.clickSubmit();

  // Wait for authentication
  await page.waitForLoadState('networkidle');

  // Navigate to My Account (unified navbar detects auth state)
  await navbar.navigateToMyAccount();
}

/**
 * Verifies user is authenticated
 * Uses unified Navbar that handles both authenticated and unauthenticated states
 *
 * @param navbar - Navbar fixture (unified)
 * @returns Promise resolving to true if authenticated
 *
 * @example
 * ```typescript
 * const isAuth = await verifyAuthenticated(navbar);
 * expect(isAuth).toBe(true);
 * ```
 */
export async function verifyAuthenticated(navbar: Navbar): Promise<boolean> {
  return await navbar.isAuthenticated();
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
 * Uses unified Navbar that handles both authenticated and unauthenticated states
 *
 * @param page - Playwright Page object
 * @param loginPage - LoginPage fixture
 * @param navbar - Navbar fixture (unified)
 * @param myAccountOverview - MyAccountOverviewPage fixture
 * @param email - Email for login
 * @param password - Password for login
 * @returns Promise that resolves when login is verified
 * @throws Error if login fails
 *
 * @example
 * ```typescript
 * test('my test', async ({ page, loginPage, navbar, myAccountOverview }) => {
 *   await performCompleteLoginFlow(page, loginPage, navbar, myAccountOverview, 'user@test.com', 'pass123');
 *   // Now user is verified as logged in and on My Account page
 * });
 * ```
 */
export async function performCompleteLoginFlow(
  page: Page,
  loginPage: LoginPage,
  navbar: Navbar,
  myAccountOverview: MyAccountOverviewPage,
  email: string,
  password: string
): Promise<void> {
  await loginAndNavigateToMyAccount(page, loginPage, navbar, email, password);

  // Verify authentication
  const isAuthenticated = await verifyAuthenticated(navbar);
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
 * Uses unified Navbar that handles both authenticated and unauthenticated states
 *
 * @param navbar - Navbar fixture (unified)
 * @returns Promise that resolves when logout is complete
 *
 * @example
 * ```typescript
 * test('logout test', async ({ navbar }) => {
 *   // ... after login
 *   await performLogout(navbar);
 *   // User is now logged out
 * });
 * ```
 */
export async function performLogout(navbar: Navbar): Promise<void> {
  await navbar.logout();

  // Verify logout (login button should be visible)
  const isLoggedOut = await navbar.isLoginButtonVisible();
  if (!isLoggedOut) {
    throw new Error('Logout failed: Login button not visible');
  }
}
