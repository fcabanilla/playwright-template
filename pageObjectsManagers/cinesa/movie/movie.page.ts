import { Page } from '@playwright/test';
import { MOVIE_SELECTORS } from './movie.selectors';

/**
 * The Movie Page Object Model.
 * Contains methods to interact with the movie details page.
 */
export class MoviePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the movie details page to load completely.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector(MOVIE_SELECTORS.title, { state: 'visible', timeout: 10000 });
  }

  /**
   * Gets the title of the movie from the details page.
   */
  async getMovieTitle(): Promise<string> {
    return await this.page.locator(MOVIE_SELECTORS.title).innerText();
  }
}
