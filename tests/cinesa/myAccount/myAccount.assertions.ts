/**
 * Assertions for My Account area tests
 * Following ADR-0009: Only assertions and WebActions can access Playwright API
 *
 * These assertion helpers encapsulate all expect() calls and provide
 * meaningful error messages for test failures.
 *
 * Reference: ADR-0008 - My Account Area Testing Strategy
 *
 * @module MyAccountAssertions
 */

import { expect, Page } from '@playwright/test';
import { MyAccountOverviewPage } from '../../../pageObjectsManagers/cinesa/myAccount/myAccountOverview.page';

/**
 * Assertion helpers for My Account Overview page
 */
export class MyAccountOverviewAssertions {
  /**
   * Assert that the overview page layout is correct
   * Covers: COMS-6033 - Overview display and layout
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertPageLayout(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const layoutValid = await overview.verifyPageLayout();
    expect(layoutValid).toBeTruthy();
  }

  /**
   * Assert that user name is displayed
   * Covers: COMS-11711 - Member's area display and layout
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertUserNameDisplayed(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const isVisible = await overview.verifyUserNameDisplayed();
    expect(isVisible).toBeTruthy();

    const userName = await overview.getUserName();
    expect(userName).not.toBeNull();
    expect(userName).not.toBe('');
  }

  /**
   * Assert that user name matches expected value
   *
   * @param overview - MyAccountOverviewPage instance
   * @param expectedName - Expected user name (partial match)
   */
  static async assertUserNameMatches(
    overview: MyAccountOverviewPage,
    expectedName: string
  ): Promise<void> {
    const userName = await overview.getUserName();
    expect(userName).not.toBeNull();
    expect(userName?.toLowerCase()).toContain(expectedName.toLowerCase());
  }

  /**
   * Assert that points balance is visible
   * Covers: COMS-6033 - Overview display (points widget)
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertPointsBalanceVisible(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const isVisible = await overview.verifyPointsBalanceVisible();
    expect(isVisible).toBeTruthy();
  }

  /**
   * Assert that points balance has a valid value
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertPointsBalanceValid(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const points = await overview.getPointsBalance();
    expect(points).not.toBeNull();
    expect(points).toBeGreaterThanOrEqual(0);
  }

  /**
   * Assert that watched films count is displayed
   * Covers: OCG-2454 - Dashboard watched films total matches loyalty balance
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertWatchedFilmsVisible(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const isVisible = await overview.verifyWatchedFilmsVisible();
    expect(isVisible).toBeTruthy();
  }

  /**
   * Assert that watched films count has a valid value
   * Covers: OCG-2454 - Dashboard watched films total matches loyalty balance
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertWatchedFilmsValid(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const count = await overview.getWatchedFilmsCount();
    expect(count).not.toBeNull();
    expect(count).toBeGreaterThanOrEqual(0);
  }

  /**
   * Assert that watched films count matches points-based expectation
   * Covers: OCG-2454 - Dashboard watched films total matches loyalty balance
   * Business rule: Each movie watched should add points
   *
   * @param overview - MyAccountOverviewPage instance
   * @param pointsPerFilm - Expected points per film (default: 50)
   */
  static async assertWatchedFilmsMatchesPoints(
    overview: MyAccountOverviewPage,
    pointsPerFilm: number = 50
  ): Promise<void> {
    const points = await overview.getPointsBalance();
    const watchedFilms = await overview.getWatchedFilmsCount();

    expect(points).not.toBeNull();
    expect(watchedFilms).not.toBeNull();

    // Calculate expected films based on points
    const expectedFilms = Math.floor(points! / pointsPerFilm);

    // Tolerance of ±2 films for edge cases (promotions, bonuses, etc.)
    expect(watchedFilms).toBeGreaterThanOrEqual(expectedFilms - 2);
    expect(watchedFilms).toBeLessThanOrEqual(expectedFilms + 2);
  }

  /**
   * Assert that recent bookings summary is displayed
   * Covers: COMS-6033 - Overview display (bookings widget)
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertRecentBookingsSummary(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const isVisible = await overview.verifyRecentBookingsSummary();
    expect(isVisible).toBeTruthy();
  }

  /**
   * Assert that recent bookings count is valid
   *
   * @param overview - MyAccountOverviewPage instance
   * @param minCount - Minimum expected count (default: 0)
   * @param maxCount - Maximum expected count (default: 10)
   */
  static async assertRecentBookingsCount(
    overview: MyAccountOverviewPage,
    minCount: number = 0,
    maxCount: number = 10
  ): Promise<void> {
    const count = await overview.getRecentBookingsCount();
    expect(count).toBeGreaterThanOrEqual(minCount);
    expect(count).toBeLessThanOrEqual(maxCount);
  }

  /**
   * Assert that all navigation cards are present
   * Covers: COMS-11711 - Member's area display and layout
   *
   * Based on actual HTML structure:
   * - Mis entradas (Bookings)
   * - Ofertas y recompensas (Offers)
   * - Mis logros (Achievements)
   * - Ayuda (Help/FAQs)
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertAllNavigationCardsVisible(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const cards = await overview.verifyAllNavigationCards();

    expect(cards.bookings).toBeTruthy();
    expect(cards.offers).toBeTruthy();
    expect(cards.achievements).toBeTruthy();
    expect(cards.help).toBeTruthy();
  }

  /**
   * Assert that specific navigation cards are visible
   *
   * @param overview - MyAccountOverviewPage instance
   * @param requiredCards - Array of section names that must be visible
   */
  static async assertNavigationCardsVisible(
    overview: MyAccountOverviewPage,
    requiredCards: Array<'bookings' | 'offers' | 'achievements' | 'help'>
  ): Promise<void> {
    const cards = await overview.verifyAllNavigationCards();

    requiredCards.forEach((card) => {
      expect(
        cards[card],
        `Navigation card "${card}" should be visible`
      ).toBeTruthy();
    });
  }

  /**
   * Comprehensive assertion for complete overview page
   * Covers: COMS-6033, COMS-11711, OCG-2454 (partial)
   *
   * This is a combined assertion that validates all critical elements
   * of the My Account overview page in a single call.
   *
   * @param overview - MyAccountOverviewPage instance
   */
  static async assertOverviewPageComplete(
    overview: MyAccountOverviewPage
  ): Promise<void> {
    const verification = await overview.verifyOverviewPageComplete();

    // Layout
    expect(
      verification.layoutValid,
      'Overview page layout should be valid'
    ).toBeTruthy();

    // User info
    expect(
      verification.userNameVisible,
      'User name should be visible'
    ).toBeTruthy();

    // Dashboard widgets
    expect(
      verification.pointsVisible,
      'Points balance should be visible'
    ).toBeTruthy();
    expect(
      verification.watchedFilmsVisible,
      'Watched films count should be visible'
    ).toBeTruthy();
    expect(
      verification.recentBookingsVisible,
      'Recent bookings summary should be visible'
    ).toBeTruthy();

    // Navigation cards (based on actual HTML structure)
    const { navigationCards } = verification;
    expect(
      navigationCards.bookings,
      'Bookings card should be visible'
    ).toBeTruthy();
    expect(
      navigationCards.offers,
      'Offers card should be visible'
    ).toBeTruthy();
    expect(
      navigationCards.achievements,
      'Achievements card should be visible'
    ).toBeTruthy();
    expect(navigationCards.help, 'Help card should be visible').toBeTruthy();
  }

  /**
   * Assert that page is on correct URL
   * Covers: Navigation verification
   *
   * @param page - Playwright Page object
   * @param expectedPath - Expected URL path (default: '/mycinesa/mi-area-de-cliente/')
   */
  static async assertOnOverviewPage(
    page: Page,
    expectedPath: string = '/mycinesa/mi-area-de-cliente/'
  ): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Assert that BBVA modal is not displayed
   * Covers: OCG-3356 - Verify BBVA modal not displayed after signup
   *
   * @param page - Playwright Page object
   */
  static async assertBBVAModalNotVisible(page: Page): Promise<void> {
    // BBVA modal selectors (update based on actual implementation)
    const bbvaModalSelectors = [
      '[data-testid="bbva-modal"]',
      '.bbva-promotion-modal',
      'dialog:has-text("BBVA")',
      '[role="dialog"]:has-text("BBVA")',
    ];

    for (const selector of bbvaModalSelectors) {
      const isVisible = await page
        .locator(selector)
        .isVisible()
        .catch(() => false);
      expect(isVisible).toBeFalsy();
    }
  }
}

/**
 * Quick assertion helper - validates critical overview elements
 * Use this for smoke tests that need fast validation
 *
 * @param overview - MyAccountOverviewPage instance
 */
export async function assertOverviewQuick(
  overview: MyAccountOverviewPage
): Promise<void> {
  await MyAccountOverviewAssertions.assertPageLayout(overview);
  await MyAccountOverviewAssertions.assertUserNameDisplayed(overview);
  await MyAccountOverviewAssertions.assertPointsBalanceVisible(overview);
}

/**
 * Full assertion helper - validates all overview elements
 * Use this for comprehensive regression tests
 *
 * @param overview - MyAccountOverviewPage instance
 * @param page - Playwright Page object (for URL verification)
 */
export async function assertOverviewFull(
  overview: MyAccountOverviewPage,
  page: Page
): Promise<void> {
  await MyAccountOverviewAssertions.assertOnOverviewPage(page);
  await MyAccountOverviewAssertions.assertOverviewPageComplete(overview);
  await MyAccountOverviewAssertions.assertPointsBalanceValid(overview);
  await MyAccountOverviewAssertions.assertWatchedFilmsValid(overview);
  await MyAccountOverviewAssertions.assertBBVAModalNotVisible(page);
}
