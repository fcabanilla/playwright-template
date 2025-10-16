// cinemaDetail.page.ts
import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  cinemaDetailSelectors,
  CinemaDetailSelectors,
} from './cinemaDetail.selectors';
/**
 * Represents the Cinema Detail page.
 * Provides methods to interact with the film list and showtime elements.
 */
export class CinemaDetail {
  readonly page: Page;
  readonly selectors: CinemaDetailSelectors;

  /**
   * Creates a new CinemaDetail instance.
   * @param page - The Playwright page object to interact with.
   */
  constructor(page: Page) {
    this.page = page;
    this.selectors = cinemaDetailSelectors;
  }

  /**
   * Retrieves a list of all film names displayed on the cinema detail page.
   * Waits until the film list and at least one film name are visible.
   * @returns Promise that resolves to an array of film names.
   */
  async getFilmNames(): Promise<string[]> {
    return await allure.test.step(
      'Getting list of film names from cinema detail page',
      async () => {
        const filmListLocator = this.page.locator(this.selectors.filmList);
        await filmListLocator
          .first()
          .waitFor({ state: 'visible', timeout: 50000 });

        const filmNameLocator = this.page.locator(this.selectors.filmName);
        await filmNameLocator
          .first()
          .waitFor({ state: 'visible', timeout: 50000 });

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

          const normalShowtimes = await filmContainer.locator(this.selectors.showtime).filter({
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
              has: this.page.locator(this.selectors.filmName, { hasText: name }),
            });

            const anyShowtimes = await filmContainer.locator(this.selectors.showtime);
            if ((await anyShowtimes.count()) > 0) {
              filmsWithNormalShowtimes.push(name);
            }
          }

          if (filmsWithNormalShowtimes.length === 0) {
            throw new Error('No films with any showtimes found on the cinema detail page');
          }
        }

        const randomIndex = Math.floor(Math.random() * filmsWithNormalShowtimes.length);
        const selectedFilm = filmsWithNormalShowtimes[randomIndex];
        await this.selectFilmByName(selectedFilm);
        console.log(`Selected film: ${selectedFilm}`);
        return selectedFilm;
      }
    );
  }

  /**
   * Retrieves a list of showtime texts available for the currently selected film.
   * @param filmName - The name of the film for which to retrieve showtimes.
   * @returns Promise that resolves to an array of showtime texts.
   * @throws Error if no showtimes are found for the selected film.
   * @throws Error if the film name is not provided.
   */

  async getShowtimesForFilm(filmName: string): Promise<string[]> {
    return await allure.test.step(
      'Getting list of showtimes for the selected film',
      async () => {
        // Obtiene el contenedor del film filtrando por el nombre de la película
        const filmContainer = this.page.locator(this.selectors.filmItem, {
          has: this.page.locator(this.selectors.filmName, {
            hasText: filmName,
          }),
        });
        // Dentro de ese contenedor, busca los elementos de showtime
        const showtimeLocator = filmContainer.locator(this.selectors.showtime);
        await showtimeLocator
          .first()
          .waitFor({ state: 'visible', timeout: 50000 });
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
   * Selects a random "normal" showtime (without special attributes like "Vose", "iSense", or "D-BOX").
   * @param filmName - The name of the film for which to retrieve showtimes.
   * @returns Promise that resolves to the text of the selected showtime.
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
        await showtimeLocator.first().waitFor({ state: 'visible', timeout: 50000 });

        // Filter out showtimes with special attributes
        const normalShowtimes = await showtimeLocator.filter({
          hasNot: this.page.locator('.v-attribute__icon--type-standard, .v-attribute__icon--type-hero'),
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

        const randomIndex = Math.floor(Math.random() * normalShowtimeTexts.length);
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
          has: this.page.locator(this.selectors.filmName, { hasText: selectedFilm }),
        });
        const filmTitleLink = filmContainer.locator(this.selectors.filmTitleLink);
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
  async selectDBoxRandomFilmAndShowtime(): Promise<{ film: string; showtime: string }> {
    return await allure.test.step('Selecting a random D-BOX film and showtime', async () => {
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
        const dboxShowtimes = await filmContainer.locator(this.selectors.showtime).filter({
          has: this.page.locator(this.selectors.dboxIcon),
        });

        if ((await dboxShowtimes.count()) > 0) {
          await this.selectFilmByName(name);
          const showtimeTexts = await dboxShowtimes.allTextContents();
          const randomIndex = Math.floor(Math.random() * showtimeTexts.length);
          const selectedShowtime = showtimeTexts[randomIndex];
          await dboxShowtimes.nth(randomIndex).click();
          console.log("film: " + name + " showtime: " + selectedShowtime);
          return { film: name, showtime: selectedShowtime };
        }
      }

      throw new Error('No D-BOX films with showtimes found on the cinema detail page');
    });
  }

  /**
   * Extracts and returns the cinema schema JSON-LD data from the page.
   * @returns Promise that resolves to the cinema schema data.
   */
  async extractCinemaSchema(): Promise<any> {
    return await allure.test.step('Extracting cinema schema from page', async () => {
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
      const reactHelmetJsonLd = this.page.locator('script[data-react-helmet="true"][type="application/ld+json"]');
      const reactHelmetCount = await reactHelmetJsonLd.count();
      if (reactHelmetCount > 0) {
        const scriptContent = await reactHelmetJsonLd.first().textContent();
        if (!scriptContent) {
          throw new Error('React Helmet cinema schema script content is empty');
        } 
        try {
          return JSON.parse(scriptContent);
        } catch (error) {
          throw new Error(`Failed to parse React Helmet cinema schema JSON: ${error}`);
        }
      }      
      const jsonLdScripts = this.page.locator('script[type="application/ld+json"]');
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
    });
  }
}
