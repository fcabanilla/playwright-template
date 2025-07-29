import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
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

  /**
   * Extracts and returns the movie schema JSON-LD data from the page.
   * @returns Promise that resolves to the movie schema data.
   */
  async extractMovieSchema(): Promise<any> {
    return await allure.test.step('Extracting movie schema from page', async () => {
      await this.waitForPageLoad();
      
      // Try to find React Helmet script with JSON-LD
      const reactHelmetJsonLd = this.page.locator('script[data-react-helmet="true"][type="application/ld+json"]');
      const reactHelmetCount = await reactHelmetJsonLd.count();
      
      if (reactHelmetCount > 0) {
        const scriptContent = await reactHelmetJsonLd.first().textContent();
        if (!scriptContent) {
          throw new Error('React Helmet movie schema script content is empty');
        }
        
        try {
          return JSON.parse(scriptContent);
        } catch (error) {
          throw new Error(`Failed to parse React Helmet movie schema JSON: ${error}`);
        }
      }
      
      // Fallback to regular JSON-LD scripts
      const jsonLdScripts = this.page.locator('script[type="application/ld+json"]');
      const jsonLdCount = await jsonLdScripts.count();
      
      if (jsonLdCount > 0) {
        const scriptContent = await jsonLdScripts.first().textContent();
        if (!scriptContent) {
          throw new Error('Movie schema script content is empty');
        }
        
        try {
          return JSON.parse(scriptContent);
        } catch (error) {
          throw new Error(`Failed to parse movie schema JSON: ${error}`);
        }
      }
      
      throw new Error('Movie schema script not found on the page');
    });
  }
}
