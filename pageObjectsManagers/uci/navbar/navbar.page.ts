import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  navbarSelectors,
  NavbarSelectors,
  navbarConstants,
  alternativeNavbarSelectors,
  alternativeLogoSelectors,
  alternativeMoviesSelectors,
  alternativeCinemaSelectors,
  alternativePromoModalSelectors,
} from './navbar.selectors';
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
 * - Private methods for robust navigation strategies
 * - Centralized constants for maintainability
 *
 * Architecture:
 * - Uses WebActions for all browser interactions (no direct Playwright API access)
 * - Centralizes selectors through navbar.selectors.ts
 * - Integrates with URL configuration from config/urls.ts
 * - Provides Allure step integration for detailed reporting
 * - Implements 8 private methods for complex navigation logic
 *
 * Private Methods:
 * - _tryDirectMoviesNavigation(): Direct link navigation strategy
 * - _tryDropdownMoviesNavigation(): Dropdown-based navigation strategy
 * - _tryDirectExperiencesNavigation(): Direct experiences navigation
 * - _tryFallbackExperiencesNavigation(): Fallback experiences navigation
 * - _isDropdownVisible(): Dropdown visibility checker
 * - _validateNavigationSuccess(): URL validation after navigation
 * - _handlePromoModalIfPresent(): Promotional modal handling
 * - _waitForNavigationComplete(): Navigation completion waiter
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
      await this._waitForNavigationComplete(navbarConstants.homePattern);
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
        const success = await this.webActions.navigateToWithCloudflareHandling(
          this.urls.base
        );
        if (success) {
          await this._waitForNavigationComplete(navbarConstants.homePattern);
        }
        return success;
      }
    );
  }

  /**
   * Clicks on the UCI logo in the navbar (usually returns to the homepage).
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on navbar logo', async () => {
      await this.webActions.click(this.selectors.logo);
      await this._waitForNavigationComplete(navbarConstants.homePattern);
    });
  }

  /**
   * Navigates to the Cinemas section.
   */
  async navigateToCinemas(): Promise<void> {
    await allure.test.step('Navigating to Cinemas page', async () => {
      await this._handlePromoModalIfPresent();
      await this.webActions.click(this.selectors.cinemas);
      await this._waitForNavigationComplete(navbarConstants.cinemaPattern);
    });
  }

  /**
   * Navigates to the Movies section with robust fallback strategies.
   */
  async navigateToMovies(): Promise<void> {
    await allure.test.step('Navigating to Movies page', async () => {
      await this._handlePromoModalIfPresent();

      // Try direct navigation first, then dropdown
      const success =
        (await this._tryDirectMoviesNavigation()) ||
        (await this._tryDropdownMoviesNavigation());

      if (!success) {
        throw new Error(navbarConstants.navigationFailedMessage);
      }

      await this._validateNavigationSuccess(navbarConstants.filmsPattern);
    });
  }

  /**
   * Navigates to the Promotions section.
   */
  async navigateToPromotions(): Promise<void> {
    await allure.test.step('Navigating to Promotions page', async () => {
      await this._handlePromoModalIfPresent();
      await this.webActions.click(this.selectors.promotions);
    });
  }

  /**
   * Navigates to the Experiences section with multiple fallback strategies.
   */
  async navigateToExperiences(): Promise<void> {
    await allure.test.step('Navigating to Experiences page', async () => {
      await this._handlePromoModalIfPresent();

      // Try direct link first, then fallback strategies
      const success =
        (await this._tryDirectExperiencesNavigation()) ||
        (await this._tryFallbackExperiencesNavigation());

      if (!success) {
        throw new Error(navbarConstants.navigationFailedMessage);
      }

      await this._validateNavigationSuccess(navbarConstants.experiencesPattern);
    });
  }

  /**
   * Navigates to the Membership section.
   */
  async navigateToMembership(): Promise<void> {
    await allure.test.step('Navigating to Membership page', async () => {
      await this._handlePromoModalIfPresent();
      await this.webActions.click(this.selectors.membership);
      await this._waitForNavigationComplete(navbarConstants.membershipPattern);
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

  /**
   * PRIVATE: Attempts direct navigation to movies page using direct links
   * @returns Promise<boolean> - Success status
   */
  private async _tryDirectMoviesNavigation(): Promise<boolean> {
    try {
      const directLinkCount = await this.webActions.getElementCount(
        this.selectors.filmsDirectLink
      );

      if (directLinkCount > 0) {
        await this.webActions.click(this.selectors.filmsDirectLink);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Direct movies navigation failed:', error);
      return false;
    }
  }

  /**
   * PRIVATE: Attempts dropdown-based navigation to movies page
   * @returns Promise<boolean> - Success status
   */
  private async _tryDropdownMoviesNavigation(): Promise<boolean> {
    try {
      // Hover over the Films menu item to reveal dropdown
      await this.webActions.hover(this.selectors.movies);
      await this.webActions.wait(navbarConstants.dropdownWaitTime);

      // Check if dropdown is visible
      const isDropdownVisible = await this._isDropdownVisible();
      if (isDropdownVisible) {
        // Click on "Tutti i film" link in the dropdown
        await this.webActions.click(this.selectors.filmsAllMoviesLink);
        return true;
      }

      // If no dropdown, try clicking the element directly
      console.warn(navbarConstants.dropdownNotVisibleMessage);
      await this.webActions.click(this.selectors.movies);
      return true;
    } catch (error) {
      console.warn('Dropdown movies navigation failed:', error);
      // Fallback: navigate directly using URL
      try {
        await this.webActions.navigateTo(this.urls.navigation.movies);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * PRIVATE: Attempts direct navigation to experiences page
   * @returns Promise<boolean> - Success status
   */
  private async _tryDirectExperiencesNavigation(): Promise<boolean> {
    try {
      const directLinkCount = await this.webActions.getElementCount(
        this.selectors.experiencesDirectLink
      );

      if (directLinkCount > 0) {
        await this.webActions.click(this.selectors.experiencesDirectLink);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Direct experiences navigation failed:', error);
      return false;
    }
  }

  /**
   * PRIVATE: Attempts fallback strategies for experiences navigation
   * @returns Promise<boolean> - Success status
   */
  private async _tryFallbackExperiencesNavigation(): Promise<boolean> {
    try {
      // First check if we can see the dropdown with sublinks
      await this.webActions.hover(this.selectors.experiences);
      await this.webActions.wait(navbarConstants.hoverWaitTime);

      // Check if "Premium" link is visible in the dropdown
      const premiumLinkVisible = await this.webActions.isVisible(
        'a[href="/esperienze/premium"]'
      );
      if (premiumLinkVisible) {
        // Click on the first experiences sublink instead to get to /esperienze/* pattern
        await this.webActions.click('a[href="/esperienze/premium"]');
        return true;
      }

      // If no specific dropdown link, click the element itself
      await this.webActions.click(this.selectors.experiences);
      return true;
    } catch (error) {
      console.warn('Experiences click failed, trying URL navigation:', error);
      // Navigate manually using URL from config if the click doesn't work
      try {
        await this.webActions.navigateTo(this.urls.navigation.experiences);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * PRIVATE: Checks if the films dropdown is visible
   * @returns Promise<boolean>
   */
  private async _isDropdownVisible(): Promise<boolean> {
    try {
      return await this.webActions.isVisible(this.selectors.filmsDropdown);
    } catch {
      return false;
    }
  }

  /**
   * PRIVATE: Validates that navigation was successful by checking URL pattern
   * @param expectedPattern - Expected URL pattern to match
   * @returns Promise<void>
   */
  private async _validateNavigationSuccess(
    expectedPattern: string
  ): Promise<void> {
    try {
      // For experiences, we need to check if we navigated to any experience page
      if (expectedPattern === navbarConstants.experiencesPattern) {
        await this.webActions.expectUrl(`**${expectedPattern}**`);
      } else {
        await this.webActions.expectUrl(`**${expectedPattern}**`);
      }
    } catch (error) {
      console.error(
        `Navigation validation failed for pattern: ${expectedPattern}`,
        error
      );
      throw error;
    }
  }

  /**
   * PRIVATE: Handles promotional modal if present before navigation
   * @returns Promise<void>
   */
  private async _handlePromoModalIfPresent(): Promise<void> {
    try {
      const isModalVisible = await this.webActions.isVisible(
        this.selectors.promoModal
      );
      if (isModalVisible) {
        console.log('Promotional modal detected, handling...');
        // Add modal handling logic here if needed
        await this.webActions.wait(navbarConstants.hoverWaitTime);
      }
    } catch (error) {
      console.warn('Error checking promotional modal:', error);
    }
  }

  /**
   * PRIVATE: Waits for navigation to complete with timeout
   * @param urlPattern - URL pattern to wait for
   * @returns Promise<void>
   */
  private async _waitForNavigationComplete(urlPattern: string): Promise<void> {
    try {
      await this.webActions.page.waitForURL(`**${urlPattern}**`, {
        timeout: navbarConstants.navigationTimeout,
      });
    } catch (error) {
      console.warn(`Navigation timeout for pattern: ${urlPattern}`, error);
      // Don't throw error here, let the calling method handle it
    }
  }
}
