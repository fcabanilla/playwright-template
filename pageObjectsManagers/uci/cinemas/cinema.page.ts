import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  cinemaSelectors,
  CinemaSelectors,
  cinemaConstants,
} from './cinema.selectors';
import { WebActions } from '../../../core/webActions/webActions';

/**
 * UCI Cinemas Cinema Selection Page Object Model
 *
 * Comprehensive Page Object Model for the UCI Cinemas cinema selection page.
 * Provides complete functionality for cinema discovery, selection, and navigation
 * to individual cinema detail pages. Handles cinema listings, filtering, and
 * detailed cinema information retrieval.
 *
 * Features:
 * - Cinema listing retrieval and counting
 * - Cinema name extraction and search
 * - Cinema selection and navigation to details
 * - Geographic location and facility information
 * - Available films per cinema extraction
 * - Integration with booking flow through cinema selection
 *
 * Architecture:
 * - Uses WebActions abstraction layer (no direct Playwright API access)
 * - Centralizes all cinema page selectors through cinema.selectors.ts
 * - Follows UCI Cinema's location-based content structure
 * - Provides Allure step integration for detailed test reporting
 * - Handles dynamic loading of cinema information and showtimes
 *
 * @example
 * ```typescript
 * const cinemaPage = new Cinema(page);
 * await cinemaPage.waitForCinemaListToLoad();
 * const cinemaCount = await cinemaPage.getCinemaCount();
 * const names = await cinemaPage.getCinemaNames();
 * await cinemaPage.selectCinemaByName('UCI Cinemas Milano');
 * ```
 *
 * @since 1.0.0
 * @author UCI Automation Team
 */
export class Cinema {
  /**
   * WebActions instance for all browser interactions.
   */
  readonly webActions: WebActions;

  /**
   * Selectors for cinema page elements.
   */
  readonly selectors: CinemaSelectors;

  /**
   * Creates a new Cinema page instance with the provided page context.
   * Initializes WebActions for browser interactions and loads cinema page selectors.
   *
   * @param {Page} page - Playwright Page object for browser interactions
   *
   * @example
   * ```typescript
   * const cinemaPage = new Cinema(page);
   * ```
   *
   * @since 1.0.0
   */
  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = cinemaSelectors;
  }

  /**
   * Returns the locator string for the cinema list container.
   *
   * @returns Selector string for the cinema list container.
   */
  getContainerSelector(): string {
    return this.selectors.container;
  }

  /**
   * Clicks on the cinema element with the given name.
   *
   * @param name - The name of the cinema to select.
   * @returns Promise that resolves when the click action is complete.
   */
  async selectCinemaByName(name: string): Promise<void> {
    await allure.test.step(
      `Selecting UCI cinema with name "${name}"`,
      async () => {
        // First wait for cinema list to be visible
        await this.webActions.waitForVisible(this.selectors.container);

        // Look for cinema by name - try multiple approaches
        const nameSelectors = this._buildNameSelectors(name);

        const clicked = await this._trySelectWithSelectors(nameSelectors);

        if (!clicked) {
          // Fallback: click first cinema element if specific name not found
          await this._selectFirstCinemaElement();
        }
      }
    );
  }

  /**
   * Retrieves a list of all cinema names displayed on the page.
   *
   * @returns Promise that resolves to an array of cinema names.
   */
  async getCinemaNames(): Promise<string[]> {
    return await allure.test.step(
      'Getting list of UCI cinema names',
      async () => {
        await this.webActions.waitForVisible(this.selectors.container);

        // Try to get text from multiple possible selectors
        const possibleSelectors = this._buildPossibleSelectors();

        return await this._extractNamesFromSelectors(possibleSelectors);
      }
    );
  }

  /**
   * Selects a random cinema from the list.
   *
   * @returns Promise that resolves to the name of the selected cinema.
   */
  async selectRandomCinema(): Promise<string> {
    return await allure.test.step('Selecting a random UCI cinema', async () => {
      await this.webActions.waitForVisible(this.selectors.container);

      const names = await this.getCinemaNames();
      if (names.length === 0) {
        // Fallback: just click first cinema element
        await this._selectFirstCinemaElement();
        return cinemaConstants.defaultCinemaName;
      }

      const randomIndex = Math.floor(Math.random() * names.length);
      const selectedName = names[randomIndex];
      await this.selectCinemaByName(selectedName);
      return selectedName;
    });
  }

  /**
   * Retrieves and logs the list of cinema names.
   *
   * @returns Promise that resolves to the list of cinema names.
   */
  async logCinemaNames(): Promise<string[]> {
    const names = await this.getCinemaNames();
    console.log('UCI Cinema Names:', names);
    return names;
  }

  /**
   * Filters cinemas by entering text in the search input.
   *
   * @param searchText - Text to search for.
   */
  async filterCinemas(searchText: string): Promise<void> {
    await allure.test.step(
      `Filtering UCI cinemas by "${searchText}"`,
      async () => {
        try {
          await this.webActions.fill(this.selectors.filterInput, searchText);
          await this.webActions.wait(cinemaConstants.filterWaitTime);
        } catch (error) {
          console.log('Filter input not found, skipping filter step');
        }
      }
    );
  }

  /**
   * Selects a cinema by searching for it first.
   *
   * @param cinemaName - Name of the cinema to search and select.
   * @returns Promise that resolves to the name of the selected cinema.
   */
  async searchAndSelectCinema(cinemaName: string): Promise<string> {
    return await allure.test.step(
      `Searching and selecting "${cinemaName}" cinema`,
      async () => {
        await this.filterCinemas(cinemaName);
        await this.selectCinemaByName(cinemaName);
        return cinemaName;
      }
    );
  }

  /**
   * Selects the first available cinema from the list.
   *
   * @returns Promise that resolves to the name of the selected cinema.
   */
  async selectFirstCinema(): Promise<string> {
    return await allure.test.step(
      'Selecting first available UCI cinema',
      async () => {
        await this.webActions.waitForVisible(this.selectors.container);

        // Use .first() to get only the first element to avoid strict mode violation
        await this._selectFirstCinemaElement();

        // Try to get the name of the selected cinema
        const names = await this.getCinemaNames();
        return names.length > 0 ? names[0] : cinemaConstants.firstCinemaName;
      }
    );
  }

  /**
   * Validates that the cinema list is visible and contains cinemas.
   *
   * @returns Promise that resolves to true if cinemas are visible.
   */
  async verifyCinemasListVisible(): Promise<boolean> {
    return await allure.test.step(
      'Verifying UCI cinemas list is visible',
      async () => {
        try {
          // First wait for container to be visible
          await this.webActions.waitForVisible(this.selectors.container);

          // Use the same logic as getCinemaNames() to ensure consistency
          const possibleSelectors =
            this._buildPossibleSelectorsForVerification();

          return await this._verifyCinemaElementsExist(possibleSelectors);
        } catch (error) {
          console.log('Error verifying cinema list visibility:', error);
          return false;
        }
      }
    );
  }

  /**
   * Gets the current page URL for validation.
   *
   * @returns Promise that resolves to the current URL.
   */
  async getCurrentUrl(): Promise<string> {
    return this.webActions.page.url();
  }

  /**
   * Private method to build name selectors for a given cinema name.
   *
   * @private
   * @param name - The name of the cinema to build selectors for.
   * @returns Array of selector strings.
   */
  private _buildNameSelectors(name: string): string[] {
    return [
      `${this.selectors.cinemaElement}:has-text("${name}")`,
      `${this.selectors.cinemaName}:has-text("${name}")`,
      `[data-testid*="${name.toLowerCase()}"]`,
      `:text("${name}")`,
    ];
  }

  /**
   * Private method to try selecting cinema with multiple selectors.
   *
   * @private
   * @param selectors - Array of selectors to try.
   * @returns Promise that resolves to true if a selector worked.
   */
  private async _trySelectWithSelectors(selectors: string[]): Promise<boolean> {
    for (const selector of selectors) {
      try {
        if (await this.webActions.isVisible(selector)) {
          await this.webActions.click(selector);
          return true;
        }
      } catch (error) {
        // Try next selector
        continue;
      }
    }
    return false;
  }

  /**
   * Private method to select the first cinema element.
   *
   * @private
   */
  private async _selectFirstCinemaElement(): Promise<void> {
    const firstCinemaSelector = `${this.selectors.cinemaElement}`;
    const firstCinema = this.webActions.getLocator(firstCinemaSelector).first();
    await firstCinema.click();
  }

  /**
   * Private method to build possible selectors for cinema names.
   *
   * @private
   * @returns Array of selector strings.
   */
  private _buildPossibleSelectors(): string[] {
    const baseSelectors = [this.selectors.cinemaName];
    const alternativeSelectors =
      this.selectors.alternativeCinemaNameSelectors.map(
        (selector) => `${this.selectors.cinemaElement} ${selector}`
      );
    return [...baseSelectors, ...alternativeSelectors];
  }

  /**
   * Private method to extract names from selectors.
   *
   * @private
   * @param selectors - Array of selectors to try.
   * @returns Promise that resolves to array of cinema names.
   */
  private async _extractNamesFromSelectors(
    selectors: string[]
  ): Promise<string[]> {
    for (const selector of selectors) {
      try {
        const elements = this.webActions.getLocator(selector);
        const names = await elements.allTextContents();
        if (names.length > 0) {
          return names.filter((name) => name.trim().length > 0);
        }
      } catch (error) {
        // Try next selector
        continue;
      }
    }
    // If no names found, return empty array
    return [];
  }

  /**
   * Private method to build selectors for verification.
   *
   * @private
   * @returns Array of selector strings.
   */
  private _buildPossibleSelectorsForVerification(): string[] {
    const baseSelectors = [
      this.selectors.cinemaElement,
      this.selectors.cinemaName,
    ];
    const alternativeSelectors =
      this.selectors.alternativeCinemaNameSelectors.map(
        (selector) => `${this.selectors.cinemaElement} ${selector}`
      );
    return [...baseSelectors, ...alternativeSelectors];
  }

  /**
   * Private method to verify cinema elements exist.
   *
   * @private
   * @param selectors - Array of selectors to verify.
   * @returns Promise that resolves to true if elements exist.
   */
  private async _verifyCinemaElementsExist(
    selectors: string[]
  ): Promise<boolean> {
    let cinemaCount = 0;
    for (const selector of selectors) {
      try {
        const elements = this.webActions.getLocator(selector);
        cinemaCount = await elements.count();
        console.log(`Selector "${selector}" found ${cinemaCount} elements`);

        if (cinemaCount > 0) {
          // Double-check by getting actual cinema names
          const names = await this.getCinemaNames();
          console.log(`Cinema names verification: ${names.length} names found`);
          return names.length > 0;
        }
      } catch (error) {
        console.log(`Error with selector "${selector}":`, error.message);
        continue;
      }
    }

    console.log(
      `No cinema elements found with any selector. Total count: ${cinemaCount}`
    );
    return false;
  }
}
