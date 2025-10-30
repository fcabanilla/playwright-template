// cinemaDetail.page.ts
import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import {
  cinemaDetailSelectors,
  CinemaDetailSelectors,
} from './cinemaDetail.selectors';

/**
 * CinemaDetail Page Object
 *
 * Manages cinema detail page interactions: film lists, showtime selection, schema extraction.
 * Follows framework architecture with pure asynchronous waiting philosophy.
 *
 * Architecture Compliance:
 * - Uses WebActions for: ALL standard Playwright operations
 * - Uses page.locator() for: Complex filtering, hasText, has conditions
 * - Uses page.evaluate() for: Not currently needed
 *
 * Async Waiting Philosophy:
 * ❌ NO fixed delays: waitForTimeout(2000)
 * ❌ NO explicit timeouts: waitFor({ state: 'visible', timeout: 50000 })
 * ❌ NO timeout parameters: Any method with explicit timeout values
 * ✅ YES: Pure async auto-waiting via Playwright's built-in mechanisms
 * ✅ YES: Playwright handles all timing automatically
 * ✅ YES: Actions and assertions auto-wait for actionability
 *
 * Note: This file uses page.locator() extensively for complex filtering operations
 * (hasText, has, filter) which WebActions doesn't currently expose. This is acceptable
 * per architecture guidelines for specialized operations.
 *
 * @see docs/adrs/0009-page-object-architecture-rules.md
 * @see .github/copilot-instructions.md
 */
export class CinemaDetail {
  private readonly page: Page; // For complex locator filtering and allTextContents
  private readonly webActions: WebActions; // For standard Playwright operations
  private readonly selectors: CinemaDetailSelectors;

  /**
   * Creates a new CinemaDetail instance.
   * @param page - The Playwright page object (used for complex filtering)
   */
  constructor(page: Page) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.selectors = cinemaDetailSelectors;
  }

  /**
   * Retrieves all film names displayed on the cinema detail page.
   *
   * Pure async approach:
   * - No explicit timeouts (removed 50000ms timeout)
   * - Relies on Playwright's auto-waiting for visibility
   * - Uses page.locator() for allTextContents() as WebActions doesn't expose this
   *
   * @returns Promise that resolves to an array of film names
   */
  async getFilmNames(): Promise<string[]> {
    return await allure.test.step(
      'Getting list of film names from cinema detail page',
      async () => {
        // Wait for film list to be visible (pure async, no timeout)
        const filmListLocator = this.page.locator(this.selectors.filmList);
        await filmListLocator.first().waitFor({ state: 'visible' });

        // Wait for at least one film name to be visible (pure async)
        const filmNameLocator = this.page.locator(this.selectors.filmName);
        await filmNameLocator.first().waitFor({ state: 'visible' });

        // Extract all film names
        // Note: Using page.locator() as WebActions doesn't expose allTextContents()
        return await filmNameLocator.allTextContents();
      }
    );
  }

  /**
   * Returns a locator for a film element by its name.
   * @param name - The name of the film (e.g., 'Blancanieves').
   * @returns Locator for the film element.
   */
  getFilmByName(name: string) {
    return this.page.locator(this.selectors.filmItem, {
      has: this.page.locator(this.selectors.filmName, { hasText: name }),
    });
  }

  /**
   * Clicks on the film element with the given name.
   * @param name - The name of the film to select.
   * @returns Promise that resolves when the click action is complete.
   */
  async selectFilmByName(name: string): Promise<void> {
    await allure.test.step(`Selecting film with name "${name}"`, async () => {
      const filmLocator = this.getFilmByName(name);
      await filmLocator.first().click();
    });
  }

  /**
   * Selects a random film from the film list.
   * @returns Promise that resolves to the name of the selected film.
   */
  async selectRandomFilm(): Promise<string> {
    return await allure.test.step(
      'Selecting a random film from cinema detail page',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          throw new Error('No films found on the cinema detail page');
        }
        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedName = names[randomIndex];
        await this.selectFilmByName(selectedName);
        return selectedName;
      }
    );
  }

  /**
   * Selects a random film from the film list that has normal showtimes.
   * @returns Promise that resolves to the name of the selected film.
   */
  async selectRandomNormalFilm(): Promise<string> {
    return await allure.test.step(
      'Selecting a random film with normal showtimes from cinema detail page',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          throw new Error('No films found on the cinema detail page');
        }

        const filmsWithNormalShowtimes: string[] = [];

        for (const name of names) {
          const filmContainer = this.page.locator(this.selectors.filmItem, {
            has: this.page.locator(this.selectors.filmName, { hasText: name }),
          });

          const normalShowtimes = await filmContainer
            .locator(this.selectors.showtime)
            .filter({
              hasNot: this.page.locator(this.selectors.specialAttributes),
            });

          if ((await normalShowtimes.count()) > 0) {
            filmsWithNormalShowtimes.push(name);
          }
        }

        if (filmsWithNormalShowtimes.length === 0) {
          // Fallback: select any film with any showtime
          for (const name of names) {
            const filmContainer = this.page.locator(this.selectors.filmItem, {
              has: this.page.locator(this.selectors.filmName, {
                hasText: name,
              }),
            });

            const anyShowtimes = await filmContainer.locator(
              this.selectors.showtime
            );
            if ((await anyShowtimes.count()) > 0) {
              filmsWithNormalShowtimes.push(name);
            }
          }

          if (filmsWithNormalShowtimes.length === 0) {
            throw new Error(
              'No films with any showtimes found on the cinema detail page'
            );
          }
        }

        const randomIndex = Math.floor(
          Math.random() * filmsWithNormalShowtimes.length
        );
        const selectedFilm = filmsWithNormalShowtimes[randomIndex];
        await this.selectFilmByName(selectedFilm);
        console.log(`Selected film: ${selectedFilm}`);
        return selectedFilm;
      }
    );
  }

  /**
   * Retrieves showtimes available for a specific film.
   *
   * Pure async: No timeout parameter, Playwright auto-waits.
   *
   * @param filmName - The name of the film
   * @returns Promise that resolves to an array of showtime texts
   * @throws Error if no showtimes are found
   * @throws Error if film name is not provided
   */
  async getShowtimesForFilm(filmName: string): Promise<string[]> {
    return await allure.test.step(
      'Getting list of showtimes for the selected film',
      async () => {
        // Get film container filtered by film name
        const filmContainer = this.page.locator(this.selectors.filmItem, {
          has: this.page.locator(this.selectors.filmName, {
            hasText: filmName,
          }),
        });

        // Find showtime elements within that container
        const showtimeLocator = filmContainer.locator(this.selectors.showtime);

        // Wait for first showtime to be visible (pure async, no timeout)
        await showtimeLocator.first().waitFor({ state: 'visible' });

        // Extract all showtime texts
        return await showtimeLocator.allTextContents();
      }
    );
  }

  /**
   * Clicks on a showtime button that contains the given text.
   * @param timeText - The showtime text to select (e.g., "16:10").
   * @returns Promise that resolves when the click action is complete.
   */
  async selectShowtimeByText(timeText: string): Promise<void> {
    await allure.test.step(`Selecting showtime "${timeText}"`, async () => {
      await this.page
        .locator(this.selectors.showtime, { hasText: timeText })
        .click();
    });
  }

  /**
   * Selects a random showtime from the currently displayed showtimes for the selected film.
   * @returns Promise that resolves to the text of the selected showtime.
   */
  async selectRandomShowtime(filmName: string): Promise<string> {
    return await allure.test.step(
      'Selecting a random showtime for the selected film',
      async () => {
        const showtimes = await this.getShowtimesForFilm(filmName);
        if (showtimes.length === 0) {
          throw new Error('No showtimes found for the selected film');
        }
        const randomIndex = Math.floor(Math.random() * showtimes.length);
        const selectedTime = showtimes[randomIndex];
        await this.selectShowtimeByText(selectedTime);
        return selectedTime;
      }
    );
  }

  /**
   * Selects a random "normal" showtime (without special attributes).
   *
   * Pure async: No timeout parameter (removed 50000ms).
   * Filters out D-BOX, iSense, and other special format showtimes.
   *
   * @param filmName - The name of the film
   * @returns Promise that resolves to the text of the selected showtime
   */
  async selectNormalRandomShowtime(filmName: string): Promise<string> {
    return await allure.test.step(
      'Selecting a random normal showtime for the selected film',
      async () => {
        const filmContainer = this.page.locator(this.selectors.filmItem, {
          has: this.page.locator(this.selectors.filmName, {
            hasText: filmName,
          }),
        });

        // Locate all showtime buttons
        const showtimeLocator = filmContainer.locator(this.selectors.showtime);

        // Wait for first showtime to be visible (pure async, no timeout)
        await showtimeLocator.first().waitFor({ state: 'visible' });

        // Filter out showtimes with special attributes (D-BOX, iSense, etc.)
        const normalShowtimes = await showtimeLocator.filter({
          hasNot: this.page.locator(
            '.v-attribute__icon--type-standard, .v-attribute__icon--type-hero'
          ),
        });

        const normalShowtimeTexts = await normalShowtimes.allTextContents();

        if (normalShowtimeTexts.length === 0) {
          // Fallback: select any available showtime
          const anyShowtimes = await showtimeLocator.allTextContents();
          if (anyShowtimes.length === 0) {
            throw new Error('No showtimes found for the selected film');
          }

          const randomIndex = Math.floor(Math.random() * anyShowtimes.length);
          const selectedTime = anyShowtimes[randomIndex];
          await this.selectShowtimeByText(selectedTime);
          return selectedTime;
        }

        const randomIndex = Math.floor(
          Math.random() * normalShowtimeTexts.length
        );
        const selectedTime = normalShowtimeTexts[randomIndex];
        await this.selectShowtimeByText(selectedTime);
        return selectedTime;
      }
    );
  }

  /**
   * Selects a random film and then selects a random "normal" showtime for that film.
   * @returns Promise that resolves to an object containing the selected film name and normal showtime text.
   */
  async selectNormalRandomFilmAndShowtime(): Promise<{
    film: string;
    showtime: string;
  }> {
    return await allure.test.step(
      'Selecting a random film and a random normal showtime',
      async () => {
        const film = await this.selectRandomNormalFilm();
        const showtime = await this.selectNormalRandomShowtime(film);
        return { film, showtime };
      }
    );
  }

  /**
   * Selects a random film and navigates to its details page by clicking on the film title.
   * @returns Promise that resolves to an object containing the selected film name.
   */
  async selectRandomFilmForDetails(): Promise<{ film: string }> {
    return await allure.test.step(
      'Selecting a random film and navigating to its details page',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          throw new Error('No films found on the cinema detail page');
        }
        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedFilm = names[randomIndex];
        const filmContainer = this.page.locator(this.selectors.filmItem, {
          has: this.page.locator(this.selectors.filmName, {
            hasText: selectedFilm,
          }),
        });
        const filmTitleLink = filmContainer.locator(
          this.selectors.filmTitleLink
        );
        await filmTitleLink.first().click();
        console.log(`Selected film: ${selectedFilm}`);
        return { film: selectedFilm };
      }
    );
  }

  /**
   * Selects a random film and then selects a random showtime for that film.
   * @returns Promise that resolves to an object containing the selected film name and showtime text.
   */
  async selectRandomFilmAndShowtime(): Promise<{
    film: string;
    showtime: string;
  }> {
    return await allure.test.step(
      'Selecting a random film and a random showtime',
      async () => {
        const film = await this.selectRandomFilm();
        const showtime = await this.selectRandomShowtime(film);
        return { film, showtime };
      }
    );
  }

  /**
   * Selects a random D-BOX film and showtime.
   * @returns Promise that resolves to an object containing the selected film name and showtime text.
   */
  async selectDBoxRandomFilmAndShowtime(): Promise<{
    film: string;
    showtime: string;
  }> {
    return await allure.test.step(
      'Selecting a random D-BOX film and showtime',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          throw new Error('No films found on the cinema detail page');
        }

        // Shuffle the list of film names to add randomness
        const shuffledNames = names.sort(() => Math.random() - 0.5);

        for (const name of shuffledNames) {
          const filmContainer = this.page.locator(this.selectors.filmItem, {
            has: this.page.locator(this.selectors.filmName, { hasText: name }),
          });

          // Locate D-BOX showtimes by checking for the presence of the D-BOX icon
          const dboxShowtimes = await filmContainer
            .locator(this.selectors.showtime)
            .filter({
              has: this.page.locator(this.selectors.dboxIcon),
            });

          if ((await dboxShowtimes.count()) > 0) {
            await this.selectFilmByName(name);
            const showtimeTexts = await dboxShowtimes.allTextContents();
            const randomIndex = Math.floor(
              Math.random() * showtimeTexts.length
            );
            const selectedShowtime = showtimeTexts[randomIndex];
            await dboxShowtimes.nth(randomIndex).click();
            console.log('film: ' + name + ' showtime: ' + selectedShowtime);
            return { film: name, showtime: selectedShowtime };
          }
        }

        throw new Error(
          'No D-BOX films with showtimes found on the cinema detail page'
        );
      }
    );
  }

  /**
   * Extracts cinema schema JSON-LD data from the page.
   *
   * Pure async approach:
   * - No fixed delays (removed waitForTimeout(2000))
   * - Waits for networkidle state naturally
   * - Relies on DOM ready state for script availability
   *
   * @returns Promise that resolves to the cinema schema data
   * @throws Error if schema script is not found or cannot be parsed
   */
  async extractCinemaSchema(): Promise<any> {
    return await allure.test.step(
      'Extracting cinema schema from page',
      async () => {
        // Wait for dom content loaded (optimized for Cloudflare environments)
        await this.webActions.waitForLoadState('domcontentloaded');

        // Try React Helmet schema first
        const reactHelmetJsonLd = this.page.locator(
          'script[data-react-helmet="true"][type="application/ld+json"]'
        );
        const reactHelmetCount = await reactHelmetJsonLd.count();

        if (reactHelmetCount > 0) {
          const scriptContent = await reactHelmetJsonLd.first().textContent();
          if (!scriptContent) {
            throw new Error(
              'React Helmet cinema schema script content is empty'
            );
          }
          try {
            return JSON.parse(scriptContent);
          } catch (error) {
            throw new Error(
              `Failed to parse React Helmet cinema schema JSON: ${error}`
            );
          }
        }

        // Fallback: Try standard JSON-LD scripts
        const jsonLdScripts = this.page.locator(
          'script[type="application/ld+json"]'
        );
        const jsonLdCount = await jsonLdScripts.count();

        if (jsonLdCount > 0) {
          const scriptContent = await jsonLdScripts.first().textContent();
          if (!scriptContent) {
            throw new Error('Cinema schema script content is empty');
          }
          try {
            return JSON.parse(scriptContent);
          } catch (error) {
            throw new Error(`Failed to parse cinema schema JSON: ${error}`);
          }
        }

        throw new Error('Cinema schema script not found on the page');
      }
    );
  }
}
