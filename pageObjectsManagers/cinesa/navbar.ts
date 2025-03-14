import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { navbarSelectors, NavbarSelectors } from './navbar.selectors';

/**
 * Represents the Cinesa website navigation bar component.
 * Provides methods to interact with navigation elements and navigate to different sections.
 */
export class Navbar {
  /**
   * Base URL for the Cinesa website
   * @private
   */
  private readonly url: string = 'https://www.cinesa.es/';

  /**
   * Playwright page instance to interact with
   */
  readonly page: Page;

  /**
   * Selectors for navbar elements
   */
  readonly selectors: NavbarSelectors;

  /**
   * Creates a new Navbar instance.
   *
   * @param page - The Playwright page object to interact with
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = navbarSelectors; // Using formPage pattern assignment
  }

  /**
   * Navigates to the Cinesa homepage.
   *
   * @returns Promise that resolves when navigation is complete
   */
  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to Cinesa home', async () => {
      await this.page.goto(this.url);
    });
  }

  /**
   * Clicks on the Cinesa logo in the navbar.
   * Usually returns to the homepage.
   *
   * @returns Promise that resolves when the click action is complete
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on navbar logo', async () => {
      await this.page.click(this.selectors.logo);
    });
  }

  // Methods to interact with the navbar
}
