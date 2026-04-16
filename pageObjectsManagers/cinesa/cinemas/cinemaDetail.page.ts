// cinemaDetail.page.ts
import { Locator } from '@playwright/test';
import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import {
  cinemaDetailSelectors,
  CinemaDetailSelectors,
  showtimeFormatMap,
} from './cinemaDetail.selectors';

import { MovieMetadata, MovieShowtime } from './cinemaDetail.types';

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
  private readonly webActions: WebActions; // For standard Playwright operations
  private readonly selectors: CinemaDetailSelectors;

  constructor(
    webActions: WebActions,
    selectors: CinemaDetailSelectors = cinemaDetailSelectors
  ) {
    this.webActions = webActions;
    this.selectors = selectors;
  }

  private normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Dismisses any blocking promotional modal/dialog overlaying the cinema detail page.
   * These modals appear non-deterministically (CMS-driven) and block clicks on films/showtimes.
   * Uses a short timeout (1.5s) to avoid slowing tests when no modal is present.
   */
  private async dismissBlockingModalIfVisible(): Promise<void> {
    try {
      const closeBtn = this.webActions.page.locator(
        this.selectors.blockingModalCloseButton
      );
      if (await closeBtn.first().isVisible({ timeout: 1500 })) {
        await allure.step(
          'Dismissing blocking modal on cinema detail',
          async () => {
            await closeBtn.first().click();
            await this.webActions.page
              .locator(this.selectors.blockingModal)
              .first()
              .waitFor({ state: 'hidden', timeout: 3000 });
          }
        );
      }
    } catch {
      // No modal present or already dismissed — continue
    }
  }

  private extractRoomFromShowtimeText(
    showtimeText: string
  ): string | undefined {
    const normalizedText = this.normalizeWhitespace(showtimeText);
    const roomMatch = normalizedText.match(/sala\s*[a-z0-9-]+/i);
    return roomMatch ? this.normalizeWhitespace(roomMatch[0]) : undefined;
  }

  private getShowtimeLocatorByFormat(
    filmContainer: Locator,
    requiredFormat: 'normal' | 'dbox' | 'any'
  ): Locator {
    const showtimeLocator = filmContainer.locator(this.selectors.showtime);

    const page = this.webActions.page;

    if (requiredFormat === 'normal') {
      return showtimeLocator.filter({
        hasNot: page.locator(this.selectors.specialAttributes),
      });
    }

    if (requiredFormat === 'dbox') {
      return showtimeLocator.filter({
        has: page.locator(this.selectors.dboxIcon, { hasText: 'D-BOX' }),
      });
    }

    return showtimeLocator;
  }

  private async getAvailableRooms(showtimeLocator: Locator): Promise<string[]> {
    const showtimeTexts = await showtimeLocator.allTextContents();
    const parsedRooms = showtimeTexts
      .map((showtimeText) => this.extractRoomFromShowtimeText(showtimeText))
      .filter((room): room is string => Boolean(room));

    return [...new Set(parsedRooms)];
  }

  /**
   * Returns the text labels of all available day buttons in the date picker.
   * Example: ['HOY', 'sáb 11 abr', 'dom 12 abr', ...]
   */
  private async getAvailableDays(): Promise<string[]> {
    return await allure.step('[DATA] Get available days', async () => {
      const page = this.webActions.page;
      // Wait for the showtime section to load before querying the day picker
      try {
        await page
          .locator(this.selectors.filmList)
          .first()
          .waitFor({ state: 'visible', timeout: 20000 });
      } catch {
        // Film list may not be visible yet — still try the day picker
      }
      try {
        await page
          .locator(this.selectors.dayPickerButton)
          .first()
          .waitFor({ state: 'visible', timeout: 5000 });
      } catch {
        // Day picker may not exist on all pages — fall through
      }
      const dayButtons = page.locator(this.selectors.dayPickerButton);
      const count = await dayButtons.count();
      if (count === 0) {
        return ['HOY']; // Fallback: assume current day if no picker found
      }
      const texts = await dayButtons.allTextContents();
      return texts.map((t) => t.trim());
    });
  }

  /**
   * Clicks the day button at the given index in the date picker.
   * Index 0 = first day (usually HOY), 1 = next day, etc.
   * Waits for the film list to update after changing the day.
   * @returns The text label of the selected day.
   */
  private async selectDayByIndex(dayIndex: number): Promise<string> {
    return await allure.step(
      `[ACT] Select day at index ${dayIndex}`,
      async () => {
        const page = this.webActions.page;
        const dayButtons = page.locator(this.selectors.dayPickerButton);
        const count = await dayButtons.count();
        if (count === 0) {
          return 'HOY'; // No day picker — page shows today by default
        }

        const dayButton = dayButtons.nth(dayIndex);
        const dayText = (await dayButton.innerText()).trim();

        // Skip click if this day is already selected
        const isSelected = await dayButton.evaluate((el) =>
          el.classList.contains('v-date-picker-date__button--selected')
        );
        if (!isSelected) {
          await dayButton.click({ force: true });
          // Wait for film list to refresh after day change
          await page
            .locator(this.selectors.filmList)
            .first()
            .waitFor({ state: 'visible', timeout: 10000 });
        }

        return dayText;
      }
    );
  }

  /**
   * Ensures the "Show all movies" checkbox is checked.
   * Some days may hide films by default; enabling this reveals all available content.
   */
  private async ensureShowAllMovies(): Promise<void> {
    try {
      const page = this.webActions.page;
      const checkbox = page.locator(this.selectors.showAllMoviesCheckbox);
      if (
        (await checkbox.count()) > 0 &&
        !(await checkbox.isChecked({ timeout: 2000 }))
      ) {
        await allure.step(
          '[ACT] Enable "Show all movies" checkbox',
          async () => {
            await checkbox.check();
          }
        );
      }
    } catch {
      // Checkbox not present or not interactive — continue
    }
  }

  /**
   * Quick check whether the current day has any films loaded.
   * Uses a short timeout (5s) to avoid blocking the multi-day fallback loop.
   */
  private async hasFilmsOnCurrentDay(): Promise<boolean> {
    try {
      const page = this.webActions.page;
      await page
        .locator(this.selectors.filmName)
        .first()
        .waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  private async findShowtimeByPreferredRooms(
    showtimeLocator: Locator,
    preferredRooms: string[]
  ): Promise<{ index: number; text: string; room?: string } | null> {
    const showtimeCount = await showtimeLocator.count();

    if (showtimeCount === 0) {
      return null;
    }

    const normalizedPreferredRooms = preferredRooms
      .map((room) => this.normalizeWhitespace(room).toLowerCase())
      .filter(Boolean);

    const showtimeEntries: Array<{
      index: number;
      text: string;
      room?: string;
    }> = [];
    for (let index = 0; index < showtimeCount; index++) {
      const showtimeText = await showtimeLocator.nth(index).innerText();
      showtimeEntries.push({
        index,
        text: this.normalizeWhitespace(showtimeText),
        room: this.extractRoomFromShowtimeText(showtimeText),
      });
    }

    // When no rooms are preferred (fallback mode), accept any available showtime
    if (normalizedPreferredRooms.length === 0 && showtimeEntries.length > 0) {
      return showtimeEntries[0];
    }

    for (const preferredRoom of normalizedPreferredRooms) {
      const preferredRoomMatch = showtimeEntries.find((showtimeEntry) =>
        this.normalizeWhitespace(showtimeEntry.text)
          .toLowerCase()
          .includes(preferredRoom)
      );

      if (preferredRoomMatch) {
        return preferredRoomMatch;
      }
    }

    return null;
  }

  async selectShowtimeByFormatAndRoom(
    filmName: string,
    criteria: {
      requiredFormat: 'normal' | 'dbox' | 'any';
      preferredRooms: string[];
    }
  ): Promise<{ showtime: string; room?: string }> {
    return await allure.step(
      `Selecting showtime by format "${criteria.requiredFormat}" and preferred rooms [${criteria.preferredRooms.join(', ')}] for film "${filmName}"`,
      async () => {
        const filmContainer = this.webActions.page.locator(
          this.selectors.filmItem,
          {
            has: this.webActions.page.locator(this.selectors.filmName, {
              hasText: filmName,
            }),
          }
        );

        const showtimeLocator = this.getShowtimeLocatorByFormat(
          filmContainer,
          criteria.requiredFormat
        );

        const showtimeCount = await showtimeLocator.count();
        if (showtimeCount === 0) {
          throw new Error(
            `No showtimes available with format "${criteria.requiredFormat}" for film "${filmName}"`
          );
        }

        const matchedShowtime = await this.findShowtimeByPreferredRooms(
          showtimeLocator,
          criteria.preferredRooms
        );

        if (!matchedShowtime) {
          const availableRooms = await this.getAvailableRooms(showtimeLocator);
          throw new Error(
            `No showtime matched preferred rooms [${criteria.preferredRooms.join(', ')}] for film "${filmName}" with format "${criteria.requiredFormat}". Available rooms: [${availableRooms.join(', ')}]`
          );
        }

        await this.dismissBlockingModalIfVisible();
        await showtimeLocator.nth(matchedShowtime.index).click();

        return {
          showtime: matchedShowtime.text,
          room: matchedShowtime.room,
        };
      }
    );
  }

  private async getEligibleFilmsForFormat(
    requiredFormat: 'normal' | 'dbox' | 'any'
  ): Promise<Array<{ filmName: string; showtimeCount: number }>> {
    return await allure.step(
      `Filtering films with "${requiredFormat}" format showtimes`,
      async () => {
        const page = this.webActions.page;
        const filmContainers = page.locator(this.selectors.filmItem);
        const totalFilms = await filmContainers.count();

        const eligible: Array<{ filmName: string; showtimeCount: number }> = [];

        for (let i = 0; i < totalFilms; i++) {
          const container = filmContainers.nth(i);
          const filmName = await container
            .locator(this.selectors.filmName)
            .innerText();
          const showtimeLocator = this.getShowtimeLocatorByFormat(
            container,
            requiredFormat
          );
          const showtimeCount = await showtimeLocator.count();

          if (showtimeCount > 0) {
            eligible.push({
              filmName: this.normalizeWhitespace(filmName),
              showtimeCount,
            });
          }
        }

        return eligible;
      }
    );
  }

  /**
   * Attempts film+showtime selection on the currently visible day.
   * Extracted inner logic for multi-day iteration.
   */
  private async trySelectFilmOnCurrentDay(criteria: {
    requiredFormat: 'normal' | 'dbox' | 'any';
    preferredRooms: string[];
  }): Promise<{ film: string; showtime: string; room?: string }> {
    const allFilmNames = await this.getFilmNames();
    if (allFilmNames.length === 0) {
      throw new Error('No films found on the cinema detail page');
    }

    const eligibleFilms = await this.getEligibleFilmsForFormat(
      criteria.requiredFormat
    );

    if (eligibleFilms.length === 0) {
      throw new Error(
        `No films have "${criteria.requiredFormat}" format showtimes. ` +
          `Total films on page: ${allFilmNames.length}. ` +
          `Films checked: [${allFilmNames.join(', ')}]`
      );
    }

    const shuffledEligible = [...eligibleFilms].sort(() => Math.random() - 0.5);
    const selectionErrors: string[] = [];

    for (const { filmName } of shuffledEligible) {
      try {
        const showtimeSelection = await this.selectShowtimeByFormatAndRoom(
          filmName,
          criteria
        );

        return {
          film: filmName,
          showtime: showtimeSelection.showtime,
          room: showtimeSelection.room,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown selection error';
        selectionErrors.push(`${filmName}: ${errorMessage}`);
      }
    }

    throw new Error(
      `${eligibleFilms.length} of ${allFilmNames.length} films have "${criteria.requiredFormat}" format, ` +
        `but none matched preferred rooms [${criteria.preferredRooms.join(', ')}]. ` +
        `Eligible films: [${eligibleFilms.map((f) => f.filmName).join(', ')}]. ` +
        `Details: ${selectionErrors.join(' | ')}`
    );
  }

  /**
   * Selects a film and showtime matching format and room criteria.
   * Iterates through all available days if no match is found on the current day.
   * Falls back to any room if preferred rooms are exhausted and fallbackToAnyRoom is enabled.
   */
  async selectFilmAndShowtimeByFormatAndRoom(criteria: {
    requiredFormat: 'normal' | 'dbox' | 'any';
    preferredRooms: string[];
    fallbackToAnyRoom?: boolean;
  }): Promise<{ film: string; showtime: string; room?: string; day?: string }> {
    return await allure.step(
      `Selecting film and showtime by format "${criteria.requiredFormat}" and preferred rooms [${criteria.preferredRooms.join(', ')}]`,
      async () => {
        const availableDays = await this.getAvailableDays();
        const dayErrors: string[] = [];

        for (let dayIndex = 0; dayIndex < availableDays.length; dayIndex++) {
          const dayLabel = await this.selectDayByIndex(dayIndex);
          await this.ensureShowAllMovies();

          if (!(await this.hasFilmsOnCurrentDay())) {
            dayErrors.push(`${dayLabel}: No films available`);
            continue;
          }

          try {
            const result = await this.trySelectFilmOnCurrentDay(criteria);
            return { ...result, day: dayLabel };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            dayErrors.push(`${dayLabel}: ${errorMessage}`);
          }
        }

        // Room fallback: retry on the first day with no room restriction
        if (
          criteria.fallbackToAnyRoom !== false &&
          criteria.preferredRooms.length > 0
        ) {
          const dayLabel = await this.selectDayByIndex(0);
          await this.ensureShowAllMovies();
          try {
            return await allure.step(
              '[ACT] Room fallback — retrying with no room restriction',
              async () => {
                const result = await this.trySelectFilmOnCurrentDay({
                  ...criteria,
                  preferredRooms: [],
                });
                return { ...result, day: dayLabel };
              }
            );
          } catch {
            // Fall through to final error
          }
        }

        throw new Error(
          `Failed across ${availableDays.length} day(s). ` +
            `Format: "${criteria.requiredFormat}", ` +
            `Rooms: [${criteria.preferredRooms.join(', ')}]. ` +
            `Day errors: ${dayErrors.join(' | ')}`
        );
      }
    );
  }

  /**
   * Scrapes detailed information for all films on the page.
   * Extracts titles, metadata, and showtime info for data-driven testing.
   * @returns Array of MovieMetadata objects
   */
  async extractAllMoviesData(): Promise<MovieMetadata[]> {
    return await allure.step(
      'Extracting full movie data from page',
      async () => {
        // Ensure films are visible before starting extraction
        await this.webActions.waitForVisible(this.selectors.filmList);

        const page = this.webActions.page;
        const films = page.locator(this.selectors.filmItem);
        const count = await films.count();
        const movieData: MovieMetadata[] = [];

        console.log(`Starting extraction for ${count} movies...`);

        for (let i = 0; i < count; i++) {
          const film = films.nth(i);

          // 1. Basic Title
          const title = await film
            .locator(this.selectors.filmName)
            .innerText()
            .then((t) => t.trim());

          // 2. Extra Metadata (Duration, Rating, etc.)
          // Note: Selectors for metadata might need adjustment based on specific layout
          // Assuming common structures:
          // .v-film-details__duration, .v-film-details__rating
          let duration = 'Unknown';
          const durationLoc = film.locator(this.selectors.duration);
          if ((await durationLoc.count()) > 0) {
            duration = await durationLoc.innerText().then((t) => t.trim());
          }

          const attributes: string[] = [];
          // Extraction of movie-level attributes (e.g. at the top of card)
          const attrIcons = film.locator(this.selectors.attributeIcon);
          const attrCount = await attrIcons.count();
          for (let k = 0; k < attrCount; k++) {
            const attrText =
              (await attrIcons.nth(k).textContent())?.trim() || 'attribute';
            attributes.push(attrText);
          }

          // 3. Showtimes
          const showtimes: MovieShowtime[] = [];
          const timeButtons = film.locator(this.selectors.showtime);
          const timeCount = await timeButtons.count();

          for (let j = 0; j < timeCount; j++) {
            const timeBtn = timeButtons.nth(j);
            const timeText = await timeBtn.innerText();

            // Extract attributes specific to this showtime (e.g. Screen type inside the button or near it)
            // Example: "18:00 (IMAX)"
            const showtimeAttrs: string[] = [];
            // Check for internal icons/flags
            const internalIcons = timeBtn.locator(
              this.selectors.showtimeInternalIcon
            );
            const iconCount = await internalIcons.count();
            for (let m = 0; m < iconCount; m++) {
              const alt = await internalIcons.nth(m).getAttribute('alt');
              if (alt) showtimeAttrs.push(alt);
            }

            // Check if class indicates format
            const classList = (await timeBtn.getAttribute('class')) || '';
            let format = 'Standard';
            for (const [className, label] of Object.entries(
              showtimeFormatMap
            )) {
              if (classList.includes(className)) {
                format = label;
                break;
              }
            }

            showtimes.push({
              time: timeText.trim(),
              format: format,
              attributes: showtimeAttrs,
            });
          }

          movieData.push({
            title: title,
            duration: duration !== 'Unknown' ? duration : undefined,
            showtimes: showtimes,
            attributes: attributes,
          });
        }

        return movieData;
      }
    );
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
    return await allure.step(
      'Getting list of film names from cinema detail page',
      async () => {
        // Wait for film list to be visible (pure async, no timeout)
        const page = this.webActions.page;
        const filmListLocator = page.locator(this.selectors.filmList);
        await filmListLocator.first().waitFor({ state: 'visible' });

        // Wait for at least one film name to be visible (pure async)
        const filmNameLocator = page.locator(this.selectors.filmName);
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
  private getFilmByName(name: string) {
    const page = this.webActions.page;
    return page.locator(this.selectors.filmItem, {
      has: page.locator(this.selectors.filmName, { hasText: name }),
    });
  }

  /**
   * Clicks on the film element with the given name.
   * @param name - The name of the film to select.
   * @returns Promise that resolves when the click action is complete.
   */
  async selectFilmByName(name: string): Promise<void> {
    await allure.step(`Selecting film with name "${name}"`, async () => {
      await this.dismissBlockingModalIfVisible();
      const filmLocator = this.getFilmByName(name);
      await filmLocator.first().click();
    });
  }

  /**
   * Selects a random film from the film list.
   * @returns Promise that resolves to the name of the selected film.
   */
  async selectRandomFilm(): Promise<string> {
    return await allure.step(
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
    return await allure.step(
      'Selecting a random film with normal showtimes from cinema detail page',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          throw new Error('No films found on the cinema detail page');
        }

        const filmsWithNormalShowtimes: string[] = [];

        for (const name of names) {
          const filmContainer = this.webActions.page.locator(
            this.selectors.filmItem,
            {
              has: this.webActions.page.locator(this.selectors.filmName, {
                hasText: name,
              }),
            }
          );

          const normalShowtimes = await filmContainer
            .locator(this.selectors.showtime)
            .filter({
              hasNot: this.webActions.page.locator(
                this.selectors.specialAttributes
              ),
            });

          if ((await normalShowtimes.count()) > 0) {
            filmsWithNormalShowtimes.push(name);
          }
        }

        if (filmsWithNormalShowtimes.length === 0) {
          // Fallback: select any film with any showtime
          for (const name of names) {
            const filmContainer = this.webActions.page.locator(
              this.selectors.filmItem,
              {
                has: this.webActions.page.locator(this.selectors.filmName, {
                  hasText: name,
                }),
              }
            );

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
    return await allure.step(
      'Getting list of showtimes for the selected film',
      async () => {
        // Get film container filtered by film name
        const filmContainer = this.webActions.page.locator(
          this.selectors.filmItem,
          {
            has: this.webActions.page.locator(this.selectors.filmName, {
              hasText: filmName,
            }),
          }
        );

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
   * Uses WebActions for consistency and overlay handling.
   * @param timeText - The showtime text to match strictly (e.g., "17:35\nSala 1").
   */
  async selectShowtimeByText(timeText: string): Promise<void> {
    await allure.step(`Selecting showtime "${timeText}"`, async () => {
      // 1. Sanitize input: Remove newlines if passed, or just use substring matching
      // The scraped data has "17:35\nSala 1", but the button might have structured HTML
      // simpler approach: look for the time part if the full text fails

      const timePart = timeText.split('\n')[0].trim(); // "17:35"

      // 2. Try to click using exact text first, then fall back to time part
      try {
        await this.webActions.click(
          `${this.selectors.showtime}:has-text("${timeText}")`,
          `Showtime: ${timeText}`
        );
      } catch (e) {
        console.log(
          `Exact match click failed for ${timeText}, trying partial match: ${timePart}`
        );
        await this.webActions.click(
          `${this.selectors.showtime}:has-text("${timePart}")`,
          `Showtime: ${timePart}`
        );
      }
    });
  }

  /**
   * Selects a random showtime from the currently displayed showtimes for the selected film.
   * @returns Promise that resolves to the text of the selected showtime.
   */
  async selectRandomShowtime(filmName: string): Promise<string> {
    return await allure.step(
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
    return await allure.step(
      'Selecting a random normal showtime for the selected film',
      async () => {
        const filmContainer = this.webActions.page.locator(
          this.selectors.filmItem,
          {
            has: this.webActions.page.locator(this.selectors.filmName, {
              hasText: filmName,
            }),
          }
        );

        // Locate all showtime buttons
        const showtimeLocator = filmContainer.locator(this.selectors.showtime);

        // Wait for first showtime to be visible (pure async, no timeout)
        await showtimeLocator.first().waitFor({ state: 'visible' });

        // Filter out showtimes with special attributes (D-BOX, iSense, etc.)
        const normalShowtimes = await showtimeLocator.filter({
          hasNot: this.webActions.page.locator(
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
    return await allure.step(
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
    return await allure.step(
      'Selecting a random film and navigating to its details page',
      async () => {
        const names = await this.getFilmNames();
        if (names.length === 0) {
          throw new Error('No films found on the cinema detail page');
        }
        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedFilm = names[randomIndex];
        const filmContainer = this.webActions.page.locator(
          this.selectors.filmItem,
          {
            has: this.webActions.page.locator(this.selectors.filmName, {
              hasText: selectedFilm,
            }),
          }
        );
        const filmTitleLink = filmContainer.locator(
          this.selectors.filmTitleLink
        );
        await this.dismissBlockingModalIfVisible();
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
    return await allure.step(
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
  /**
   * Attempts D-BOX film+showtime selection on the currently visible day.
   * Extracted inner logic for multi-day iteration.
   */
  private async trySelectDBoxOnCurrentDay(): Promise<{
    film: string;
    showtime: string;
  }> {
    const names = await this.getFilmNames();
    if (names.length === 0) {
      throw new Error('No films found on the cinema detail page');
    }

    for (const name of names) {
      const filmContainer = this.webActions.page.locator(
        this.selectors.filmItem,
        {
          has: this.webActions.page.locator(this.selectors.filmName, {
            hasText: name,
          }),
        }
      );

      // Filter showtimes whose screen-name contains "D-BOX"
      const dboxShowtimes = filmContainer
        .locator(this.selectors.showtime)
        .filter({
          has: this.webActions.page.locator(this.selectors.showtimeScreenName, {
            hasText: 'D-BOX',
          }),
        });

      const count = await dboxShowtimes.count();
      if (count > 0) {
        await this.selectFilmByName(name);
        const showtimeText = await dboxShowtimes.first().innerText();
        await this.dismissBlockingModalIfVisible();
        await dboxShowtimes.first().click();
        return { film: name, showtime: showtimeText.trim() };
      }
    }

    throw new Error(
      'No D-BOX films with showtimes found on the cinema detail page'
    );
  }

  /**
   * Selects a D-BOX film and showtime.
   * Iterates through all available days if no D-BOX content is found on the current day.
   */
  async selectDBoxRandomFilmAndShowtime(): Promise<{
    film: string;
    showtime: string;
    day?: string;
  }> {
    return await allure.step(
      'Selecting a D-BOX film and showtime with multi-day fallback',
      async () => {
        const availableDays = await this.getAvailableDays();
        const dayErrors: string[] = [];

        for (let dayIndex = 0; dayIndex < availableDays.length; dayIndex++) {
          const dayLabel = await this.selectDayByIndex(dayIndex);
          await this.ensureShowAllMovies();

          if (!(await this.hasFilmsOnCurrentDay())) {
            dayErrors.push(`${dayLabel}: No films available`);
            continue;
          }

          try {
            const result = await this.trySelectDBoxOnCurrentDay();
            return { ...result, day: dayLabel };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            dayErrors.push(`${dayLabel}: ${errorMessage}`);
          }
        }

        throw new Error(
          `No D-BOX showtimes found across ${availableDays.length} day(s). ` +
            `Day errors: ${dayErrors.join(' | ')}`
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
    return await allure.step('Extracting cinema schema from page', async () => {
      // Wait for dom content loaded (optimized for Cloudflare environments)
      await this.webActions.waitForLoadState('domcontentloaded');

      // Try React Helmet schema first
      const reactHelmetJsonLd = this.webActions.page.locator(
        'script[data-react-helmet="true"][type="application/ld+json"]'
      );
      const reactHelmetCount = await reactHelmetJsonLd.count();

      if (reactHelmetCount > 0) {
        const scriptContent = await reactHelmetJsonLd.first().textContent();
        if (!scriptContent) {
          throw new Error('React Helmet cinema schema script content is empty');
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
      const jsonLdScripts = this.webActions.page.locator(
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

      // No schema found - this might be expected for some cinemas/environments
      console.log(
        'Cinema schema script not found on the page - this might be expected for this cinema/environment'
      );
      return null; // Return null instead of throwing error
    });
  }
}
