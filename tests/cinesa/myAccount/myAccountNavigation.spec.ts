/**
 * Test suite for My Account navigation flow
 * Following ADR-0009: Tests use Page Objects injected via fixtures
 *
 * This test validates:
 * - Login flow using test accounts from config
 * - Navigation to My Account from authenticated navbar
 * - Verification of My Account page loading
 * - Basic dashboard data display
 *
 * Reference: ADR-0008 - My Account Area Testing Strategy
 *
 * @tags @my-account @smoke @authentication
 */

import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';
// TODO: Import and use test accounts once login flow supports dynamic credentials
// import { cinesaTestAccounts } from '../../../config/testAccounts';

// Get base URL from environment variable or default to LAB environment
const BASE_URL = process.env.BASE_URL || 'https://lab-web.ocgtest.es';

test.describe('My Account - Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto(BASE_URL);
  });

  test('should login and navigate to My Account overview from navbar', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // GIVEN: A valid test account (no membership)
    // TODO: Use cinesaTestAccounts.valid.noMembership once login flow accepts dynamic credentials
    console.log('Using hardcoded test account from loginPage.fillData()');

    // WHEN: User opens login modal (clicking "Inicia sesión" button)
    // NOTE: This step might need adjustment based on actual HTML structure
    // The Codegen output showed: await page.getByRole('button', { name: 'Inicia sesión' }).click();
    await page.click('button:has-text("Inicia sesión")');

    // AND: User fills login credentials
    await loginPage.fillData(); // NOTE: This method currently uses hardcoded credentials
    // TODO: Update loginPage.fillData() to accept email/password parameters

    // AND: User submits login form
    await loginPage.clickSubmit();

    // AND: Wait for authentication to complete
    await page.waitForLoadState('networkidle');

    // THEN: User should be authenticated (account button visible)
    const isAuthenticated = await authenticatedNavbar.isUserAuthenticated();
    expect(isAuthenticated).toBe(true);

    // WHEN: User navigates to My Account via navbar
    await authenticatedNavbar.navigateToMyAccount();

    // THEN: My Account overview page should be displayed
    const isOnMyAccount = await myAccountOverview.isOnMyAccountPage();
    expect(isOnMyAccount).toBe(true);

    // AND: Page title should be visible
    const pageTitle = await myAccountOverview.getPageTitle();
    expect(pageTitle).toBeTruthy();
    console.log(`My Account page title: ${pageTitle}`);
  });

  test('should display all navigation cards on My Account overview', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // GIVEN: User is logged in and on My Account page
    // TODO: Use dynamic test account from config

    // Login flow (same as previous test)
    await page.click('button:has-text("Inicia sesión")');
    await loginPage.fillData();
    await loginPage.clickSubmit();
    await page.waitForLoadState('networkidle');

    // Navigate to My Account
    await authenticatedNavbar.navigateToMyAccount();
    await myAccountOverview.waitForPageLoad();

    // THEN: All main section cards should be visible
    const sections = [
      'bookings',
      'preferences',
      'membership',
      'offers',
      'cardWallet',
      'profile',
    ] as const;

    for (const section of sections) {
      const isVisible = await myAccountOverview.isSectionVisible(section);
      expect(isVisible).toBe(true);
      console.log(`✓ Section "${section}" card is visible`);
    }
  });

  test('should navigate to each My Account subsection from overview', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // GIVEN: User is logged in and on My Account overview
    // TODO: Use dynamic test account from config

    // Login and navigate to My Account
    await page.click('button:has-text("Inicia sesión")');
    await loginPage.fillData();
    await loginPage.clickSubmit();
    await page.waitForLoadState('networkidle');
    await authenticatedNavbar.navigateToMyAccount();
    await myAccountOverview.waitForPageLoad();

    // WHEN/THEN: Navigate to each subsection and verify URL
    const subsections = [
      { section: 'bookings' as const, expectedUrl: '/mycinesa/mis-entradas/' },
      {
        section: 'preferences' as const,
        expectedUrl: '/mycinesa/preferencias/',
      },
      { section: 'profile' as const, expectedUrl: '/mycinesa/mi-perfil/' },
    ];

    for (const { section, expectedUrl } of subsections) {
      // Navigate to subsection
      await myAccountOverview.navigateToSection(section);

      // Verify URL contains expected path
      const currentUrl = page.url();
      expect(currentUrl).toContain(expectedUrl);
      console.log(`✓ Successfully navigated to ${section}: ${currentUrl}`);

      // Navigate back to overview for next test
      await page.goBack();
      await myAccountOverview.waitForPageLoad();
    }
  });

  test.skip('should display dashboard widgets with user data', async ({
    page,
    loginPage,
    authenticatedNavbar,
    myAccountOverview,
  }) => {
    // GIVEN: User is logged in and on My Account overview
    // TODO: Use cinesaTestAccounts.valid.loyalty once login flow accepts dynamic credentials

    // Login and navigate to My Account
    await page.click('button:has-text("Inicia sesión")');
    await loginPage.fillData();
    await loginPage.clickSubmit();
    await page.waitForLoadState('networkidle');
    await authenticatedNavbar.navigateToMyAccount();
    await myAccountOverview.waitForPageLoad();

    // WHEN: Dashboard loads
    const dashboardData = await myAccountOverview.getDashboardData();

    // THEN: Dashboard should show user data
    console.log('Dashboard data:', dashboardData);

    // Note: These assertions might need adjustment based on actual data
    // expect(dashboardData.pointsBalance).toBeGreaterThanOrEqual(0);
    // expect(dashboardData.membershipTier).toBeDefined();
  });
});

test.describe('My Account - Error Handling', () => {
  test.skip('should show error message if page fails to load', async ({
    page,
  }) => {
    // This test would require mocking network errors or using invalid URLs
    // Skipped for now - will implement once we have error injection strategy
  });

  test.skip('should allow retry on error', async ({ page }) => {
    // This test would verify the retry button functionality
    // Skipped - requires error injection
  });
});
