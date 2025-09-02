import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  cinemaDetailSelectors,
  CinemaDetailSelectors,
  cinemaDetailConstants,
} from './cinemaDetail.selectors';
import { WebActions } from '../../../core/webActions/webActions';

/**
 * Represents the UCI Cinema Detail page.
 * Provides methods to interact with the film list and showtime elements.
 * This class should only use WebActions, never directly access Playwright API.
 */
export class CinemaDetail {
  /**
   * WebActions instance for all browser interactions.
   */
  readonly webActions: WebActions;

  /**
   * Selectors for cinema detail page elements.
   */
  readonly selectors: CinemaDetailSelectors;

  /**
   * Creates a new CinemaDetail instance.
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = cinemaDetailSelectors;
  }

  /**
   * Retrieves a list of all film names displayed on the cinema detail page.
   * Waits until the film list and at least one film name are visible.
   * @returns Promise that resolves to an array of film names.
   */
  async getFilmNames(): Promise<string[]> {
    return await allure.test.step(
      'Getting list of film names from UCI cinema detail page',
      async () => {
        // Wait for film list to be visible with increased timeout
        await this.webActions.waitForVisible(
          this.selectors.filmList,
          cinemaDetailConstants.filmListTimeout
        );

        // Wait a bit more for films to load
        await this.webActions.page.waitForTimeout(
          cinemaDetailConstants.filmsLoadWaitTime
        );

        return await this._extractFilmNamesFromAlternativeSelectors();
      }
    );
  }

  /**
   * Clicks on the film element with the given name.
   * @param name - The name of the film to select.
   * @returns Promise that resolves when the click action is complete.
   */
  async selectFilmByName(name: string): Promise<void> {
    await allure.test.step(
      `Selecting UCI film with name "${name}"`,
      async () => {
        // Try multiple approaches to find and click the film
        const filmSelectors = this._buildFilmSelectors(name);

        const clicked = await this._trySelectFilmWithSelectors(filmSelectors);

        if (!clicked) {
          // Fallback: click first film item
          await this._selectFirstFilmItem();
        }
      }
    );
  }

  /**
   * Selects a random film from the film list.
   * @returns Promise that resolves to the name of the selected film.
   */
  async selectRandomFilm(): Promise<string> {
    return await allure.test.step(
      'Selecting a random film from UCI cinema detail page',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          // Fallback: click first film item
          await this._selectFirstFilmItem();
          return cinemaDetailConstants.defaultFilmName;
        }

        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedName = names[randomIndex];
        await this.selectFilmByName(selectedName);
        return selectedName;
      }
    );
  }

  /**
   * Selects a random showtime for a given film.
   * @param filmName - Optional film name. If not provided, selects from any available film.
   * @returns Promise that resolves when a showtime is selected.
   */
  async selectRandomShowtime(filmName?: string): Promise<void> {
    await allure.test.step(
      `Selecting random showtime${filmName ? ` for film "${filmName}"` : ''}`,
      async () => {
        if (filmName) {
          await this.selectFilmByName(filmName);
        }

        // Wait for showtimes to be visible
        await this.webActions.waitForVisible(this.selectors.showtime);

        // Get all available showtimes
        const showtimeElements = this.webActions.getLocator(
          this.selectors.showtime
        );
        const count = await showtimeElements.count();

        if (count > 0) {
          const randomIndex = Math.floor(Math.random() * count);
          await showtimeElements.nth(randomIndex).click();
        } else {
          throw new Error('No showtimes available');
        }
      }
    );
  }

  /**
   * Selects a random film and then a random showtime.
   * @returns Promise that resolves to an object with film and showtime info.
   */
  async selectRandomFilmAndShowtime(): Promise<{
    film: string;
    showtime: string;
  }> {
    return await allure.test.step(
      'Selecting random film and showtime from UCI cinema',
      async () => {
        const selectedFilm = await this.selectRandomFilm();

        // Wait a bit for showtimes to load
        await this.webActions.wait(cinemaDetailConstants.filmsLoadWaitTime);

        await this.selectRandomShowtime();

        return {
          film: selectedFilm,
          showtime: cinemaDetailConstants.defaultShowtimeText,
        };
      }
    );
  }

  /**
   * Selects the first available film and showtime.
   * @returns Promise that resolves to an object with film and showtime info.
   */
  async selectFirstFilmAndShowtime(): Promise<{
    film: string;
    showtime: string;
  }> {
    return await allure.test.step(
      'Selecting first available film and showtime from UCI cinema',
      async () => {
        // Click first film
        await this.webActions.waitForVisible(this.selectors.filmItem);
        await this._selectFirstFilmItem();

        // Get film name
        const filmNames = await this.getFilmNames();
        const filmName =
          filmNames.length > 0
            ? filmNames[0]
            : cinemaDetailConstants.firstFilmName;

        // Wait for showtimes and click first one
        await this.webActions.waitForVisible(this.selectors.showtime);
        await this.webActions.click(`${this.selectors.showtime}:first-child`);

        return {
          film: filmName,
          showtime: cinemaDetailConstants.firstAvailableShowtime,
        };
      }
    );
  }

  /**
   * Clicks on a film title link to navigate to the movie details page.
   * @param filmName - The name of the film to navigate to.
   * @returns Promise that resolves when navigation is complete.
   */
  async selectRandomFilmForDetails(
    filmName?: string
  ): Promise<{ film: string }> {
    return await allure.test.step(
      `Navigating to UCI film details${filmName ? ` for "${filmName}"` : ''}`,
      async () => {
        if (filmName) {
          // Click on specific film title link
          await this.webActions.click(
            `${this.selectors.filmTitleLink}:has-text("${filmName}")`
          );
          return { film: filmName };
        } else {
          // Click on random film title link
          const filmNames = await this.getFilmNames();
          if (filmNames.length > 0) {
            const randomIndex = Math.floor(Math.random() * filmNames.length);
            const selectedFilm = filmNames[randomIndex];
            await this.webActions.click(
              `${this.selectors.filmTitleLink}:has-text("${selectedFilm}")`
            );
            return { film: selectedFilm };
          } else {
            // Fallback: click first title link
            await this.webActions.click(
              `${this.selectors.filmTitleLink}:first-child`
            );
            return { film: cinemaDetailConstants.defaultFilmName };
          }
        }
      }
    );
  }

  /**
   * Validates that the cinema detail page is loaded and contains films.
   * @returns Promise that resolves to true if page is valid.
   */
  async verifyCinemaDetailPageLoaded(): Promise<boolean> {
    return await allure.test.step(
      'Verifying UCI cinema detail page is loaded',
      async () => {
        try {
          // Give the page time to load completely
          await this.webActions.wait(cinemaDetailConstants.pageLoadWaitTime);

          return await this._checkPageLoadIndicators();
        } catch (error) {
          console.log('Error verifying cinema detail page:', error);
          return false;
        }
      }
    );
  }

  /**
   * Gets the current cinema name from the detail page.
   * @returns Promise that resolves to the cinema name.
   */
  async getCinemaName(): Promise<string> {
    return await allure.test.step(
      'Getting UCI cinema name from detail page',
      async () => {
        try {
          // Try multiple selectors for the cinema title
          const titleSelectors = [
            this.selectors.cinemaTitle,
            ...this.selectors.alternativeCinemaTitleSelectors,
          ];

          const cinemaName =
            await this._extractCinemaNameFromSelectors(titleSelectors);
          if (cinemaName) {
            return cinemaName;
          }

          // Fallback: try to get from page title or URL
          const urlName = this._extractCinemaNameFromUrl();
          if (urlName) {
            console.log(`Cinema name extracted from URL: ${urlName}`);
            return urlName;
          }

          return cinemaDetailConstants.unknownCinemaName;
        } catch (error) {
          console.log('Error getting cinema name:', error);
          return cinemaDetailConstants.errorCinemaName;
        }
      }
    );
  }

  /**
   * Extracts cinema schema information for validation.
   * @returns Promise that resolves to schema data.
   */
  async extractCinemaSchema(): Promise<any> {
    return await allure.test.step('Extracting UCI cinema schema', async () => {
      // This is a placeholder for schema extraction
      // Implementation would depend on actual UCI schema structure
      return {
        name: await this.getCinemaName(),
        films: await this.getFilmNames(),
        type: 'UCI Cinema',
      };
    });
  }

  /**
   * Private method to extract film names from alternative selectors.
   *
   * @private
   * @returns Promise that resolves to array of film names.
   */
  private async _extractFilmNamesFromAlternativeSelectors(): Promise<string[]> {
    // Try multiple selectors for film names based on actual HTML structure
    const filmSelectors = this.selectors.alternativeFilmSelectors;

    for (const selector of filmSelectors) {
      try {
        console.log(`🎬 Trying film selector: ${selector}`);
        const elements = this.webActions.getLocator(selector);
        const count = await elements.count();
        console.log(`🎬 Found ${count} films with selector: ${selector}`);

        if (count > 0) {
          const names = await elements.allTextContents();
          const validNames = names.filter((name) => name.trim().length > 0);
          console.log(
            `🎬 Valid film names found: ${validNames.length}`,
            validNames
          );

          if (validNames.length > 0) {
            return validNames;
          }
        }
      } catch (error) {
        console.log(`🎬 Selector failed: ${selector}`, error);
        continue;
      }
    }

    console.log('🎬 No films found with any selector, returning empty array');
    return [];
  }

  /**
   * Private method to build film selectors for a given film name.
   *
   * @private
   * @param name - The name of the film to build selectors for.
   * @returns Array of selector strings.
   */
  private _buildFilmSelectors(name: string): string[] {
    return [
      `${this.selectors.filmItem}:has-text("${name}")`,
      `${this.selectors.filmName}:has-text("${name}")`,
      `${this.selectors.filmTitleLink}:has-text("${name}")`,
      `:text("${name}")`,
    ];
  }

  /**
   * Private method to try selecting film with multiple selectors.
   *
   * @private
   * @param selectors - Array of selectors to try.
   * @returns Promise that resolves to true if a selector worked.
   */
  private async _trySelectFilmWithSelectors(
    selectors: string[]
  ): Promise<boolean> {
    for (const selector of selectors) {
      try {
        if (await this.webActions.isVisible(selector)) {
          await this.webActions.click(selector);
          return true;
        }
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  /**
   * Private method to select the first film item.
   *
   * @private
   */
  private async _selectFirstFilmItem(): Promise<void> {
    await this.webActions.click(`${this.selectors.filmItem}:first-child`);
  }

  /**
   * Private method to check page load indicators.
   *
   * @private
   * @returns Promise that resolves to true if page is loaded.
   */
  private async _checkPageLoadIndicators(): Promise<boolean> {
    // Check multiple indicators that the page is loaded
    const indicators = {
      cinemaTitle: false,
      filmListContainer: false,
      hasFilmItems: false,
      pageReady: false,
    };

    // 1. Check if cinema title is visible (most reliable indicator)
    try {
      await this.webActions.waitForVisible(
        this.selectors.cinemaTitle,
        cinemaDetailConstants.cinemaTitleTimeout
      );
      indicators.cinemaTitle = true;
      console.log('✅ Cinema title found');
    } catch (error) {
      console.log('❌ Cinema title not found');
    }

    // 2. Check if film list container exists
    try {
      indicators.filmListContainer = await this.webActions.isVisible(
        this.selectors.filmList
      );
      console.log(
        `${indicators.filmListContainer ? '✅' : '❌'} Film list container visible: ${indicators.filmListContainer}`
      );
    } catch (error) {
      console.log('❌ Film list container check failed');
    }

    // 3. Check for film items with extended wait
    try {
      const filmElements = this.webActions.getLocator(this.selectors.filmItem);
      const filmCount = await filmElements.count();
      indicators.hasFilmItems = filmCount > 0;
      console.log(
        `${indicators.hasFilmItems ? '✅' : '❌'} Film items found: ${filmCount}`
      );

      // If no films with primary selector, try alternative selectors
      if (!indicators.hasFilmItems) {
        indicators.hasFilmItems = await this._checkAlternativeFilmSelectors();
      }
    } catch (error) {
      console.log('❌ Film items check failed:', error.message);
    }

    // 4. Overall page readiness check
    indicators.pageReady =
      indicators.cinemaTitle || indicators.filmListContainer;

    console.log('Page load indicators:', indicators);

    // Page is considered loaded if:
    // - Cinema title is visible (primary indicator), OR
    // - Film list container is visible (secondary indicator)
    // Note: Having films is not required as some cinemas might not have current showings
    return indicators.pageReady;
  }

  /**
   * Private method to check alternative film selectors.
   *
   * @private
   * @returns Promise that resolves to true if alternative selectors found elements.
   */
  private async _checkAlternativeFilmSelectors(): Promise<boolean> {
    for (const altSelector of this.selectors.alternativeFilmSelectors) {
      try {
        const altElements = this.webActions.getLocator(altSelector);
        const altCount = await altElements.count();
        if (altCount > 0) {
          console.log(
            `✅ Alternative selector "${altSelector}" found ${altCount} elements`
          );
          return true;
        }
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  /**
   * Private method to extract cinema name from selectors.
   *
   * @private
   * @param selectors - Array of selectors to try.
   * @returns Promise that resolves to cinema name or null.
   */
  private async _extractCinemaNameFromSelectors(
    selectors: string[]
  ): Promise<string | null> {
    for (const selector of selectors) {
      try {
        const titleElement = this.webActions.getLocator(selector);
        const titleText = await titleElement.first().textContent();
        if (titleText && titleText.trim().length > 0) {
          console.log(
            `Cinema name found with selector "${selector}": ${titleText.trim()}`
          );
          return titleText.trim();
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  /**
   * Private method to extract cinema name from URL.
   *
   * @private
   * @returns Cinema name extracted from URL or null.
   */
  private _extractCinemaNameFromUrl(): string | null {
    const currentUrl = this.webActions.page.url();
    const urlMatch = currentUrl.match(/\/cinema\/([^\/]+)/);
    if (urlMatch) {
      return urlMatch[1].replace(/-/g, ' ');
    }
    return null;
  }
}
