import { Page, Locator } from '@playwright/test';
import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import {
  blogLandingSelectors,
  BlogLandingSelectors,
} from './blogLanding.selectors';
import { getCinesaConfig } from '../../../config/environments';

/**
 * Represents the Blog Landing Page.
 * Provides methods to interact with the logo, grid, and related articles section.
 */
export class BlogLanding {
  /**
   * Base URL of the Blog Landing Page.
   * Dynamically resolved from environment configuration.
   */
  private readonly url: string;

  /**
   * WebActions instance for page interactions.
   */
  private readonly webActions: WebActions;

  /**
   * Playwright Page instance - public for test access.
   */
  public readonly page: Page;

  /**
   * Set of selectors for the page.
   */
  readonly selectors: BlogLandingSelectors;

  /**
   * Creates a new instance of BlogLanding.
   *
   * @param webActions - WebActions instance.
   */
  constructor(webActions: WebActions) {
    this.webActions = webActions;
    this.page = webActions.page;
    this.selectors = blogLandingSelectors;
    const config = getCinesaConfig();
    this.url = `${config.baseUrl}/blog-cinesa/`;
  }

  /**
   * Navigates to the Blog Landing Page.
   *
   * @returns A Promise that resolves when navigation is complete.
   */
  async navigateToPage(): Promise<void> {
    await allure.step('Navigating to the Blog Landing Page', async () => {
      await this.webActions.navigateTo(this.url);
    });
  }

  /**
   * Clicks on the blog logo.
   *
   * @returns A Promise that resolves when the click action is complete.
   */
  async clickLogo(): Promise<void> {
    await allure.step('Clicking on the blog logo', async () => {
      await this.webActions.click(this.selectors.logo);
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
    await this.webActions.waitForSelector(this.selectors.articleCard, {
      timeout: 10000,
    });
    return await this.getArticleCardsLocator().count();
  }
}
