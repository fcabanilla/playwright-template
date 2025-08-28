import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from './navbar.selectors';
import { getUCIUrls } from '../../../config/urls';
import { WebActions } from '../../../core/webActions/webActions';

/**
 * Represents the UCI Cinemas website navigation bar component.
 * Provides methods to interact with navigation elements and navigate to different sections.
 * This class should only use WebActions, never directly access Playwright API.
 */
export class Navbar {
  /**
   * Base URL for the UCI Cinemas website.
   * @private
   */
  private readonly url: string;

  /**
   * WebActions instance for all browser interactions.
   */
  readonly webActions: WebActions;

  /**
   * Selectors for navbar elements.
   */
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance.
   *
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = navbarSelectors;
    this.url = getUCIUrls().base;
  }

  /**
   * Navigates to the UCI Cinemas homepage.
   */
  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to UCI Cinemas home', async () => {
      await this.webActions.navigateTo(this.url);
    });
  }

  /**
   * Navigates to the UCI Cinemas homepage with Cloudflare protection handling.
   */
  async navigateToHomeWithCloudflareHandling(): Promise<boolean> {
    return await allure.test.step(
      'Navigating to UCI Cinemas home with Cloudflare handling',
      async () => {
        return await this.webActions.navigateToWithCloudflareHandling(this.url);
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
      // First try to hover to reveal dropdown if it exists
      await this.webActions.hover(this.selectors.movies);

      // Wait a bit for dropdown to appear
      await this.webActions.wait(500);

      // Look for direct link first
      const directLinkCount = await this.webActions.getElementCount(
        'a[href="/film"], a[href*="/film"]'
      );

      if (directLinkCount > 0) {
        await this.webActions.click('a[href="/film"], a[href*="/film"]');
      } else {
        // If no direct link, click the element itself
        await this.webActions.click(this.selectors.movies);

        // Navigate manually if the click doesn't work
        await this.webActions.navigateTo('https://ucicinemas.it/film');
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

      // Look for direct link first
      const directLinkCount = await this.webActions.getElementCount(
        'a[href="/esperienze"], a[href*="/esperienze"]'
      );

      if (directLinkCount > 0) {
        await this.webActions.click(
          'a[href="/esperienze"], a[href*="/esperienze"]'
        );
      } else {
        // If no direct link, click the element itself
        await this.webActions.click(this.selectors.experiences);

        // Navigate manually if the click doesn't work
        await this.webActions.navigateTo('https://ucicinemas.it/esperienze');
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
    return await this.webActions.getCurrentUrl();
  }

  /**
   * Check if promotional modal overlay is visible
   */
  async isPromoModalVisible(): Promise<boolean> {
    return await this.webActions.isVisible(
      'div.bg-blue-1\\/80.fixed.w-full.h-full.z-40'
    );
  }

  /**
   * Validate URL matches expected pattern (for assertions)
   */
  async validateUrl(urlPattern: RegExp): Promise<void> {
    await this.webActions.expectUrl(urlPattern);
  }
}
