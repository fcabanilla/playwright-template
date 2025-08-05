import { Page, Locator } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  blogLandingSelectors,
  BlogLandingSelectors,
} from './blogLanding.selectors';

/**
 * Represents the Blog Landing Page.
 * Provides methods to interact with the logo, grid, and related articles section.
 */
export class BlogLanding {
  /**
   * Base URL of the Blog Landing Page.
   * Adjust this value based on the testing environment.
   */
  private readonly url: string = 'https://www.cinesa.es/blog-cinesa/';

  /**
   * Playwright Page instance.
   */
  readonly page: Page;

  /**
   * Set of selectors for the page.
   */
  readonly selectors: BlogLandingSelectors;

  /**
   * Creates a new instance of BlogLanding.
   *
   * @param page - Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = blogLandingSelectors;
  }

  /**
   * Navigates to the Blog Landing Page.
   *
   * @returns A Promise that resolves when navigation is complete.
   */
  async navigateToPage(): Promise<void> {
    await allure.test.step('Navigating to the Blog Landing Page', async () => {
      await this.page.goto(this.url);
    });
  }

  /**
   * Clicks on the blog logo.
   *
   * @returns A Promise that resolves when the click action is complete.
   */
  async clickLogo(): Promise<void> {
    await allure.test.step('Clicking on the blog logo', async () => {
      await this.page.click(this.selectors.logo);
    });
  }

  /**
   * Returns the Locator for the main grid container.
   *
   * @returns Locator for the grid.
   */
  getGridLocator(): Locator {
    return this.page.locator(this.selectors.grid);
  }

  /**
   * Returns the Locator for the container of all related articles.
   *
   * @returns Locator for the related articles container.
   */
  getAllRelatedArticlesLocator(): Locator {
    return this.page.locator(this.selectors.allRelatedArticles);
  }

  /**
   * Returns the Locator for all article cards within the related articles section.
   *
   * @returns Locator for the article cards.
   */
  getArticleCardsLocator(): Locator {
    return this.page.locator(this.selectors.articleCard);
  }

  /**
   * Counts the number of article cards present in the related articles section.
   *
   * @returns A Promise that resolves with the number of article cards.
   */
  async countArticleCards(): Promise<number> {
    await this.page.waitForSelector(this.selectors.articleCard, { timeout: 10000 });
    return await this.getArticleCardsLocator().count();
  }
}
