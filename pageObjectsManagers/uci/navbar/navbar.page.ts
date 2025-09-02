import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from './navbar.selectors';
import { getUCIUrls } from '../../../config/urls';
import { WebActions } from '../../../core/webActions/webActions';

/**
 * UCI Cinemas Navigation Bar Page Object Model
 *
 * Represents the UCI Cinemas website navigation bar component and provides
 * comprehensive methods to interact with all navigation elements. This class
 * implements the Page Object Model pattern and serves as the single interface
 * for navbar-related operations.
 *
 * Features:
 * - Navigation to all main sections (Cinema, Film, Offerte, etc.)
 * - Dropdown menu handling for complex navigation
 * - Promotional modal integration
 * - URL validation and navigation verification
 * - Logo interaction for home navigation
 *
 * Architecture:
 * - Uses WebActions for all browser interactions (no direct Playwright API access)
 * - Centralizes selectors through navbar.selectors.ts
 * - Integrates with URL configuration from config/urls.ts
 * - Provides Allure step integration for detailed reporting
 *
 * @example
 * ```typescript
 * const navbar = new Navbar(page);
 * await navbar.navigateToHome();
 * await navbar.navigateToMovies();
 * const isVisible = await navbar.isCinemasVisible();
 * ```
 *
 * @since 1.0.0
 * @author UCI Automation Team
 */
export class Navbar {
  /**
   * Base URL and navigation URLs for the UCI Cinemas website.
   * @private
   */
  private readonly urls: ReturnType<typeof getUCIUrls>;

  /**
   * WebActions instance for all browser interactions.
   */
  readonly webActions: WebActions;

  /**
   * Selectors for navbar elements.
   */
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance with the provided page context.
   * Initializes WebActions for browser interactions, loads selectors configuration,
   * and prepares URL configuration for navigation operations.
   *
   * @param {Page} page - Playwright Page object for browser interactions
   *
   * @example
   * ```typescript
   * const navbar = new Navbar(page);
   * ```
   *
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = navbarSelectors;
    this.urls = getUCIUrls();
  }

  /**
   * Navigates to the UCI Cinemas homepage using standard navigation.
   * For initial navigation with potential Cloudflare protection, use navigateToHomeWithCloudflareHandling.
   *
   * @returns {Promise<void>} Resolves when navigation to homepage is complete
   *
   * @throws {Error} When navigation fails or times out
   *
   * @example
   * ```typescript
   * await navbar.navigateToHome();
   * ```
   *
   * @since 1.0.0
   */
  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to UCI Cinemas home', async () => {
      await this.webActions.navigateTo(this.urls.base);
    });
  }

  /**
   * Navigates to the UCI Cinemas homepage with comprehensive Cloudflare protection handling.
   * Implements anti-detection measures and bypass strategies. Should be used for initial page load.
   *
   * @returns {Promise<boolean>} True if navigation successful, false if Cloudflare bypass failed
   *
   * @example
   * ```typescript
   * const success = await navbar.navigateToHomeWithCloudflareHandling();
   * if (!success) {
   *   throw new Error('Failed to bypass Cloudflare protection');
   * }
   * ```
   *
   * @since 1.0.0
   */
  async navigateToHomeWithCloudflareHandling(): Promise<boolean> {
    return await allure.test.step(
      'Navigating to UCI Cinemas home with Cloudflare handling',
      async () => {
        return await this.webActions.navigateToWithCloudflareHandling(
          this.urls.base
        );
      }
    );
  }

  /**
   * Clicks on the UCI logo in the navbar (usually returns to the homepage).
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on navbar logo', async () => {
      await this.webActions.click(this.selectors.logo);
    });
  }

  /**
   * Navigates to the Cinemas section.
   */
  async navigateToCinemas(): Promise<void> {
    await allure.test.step('Navigating to Cinemas page', async () => {
      await this.webActions.click(this.selectors.cinemas);
    });
  }

  /**
   * Navigates to the Movies section.
   */
  async navigateToMovies(): Promise<void> {
    await allure.test.step('Navigating to Movies page', async () => {
      // First, hover over the Films menu item to reveal dropdown
      await this.webActions.hover(this.selectors.movies);

      // Wait for dropdown to appear
      await this.webActions.wait(1000);

      // Check if dropdown is visible
      const isDropdownVisible = await this.webActions.isVisible(
        this.selectors.filmsDropdown
      );

      if (isDropdownVisible) {
        // Click on "Tutti i film" link in the dropdown
        await this.webActions.click(this.selectors.filmsAllMoviesLink);
      } else {
        // Fallback: navigate directly using URL
        await this.webActions.navigateTo(this.urls.navigation.movies);
      }
    });
  }

  /**
   * Navigates to the Promotions section.
   */
  async navigateToPromotions(): Promise<void> {
    await allure.test.step('Navigating to Promotions page', async () => {
      await this.webActions.click(this.selectors.promotions);
    });
  }

  /**
   * Navigates to the Experiences section.
   */
  async navigateToExperiences(): Promise<void> {
    await allure.test.step('Navigating to Experiences page', async () => {
      // First try to hover to reveal dropdown if it exists
      await this.webActions.hover(this.selectors.experiences);

      // Wait a bit for dropdown to appear
      await this.webActions.wait(500);

      // Look for direct link first using selector from config
      const directLinkCount = await this.webActions.getElementCount(
        this.selectors.experiencesDirectLink
      );

      if (directLinkCount > 0) {
        await this.webActions.click(this.selectors.experiencesDirectLink);
      } else {
        // If no direct link, click the element itself
        await this.webActions.click(this.selectors.experiences);

        // Navigate manually using URL from config if the click doesn't work
        await this.webActions.navigateTo(this.urls.navigation.experiences);
      }
    });
  }

  /**
   * Navigates to the Membership section.
   */
  async navigateToMembership(): Promise<void> {
    await allure.test.step('Navigating to Membership page', async () => {
      await this.webActions.click(this.selectors.membership);
    });
  }

  /**
   * Navigates to the eShop section (opens in a new tab).
   */
  async navigateToEShop(): Promise<void> {
    await allure.test.step('Navigating to eShop page', async () => {
      await this.webActions.click(this.selectors.eShop);
    });
  }

  /**
   * Navigates to the Sign In page (opens in a new tab).
   */
  async navigateToSignIn(): Promise<void> {
    await allure.test.step('Navigating to Sign In page', async () => {
      await this.webActions.click(this.selectors.signin);
    });
  }

  // Visibility and assertion methods that expose data to the assertions layer

  /**
   * Checks if navbar elements are visible - exposes this for assertions
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.logo);
  }

  async isCinemasVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.cinemas);
  }

  async isMoviesVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.movies);
  }

  async isPromotionsVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.promotions);
  }

  async isExperiencesVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.experiences);
  }

  async isMembershipVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.membership);
  }

  async isEShopVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.eShop);
  }

  async isSignInVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.signin);
  }

  /**
   * Get current URL - exposes this for assertions
   */
  async getCurrentUrl(): Promise<string> {
    return this.webActions.page.url();
  }

  /**
   * Check if promotional modal overlay is visible
   */
  async isPromoModalVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.promoModal);
  }

  /**
   * Validate URL matches expected pattern (for assertions)
   */
  async validateUrl(expectedUrl: string): Promise<void> {
    await this.webActions.expectUrl(expectedUrl);
  }
}
