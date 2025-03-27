import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { cinemaSelectors, CinemaSelectors } from './cinema.selectors';

/**
 * Represents the Cinesa cinema selection page.
 * Provides methods to interact with cinema list elements.
 */
export class Cinema {
  /**
   * Playwright page instance to interact with.
   */
  readonly page: Page;

  /**
   * Selectors for cinema page elements.
   */
  readonly selectors: CinemaSelectors;

  /**
   * Creates a new Cinema instance.
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = cinemaSelectors;
  }

  /**
   * Returns the locator for the cinema list container.
   *
   * @returns Locator of the cinema list container.
   */
  getContainer() {
    return this.page.locator(this.selectors.container);
  }

  /**
   * Returns a locator for the cinema element by its name.
   *
   * @param name - The name of the cinema (e.g., 'As Cancelas').
   * @returns Locator for the cinema element.
   */
  getCinemaByName(name: string) {
    return this.page.locator(this.selectors.cinemaElement, {
      has: this.page.locator(this.selectors.cinemaName, { hasText: name }),
    });
  }

  /**
   * Clicks on the cinema element with the given name.
   *
   * @param name - The name of the cinema to select.
   * @returns Promise that resolves when the click action is complete.
   */
  async selectCinemaByName(name: string): Promise<void> {
    await allure.test.step(`Selecting cinema with name "${name}"`, async () => {
      const cinema = this.getCinemaByName(name);
      await cinema.first().click();
    });
  }

  /**
   * Retrieves a list of all cinema names displayed on the page.
   *
   * @returns Promise that resolves to an array of cinema names.
   */
  async getCinemaNames(): Promise<string[]> {
    return await allure.test.step('Getting list of cinema names', async () => {
      const container = this.getContainer();
      // Wait for the container to be visible before extracting the names.
      await container.waitFor({ state: 'visible', timeout: 50000 });
      return await container
        .locator(this.selectors.cinemaName)
        .allTextContents();
    });
  }

  /**
   * Selects a random cinema from the list.
   *
   * @returns Promise that resolves to the name of the selected cinema.
   */
  async selectRandomCinema(): Promise<string> {
    return await allure.test.step('Selecting a random cinema', async () => {
      const names = await this.getCinemaNames();
      if (names.length === 0) {
        throw new Error('No cinemas found');
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
    const names = await this.page
      .locator(this.selectors.cinemaName)
      .allTextContents();
    console.log('Cinema Names:', names);
    return names;
  }
}
