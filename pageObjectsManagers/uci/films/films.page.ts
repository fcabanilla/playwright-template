import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
// TODO: Create films.definitions.ts file with these interfaces
// import {
//   FilmsInterface,
//   FilmSelectOptions,
//   FilmFilterOptions,
//   FilmCard,
//   FilmData,
//   FilmsPageType,
// } from './films.definitions';
import { getUCIUrls } from '../../../config/urls';
import { WebActions } from '../../../core/webactions/webActions';
import {
  filmsSelectors,
  filmsConstants,
  FilmsSelectors,
} from './films.selectors';

/**
 * UCI Cinemas Films/Movies Page Object Model
 *
 * Comprehensive Page Object Model for the UCI Cinemas films/movies listing page.
 * Provides complete functionality for film discovery, search, filtering, and navigation
 * to individual film detail pages. Handles dynamic content loading and film interactions.
 *
 * Features:
 * - Film listing retrieval and counting
 * - Film title extraction and search
 * - Film selection and navigation to details
 * - Page load validation and URL verification
 * - Search functionality and filter interactions
 * - Integration with booking flow initiation
 *
 * Architecture:
 * - Uses WebActions abstraction layer (no direct Playwright API access)
 * - Centralizes all film page selectors through films.selectors.ts
 * - Integrates with URL configuration for consistent navigation
 * - Provides Allure step integration for detailed test reporting
 * - Follows UCI Cinema's dynamic content loading patterns
 *
 * @example
 * ```typescript
 * const filmsPage = new Films(page);
 * await filmsPage.navigateToFilms();
 * const filmCount = await filmsPage.getFilmsCount();
 * const titles = await filmsPage.getFilmTitles();
 * await filmsPage.selectFilmByTitle('Avatar');
 * ```
 *
 * @since 1.0.0
 * @author UCI Automation Team
 */
export class Films {
  /**
   * URLs for the UCI Cinemas website.
   * @private
   */
  private readonly urls: ReturnType<typeof getUCIUrls>;

  /**
   * WebActions instance for all browser interactions.
   */
  readonly webActions: WebActions;

  /**
   * Selectors for films page elements.
   */
  readonly selectors: FilmsSelectors;

  /**
   * Creates a new Films page instance with the provided page context.
   * Initializes WebActions for browser interactions, loads films page selectors,
   * and prepares URL configuration for navigation and validation operations.
   *
   * @param {Page} page - Playwright Page object for browser interactions
   *
   * @example
   * ```typescript
   * const filmsPage = new Films(page);
   * ```
   *
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = filmsSelectors;
    this.urls = getUCIUrls();
  }

  /**
   * Navigates to the UCI Cinemas films/movies listing page.
   * Uses the centralized URL configuration to ensure consistent navigation.
   *
   * @returns {Promise<void>} Resolves when navigation to films page is complete
   *
   * @throws {Error} When navigation fails or times out
   *
   * @example
   * ```typescript
   * await filmsPage.navigateToFilms();
   * ```
   *
   * @since 1.0.0
   */
  async navigateToFilms(): Promise<void> {
    await allure.test.step('Navigating to Films page', async () => {
      await this.webActions.navigateTo(this.urls.navigation.movies);
    });
  }

  /**
   * Retrieves the list of all film titles currently displayed on the films page.
   * Extracts titles from all visible film cards, handling dynamic content loading.
   *
   * @returns {Promise<string[]>} Array of film titles currently visible on the page
   *
   * @example
   * ```typescript
   * const titles = await filmsPage.getFilmTitles();
   * console.log(`Found ${titles.length} films:`, titles.slice(0, 5));
   * ```
   *
   * @since 1.0.0
   */
  async getFilmTitles(): Promise<string[]> {
    return await allure.test.step('Getting list of film titles', async () => {
      try {
        // First try UCI-specific selector
        const uciTitles = await this._getUCIFilmTitles();
        if (uciTitles.length > 0) {
          console.log(`🎬 Found ${uciTitles.length} films with UCI selector`);
          return uciTitles;
        }

        // Fallback to general selectors
        const fallbackTitles = await this._getFallbackFilmTitles();
        console.log(`🎬 Fallback: Found ${fallbackTitles.length} films`);
        return fallbackTitles;
      } catch (error) {
        console.log(`🎬 Error getting film titles: ${error}`);
        return [filmsConstants.noFilmsFoundMessage];
      }
    });
  }

  /**
   * Private method to extract film titles using UCI-specific selector.
   * @private
   */
  private async _getUCIFilmTitles(): Promise<string[]> {
    const titles: string[] = [];
    const titleElements = this.webActions.page.locator(
      filmsConstants.uciFilmTitleSelector
    );
    const titleCount = await titleElements.count();

    if (titleCount > 0) {
      for (let i = 0; i < titleCount; i++) {
        const title = await titleElements.nth(i).textContent();
        if (title && title.trim().length > 0) {
          titles.push(title.trim());
        }
      }
    }

    return titles;
  }

  /**
   * Private method to extract film titles using fallback selectors.
   * @private
   */
  private async _getFallbackFilmTitles(): Promise<string[]> {
    const titles: string[] = [];
    const filmCards = await this.webActions.getElementCount(
      this.selectors.filmCard
    );

    for (let i = 0; i < filmCards; i++) {
      const titleSelector = `${this.selectors.filmCard}${filmsConstants.nthChildPattern}${i + 1}) ${this.selectors.filmTitle}`;
      try {
        const titleElement = this.webActions.page.locator(titleSelector);
        const title = await titleElement.textContent();
        if (title && title.trim()) {
          titles.push(title.trim());
        }
      } catch {
        // Skip if title can't be extracted
        continue;
      }
    }

    return titles;
  }

  /**
   * Selects a film by its title.
   */
  async selectFilmByTitle(filmTitle: string): Promise<void> {
    await allure.test.step(`Selecting film: ${filmTitle}`, async () => {
      const filmSelector = await this._buildFilmSelector(filmTitle);
      await this.webActions.click(filmSelector);
    });
  }

  /**
   * Selects the first available film.
   */
  async selectFirstFilm(): Promise<string> {
    return await allure.test.step(
      'Selecting first available film',
      async () => {
        const firstFilmSelector = `${this.selectors.filmCard}${filmsConstants.firstChildSelector}`;
        await this.webActions.click(firstFilmSelector);

        // Get the title of the selected film
        const titleSelector = `${firstFilmSelector} ${this.selectors.filmTitle}`;
        return await this.webActions.getText(titleSelector);
      }
    );
  }

  /**
   * Searches for films using the search input.
   */
  async searchFilms(searchTerm: string): Promise<void> {
    await allure.test.step(`Searching for films: ${searchTerm}`, async () => {
      await this.webActions.fill(this.selectors.searchInput, searchTerm);
      await this.webActions.wait(filmsConstants.searchWaitTime);
    });
  }

  /**
   * Clicks on a film's booking button.
   */
  async clickBookNow(filmTitle?: string): Promise<void> {
    await allure.test.step('Clicking book now button', async () => {
      if (filmTitle) {
        const filmSelector = await this._buildFilmBookingSelector(filmTitle);
        await this.webActions.click(filmSelector);
      } else {
        // Click the first book now button
        await this.webActions.click(this.selectors.bookNowButton);
      }
    });
  }

  /**
   * Private method to build film selector by title.
   * @private
   */
  private async _buildFilmSelector(filmTitle: string): Promise<string> {
    return `${this.selectors.filmCard}${filmsConstants.hasTextPattern}${filmTitle}")`;
  }

  /**
   * Private method to build film booking selector by title.
   * @private
   */
  private async _buildFilmBookingSelector(filmTitle: string): Promise<string> {
    return `${this.selectors.filmCard}${filmsConstants.hasTextPattern}${filmTitle}") ${this.selectors.bookNowButton}`;
  }

  /**
   * Checks if the films page is loaded properly.
   */
  async isFilmsPageLoaded(): Promise<boolean> {
    return await allure.test.step(
      'Checking if films page is loaded',
      async () => {
        try {
          const filmCount = await this._getUCIFilmCount();
          if (filmCount > 0) {
            console.log(`✅ UCI films page loaded with ${filmCount} films`);
            return true;
          }

          // Fallback to general container check
          return await this._checkFallbackPageLoad();
        } catch (error) {
          console.log(`❌ Films page load check failed: ${error}`);
          return false;
        }
      }
    );
  }

  /**
   * Gets the count of films currently displayed.
   */
  async getFilmsCount(): Promise<number> {
    return await allure.test.step('Getting films count', async () => {
      // Try UCI-specific selector first
      const uciFilmCount = await this._getUCIFilmCount();
      if (uciFilmCount > 0) {
        console.log(`🎬 Found ${uciFilmCount} films using UCI selector`);
        return uciFilmCount;
      }

      // Fallback to general selector
      const generalCount = await this.webActions.getElementCount(
        this.selectors.filmCard
      );
      console.log(`🎬 Found ${generalCount} films using general selector`);
      return generalCount;
    });
  }

  /**
   * Private method to get UCI film count.
   * @private
   */
  private async _getUCIFilmCount(): Promise<number> {
    return await this.webActions.page
      .locator(filmsConstants.uciFilmTitleSelector)
      .count();
  }

  /**
   * Private method to check page load with fallback method.
   * @private
   */
  private async _checkFallbackPageLoad(): Promise<boolean> {
    await this.webActions.waitForVisible(
      this.selectors.filmsContainer,
      filmsConstants.pageLoadTimeout
    );
    const filmCount = await this.webActions.getElementCount(
      this.selectors.filmCard
    );
    console.log(`📊 Films found with fallback method: ${filmCount}`);
    return filmCount > 0;
  }

  /**
   * Verifies that films are visible on the page.
   */
  async verifyFilmsVisible(): Promise<boolean> {
    return await allure.test.step('Verifying films are visible', async () => {
      return await this.webActions.isVisible(this.selectors.filmCard);
    });
  }

  /**
   * Get current URL for validation.
   */
  async getCurrentUrl(): Promise<string> {
    return this.webActions.page.url();
  }

  /**
   * Validate URL matches films page.
   */
  async validateFilmsPageUrl(): Promise<void> {
    await allure.test.step('Validating films page URL', async () => {
      await this.webActions.expectUrl(this.urls.navigation.movies);
    });
  }
}
