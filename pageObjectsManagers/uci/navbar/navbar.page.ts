import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from './navbar.selectors';

/**
 * Represents the UCI Cinemas website navigation bar component.
 * Provides methods to interact with navigation elements and navigate to different sections.
 */
export class Navbar {
  /**
   * Base URL for the UCI Cinemas website.
   * @private
   */
  private readonly url: string = 'https://ucicinemas.it/';

  /**
   * Playwright page instance to interact with.
   */
  readonly page: Page;

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
    this.page = page;
    this.selectors = navbarSelectors;
  }

  /**
   * Navigates to the UCI Cinemas homepage.
   */
  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to UCI Cinemas home', async () => {
      await this.page.goto(this.url);
    });
  }

  /**
   * Clicks on the UCI logo in the navbar (usually returns to the homepage).
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on navbar logo', async () => {
      const logo = this.page.locator(this.selectors.logo);
      await logo.click();
    });
  }

  /**
   * Navigates to the Cinemas section.
   */
  async navigateToCinemas(): Promise<void> {
    await allure.test.step('Navigating to Cinemas page', async () => {
      const cinemasLink = this.page.locator(this.selectors.cinemas);
      await cinemasLink.click();
    });
  }

  /**
   * Navigates to the Movies section.
   */
  async navigateToMovies(): Promise<void> {
    await allure.test.step('Navigating to Movies page', async () => {
      const moviesLink = this.page.locator(this.selectors.movies);
      await moviesLink.click();
    });
  }

  /**
   * Navigates to the Promotions section.
   */
  async navigateToPromotions(): Promise<void> {
    await allure.test.step('Navigating to Promotions page', async () => {
      const promotionsLink = this.page.locator(this.selectors.promotions);
      await promotionsLink.click();
    });
  }

  /**
   * Navigates to the Experiences section.
   */
  async navigateToExperiences(): Promise<void> {
    await allure.test.step('Navigating to Experiences page', async () => {
      const experiencesLink = this.page.locator(this.selectors.experiences);
      await experiencesLink.click();
    });
  }

  /**
   * Navigates to the Membership section.
   */
  async navigateToMembership(): Promise<void> {
    await allure.test.step('Navigating to Membership page', async () => {
      const membershipLink = this.page.locator(this.selectors.membership);
      await membershipLink.click();
    });
  }

  /**
   * Navigates to the e-Shop section.
   */
  async navigateToEShop(): Promise<void> {
    await allure.test.step('Navigating to e-Shop page', async () => {
      const eShopLink = this.page.locator(this.selectors.eShop);
      await eShopLink.click();
    });
  }

  /**
   * Clicks on the sign in button.
   */
  async clickSignin(): Promise<void> {
    await allure.test.step('Clicking on Sign In button', async () => {
      const signinButton = this.page.locator(this.selectors.signin);
      await signinButton.click();
    });
  }

  /**
   * Navigates to the sign in page.
   */
  async navigateToSignIn(): Promise<void> {
    await this.clickSignin();
  }
}
