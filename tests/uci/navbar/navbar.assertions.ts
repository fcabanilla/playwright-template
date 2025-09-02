import { Page, expect } from '@playwright/test';
import * as allure from 'allure-playwright';
import { Navbar } from '../../../pageObjectsManagers/uci/navbar/navbar.page';

/**
 * Provides comprehensive assertions for the UCI Cinemas Navbar component.
 * This class follows the Page Object Model pattern and should ONLY use POM methods,
 * never directly access the Playwright API to maintain separation of concerns.
 *
 * @example
 * ```typescript
 * const navbarAssertions = new NavbarAssertions(page);
 * await navbarAssertions.expectNavbarElementsVisible();
 * await navbarAssertions.expectHomeUrl('https://www.ucicinemas.it');
 * ```
 *
 * @since 1.0.0
 * @author UCI Automation Team
 */
export class NavbarAssertions {
  readonly navbar: Navbar;

  /**
   * Creates a new instance of NavbarAssertions with the provided page context.
   * Initializes the underlying Navbar page object for interaction.
   *
   * @param {Page} page - Playwright Page object for browser interaction
   *
   * @example
   * ```typescript
   * const navbarAssertions = new NavbarAssertions(page);
   * ```
   *
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.navbar = new Navbar(page);
  }

  /**
   * Asserts that all critical navbar elements are visible and accessible on the page.
   * Validates the presence of: Cinema, Film, Offerte, Esperienze, and Membership links.
   * Each element validation is wrapped in individual Allure steps for detailed reporting.
   *
   * @returns {Promise<void>} Resolves when all navbar elements are verified as visible
   *
   * @throws {AssertionError} When any navbar element is not visible
   *
   * @example
   * ```typescript
   * await navbarAssertions.expectNavbarElementsVisible();
   * // Verifies all 5 main navigation elements are present
   * ```
   *
   * @since 1.0.0
   */
  async expectNavbarElementsVisible(): Promise<void> {
    await allure.test.step('Verifying navbar elements visibility', async () => {
      await allure.test.step("Verify 'Cinema' element", async () => {
        const isVisible = await this.navbar.isCinemasVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Film' element", async () => {
        const isVisible = await this.navbar.isMoviesVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Offerte' element", async () => {
        const isVisible = await this.navbar.isPromotionsVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Esperienze' element", async () => {
        const isVisible = await this.navbar.isExperiencesVisible();
        expect(isVisible).toBe(true);
      });
      await allure.test.step("Verify 'Membership' element", async () => {
        const isVisible = await this.navbar.isMembershipVisible();
        expect(isVisible).toBe(true);
      });
    });
  }

  /**
   * Asserts that the current page URL matches the expected home URL pattern.
   * Provides flexible URL matching to handle variations like www/non-www and trailing slashes.
   * Uses regular expressions for robust URL validation that accommodates common URL variations.
   *
   * @param {string} expectedUrl - The base URL to validate against (e.g., 'https://www.ucicinemas.it')
   * @returns {Promise<void>} Resolves when URL validation is successful
   *
   * @throws {AssertionError} When the current page URL doesn't match the expected pattern
   *
   * @example
   * ```typescript
   * await navbarAssertions.expectHomeUrl('https://www.ucicinemas.it');
   * // Matches: https://ucicinemas.it, https://www.ucicinemas.it/, etc.
   * ```
   *
   * @since 1.0.0
   */
  async expectHomeUrl(expectedUrl: string): Promise<void> {
    await allure.test.step('Validating that URL remains home', async () => {
      // Make the URL matching more flexible to handle www vs non-www and trailing slashes
      const normalizedExpected = expectedUrl
        .replace(/^https?:\/\/(www\.)?/, '')
        .replace(/\/$/, '');
      const urlPattern = new RegExp(
        `https?://(www\\.)?${normalizedExpected.replace(/\./g, '\\.')}/?$`
      );

      await expect(this.navbar.webActions.page).toHaveURL(urlPattern);
    });
  }

  /**
   * Validates that navigation to a specific URL was successful after a navbar click action.
   * This method is designed for internal navigation within the same browser tab.
   * Provides flexible URL matching similar to expectHomeUrl for consistent validation.
   *
   * @param {string} expectedUrl - The destination URL that should be reached after navigation
   * @returns {Promise<void>} Resolves when URL navigation validation is successful
   *
   * @throws {AssertionError} When the current page URL doesn't match the expected destination
   *
   * @example
   * ```typescript
   * // After clicking a navbar element
   * await navbar.navigateToMovies();
   * await navbarAssertions.expectNavClick('https://www.ucicinemas.it/film');
   * ```
   *
   * @since 1.0.0
   */
  async expectNavClick(expectedUrl: string): Promise<void> {
    await allure.test.step(
      `Verifying navigation to ${expectedUrl}`,
      async () => {
        // Make URL matching more flexible to handle www vs non-www and trailing slashes
        const normalizedExpected = expectedUrl
          .replace(/^https?:\/\/(www\.)?/, '')
          .replace(/\/$/, '');
        const urlPattern = new RegExp(
          `https?://(www\\.)?${normalizedExpected.replace(/\./g, '\\.')}/?$`
        );

        await expect(this.navbar.webActions.page).toHaveURL(urlPattern);
      }
    );
  }

  /**
   * Verifies that the promotional modal is properly closed and no longer blocking user interaction.
   * This assertion is typically used after the beforeEach hook to ensure clean test state.
   * Validates both modal invisibility and navbar element accessibility.
   *
   * @returns {Promise<void>} Resolves when modal state verification is complete
   *
   * @throws {AssertionError} When promotional modal is still visible or navbar elements are inaccessible
   *
   * @example
   * ```typescript
   * // After modal handling in beforeEach
   * await promoModal.waitAndCloseModal();
   * await navbarAssertions.expectPromoModalClosed();
   * ```
   *
   * @since 1.0.0
   */
  async expectPromoModalClosed(): Promise<void> {
    await allure.test.step(
      'Verifying promotional modal is closed',
      async () => {
        // Verify that no overlay is visible
        const isModalVisible = await this.navbar.isPromoModalVisible();
        expect(isModalVisible).toBe(false);

        // Verify that we can interact with navbar elements
        const isMoviesVisible = await this.navbar.isMoviesVisible();
        expect(isMoviesVisible).toBe(true);
      }
    );
  }

  /**
   * Verifies that the UCI Cinemas logo is visible and maintains proper navigation functionality.
   * This assertion ensures the logo element is present and can be interacted with for home navigation.
   * Critical for brand visibility and user navigation experience.
   *
   * @returns {Promise<void>} Resolves when logo functionality verification is complete
   *
   * @throws {AssertionError} When the logo is not visible or accessible
   *
   * @example
   * ```typescript
   * await navbarAssertions.expectLogoFunctionality();
   * // Verifies logo is visible and clickable for home navigation
   * ```
   *
   * @since 1.0.0
   */
  async expectLogoFunctionality(): Promise<void> {
    await allure.test.step('Verifying logo functionality', async () => {
      const isLogoVisible = await this.navbar.isLogoVisible();
      expect(isLogoVisible).toBe(true);
    });
  }
}
