import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { cinemaSelectors, CinemaSelectors } from './cinema.selectors';
import { cinemasData } from '../../../tests/cinesa/cinemas/cinemas.data';

/**
 * Represents the Cinesa cinema selection page.
 * Provides methods to interact with cinema list elements.
 */
export class Cinema {
  /**
   * WebActions instance to interact with Playwright.
   */
  private readonly webActions: WebActions;

  /**
   * Selectors for cinema page elements.
   */
  readonly selectors: CinemaSelectors;

  /**
   * Creates a new Cinema instance.
   * @param webActions - The WebActions instance to interact with Playwright.
   */
  constructor(webActions: WebActions) {
    this.webActions = webActions;
    this.selectors = cinemaSelectors;
  }

  /**
   * Get page instance for complex operations that need direct access
   * NOTE: This is temporary bridge during ADR-0009 migration
   * TODO: Migrate all operations to use WebActions methods
   */
  private get page() {
    return this.webActions.getPage();
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
    await allure.step(`Selecting cinema with name "${name}"`, async () => {
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
    return await allure.step('Getting list of cinema names', async () => {
      await this.page.waitForSelector(this.selectors.cinemaElement, {
        state: 'attached',
        timeout: 10000,
      });

      const container = this.getContainer();
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
    return await allure.step('Selecting a random cinema', async () => {
      await this.page.waitForSelector(this.selectors.cinemaElement, {
        state: 'attached',
        timeout: 10000,
      });

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

  /**
   * Selects the Oasiz cinema.
   *
   * @returns Promise that resolves to the name of the selected cinema.
   */
  async selectOasizCinema(): Promise<string> {
    return await allure.step('Selecting Oasiz cinema', async () => {
      await this.page.fill(this.selectors.filterInput, cinemasData.oasiz);
      await this.page.waitForTimeout(1000);
      const cinemaElement = this.getContainer().locator(this.selectors.cinemaElement).first();
      await cinemaElement.click();
      return cinemasData.oasiz;
    });
  }

  async selectSantanderCinema(): Promise<string> {
    return await allure.step('Selecting Santander cinema', async () => {
      await this.page.fill(this.selectors.filterInput, cinemasData.santander);
      await this.page.waitForTimeout(1000);
      const cinemaElement = this.getContainer().locator(this.selectors.cinemaElement).first();
      await cinemaElement.click();
      return cinemasData.santander;
    });
  }

  async selectGrancasaCinema(): Promise<string> {
    return await allure.step('Selecting Grancasa cinema', async () => {
      await this.page.fill(this.selectors.filterInput, cinemasData.grancasa);
      await this.page.waitForTimeout(1000);
      const cinemaElement = this.getContainer().locator(this.selectors.cinemaElement).first();
      await cinemaElement.click();
      return cinemasData.grancasa;
    });
  }
}
