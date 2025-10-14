/**
 * Example test demonstrating fixture usage for My Account tests
 * Following ADR-0009: Page Objects injected via fixtures
 *
 * This file shows best practices for:
 * - Using fixtures for dependency injection
 * - Reusing common flows via helpers
 * - Clean test structure with fixtures
 *
 * Reference: ADR-0008 - My Account Area Testing Strategy
 *
 * @tags @example @my-account @fixtures
 */

import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';
import {
  loginAndNavigateToMyAccount,
  performCompleteLoginFlow,
  performLogout,
} from './myAccount.helpers';

// Get base URL from environment variable or default to LAB environment
const BASE_URL = process.env.BASE_URL || 'https://lab-web.ocgtest.es';

test.describe('My Account - Fixture Usage Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  /**
   * Example 1: Basic fixture usage
   * Shows how Page Objects are automatically injected via fixtures
   */
  test('Example 1: Using injected fixtures directly', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // ✅ No need to instantiate Page Objects - they're injected by fixtures!
    // loginPage, authenticatedNavbar, myAccountOverview are ready to use

    await page.click('button:has-text("Inicia sesión")');
    await loginPage.fillData();
    await loginPage.clickSubmit();
    await page.waitForLoadState('networkidle');

    // Use AuthenticatedNavbarPage fixture
    const isAuthenticated = await authenticatedNavbar.isUserAuthenticated();
    expect(isAuthenticated).toBe(true);

    // Navigate to My Account using fixture
    await authenticatedNavbar.navigateToMyAccount();

    // Use MyAccountOverviewPage fixture
    const isOnMyAccount = await myAccountOverview.isOnMyAccountPage();
    expect(isOnMyAccount).toBe(true);
  });

  /**
   * Example 2: Using helper functions
   * Shows how to reuse common flows
   */
  test('Example 2: Using helper for login flow', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // ✅ Helper encapsulates the entire login flow
    await performCompleteLoginFlow(
      loginPage,
      authenticatedNavbar,
      myAccountOverview,
      testAccounts.standard.email,
      testAccounts.standard.password
    );

    // Now we're authenticated and on My Account page
    const pageTitle = await myAccountOverview.getPageTitle();
    expect(pageTitle).toBeTruthy();
    console.log(`Page title: ${pageTitle}`);
  });

  /**
   * Example 3: Accessing other fixtures
   * Shows how to use multiple fixtures together
   */
  test('Example 3: Using multiple fixtures (navbar + footer)', async ({
    page,
    loginPage,
    authenticatedNavbar,
    navbar,
    footer,
  }) => {
    // You can use multiple fixtures in the same test
    // navbar = unauthenticated navbar
    // authenticatedNavbar = authenticated navbar

    // Before login: use regular navbar
    const isLoginVisible = await authenticatedNavbar.isLoginButtonVisible();
    expect(isLoginVisible).toBe(true);

    // Perform login
    await page.click('button:has-text("Inicia sesión")');
    await loginPage.fillData();
    await loginPage.clickSubmit();
    await page.waitForLoadState('networkidle');

    // After login: use authenticated navbar
    const isAuthenticated = await authenticatedNavbar.isUserAuthenticated();
    expect(isAuthenticated).toBe(true);

    // Can also use footer fixture if needed
    // await footer.someMethod();
  });

  /**
   * Example 4: Navigating between My Account sections
   * Shows fixture usage for navigation flows
   */
  test('Example 4: Navigate to different My Account sections', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // Login and get to My Account
    await loginAndNavigateToMyAccount(page, loginPage, authenticatedNavbar);
    await myAccountOverview.waitForPageLoad();

    // Navigate to Profile using fixture
    await myAccountOverview.navigateToProfile();
    expect(page.url()).toContain('/mycinesa/mi-perfil/');

    // Navigate back using browser
    await page.goBack();
    await myAccountOverview.waitForPageLoad();

    // Navigate to Preferences using fixture
    await myAccountOverview.navigateToPreferences();
    expect(page.url()).toContain('/mycinesa/preferencias/');
  });

  /**
   * Example 5: Logout flow
   * Shows how to use fixtures for logout
   */
  test('Example 5: Complete login and logout flow', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // Login
    await performCompleteLoginFlow(
      page,
      loginPage,
      authenticatedNavbar,
      myAccountOverview
    );

    // Verify authenticated state
    const userName = await authenticatedNavbar.getUserName();
    console.log(`Logged in as: ${userName || 'Unknown'}`);

    // Logout using helper
    await performLogout(authenticatedNavbar);

    // Verify logged out
    const isLoginVisible = await authenticatedNavbar.isLoginButtonVisible();
    expect(isLoginVisible).toBe(true);
  });

  /**
   * Example 6: Data-driven test with fixtures
   * Shows how fixtures work with parameterized tests
   */
  const testSections = [
    { name: 'Bookings', section: 'bookings' as const },
    { name: 'Preferences', section: 'preferences' as const },
    { name: 'Profile', section: 'profile' as const },
  ];

  for (const { name, section } of testSections) {
    test(`Example 6: Navigate to ${name} section`, async ({
      page,
      loginPage,
      authenticatedNavbar,
      myAccountOverview,
    }) => {
      // Login
      await loginAndNavigateToMyAccount(page, loginPage, authenticatedNavbar);
      await myAccountOverview.waitForPageLoad();

      // Verify section is visible
      const isVisible = await myAccountOverview.isSectionVisible(section);
      expect(isVisible).toBe(true);

      // Navigate to section
      await myAccountOverview.navigateToSection(section);

      // Verify navigation
      expect(page.url()).toContain('/mycinesa/');
      console.log(`✓ Successfully navigated to ${name}`);
    });
  }
});

/**
 * Example: Test hooks with fixtures
 * Shows how to use fixtures in beforeEach/afterEach hooks
 */
test.describe('My Account - Hooks with Fixtures', () => {
  test.beforeEach(async ({ page, loginPage, authenticatedNavbar }) => {
    // Setup: Login before each test
    await page.goto(BASE_URL);
    await loginAndNavigateToMyAccount(page, loginPage, authenticatedNavbar);
  });

  test.afterEach(async ({ authenticatedNavbar }) => {
    // Teardown: Logout after each test
    try {
      await performLogout(authenticatedNavbar);
    } catch (error) {
      console.log('Logout failed or already logged out');
    }
  });

  test('Test with authenticated setup', async ({ myAccountOverview }) => {
    // User is already logged in and on My Account page
    const isOnPage = await myAccountOverview.isOnMyAccountPage();
    expect(isOnPage).toBe(true);

    // Do your test actions here
    const pageTitle = await myAccountOverview.getPageTitle();
    expect(pageTitle).toBeTruthy();
  });

  test('Another test with same setup', async ({ myAccountOverview }) => {
    // User is already logged in again (fresh state)
    const sections = ['bookings', 'profile'] as const;

    for (const section of sections) {
      const isVisible = await myAccountOverview.isSectionVisible(section);
      expect(isVisible).toBe(true);
    }
  });
});
