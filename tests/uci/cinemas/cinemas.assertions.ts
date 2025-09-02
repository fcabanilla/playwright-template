import * as allure from 'allure-playwright';
import { Page } from '@playwright/test';
import { Cinema } from '../../../pageObjectsManagers/uci/cinemas/cinema.page';
import { CinemaDetail } from '../../../pageObjectsManagers/uci/cinemas/cinemaDetail.page';

/**
 * UCI Cinemas Assertions
 *
 * Contains all assertion logic for UCI cinemas testing.
 * Attachments are automatically created to show actual vs expected values.
 */
export class CinemasAssertions {
  constructor(
    private page: Page,
    private cinema: Cinema,
    private cinemaDetail: CinemaDetail
  ) {}

  /**
   * Asserts that cinemas list is visible and has content
   * Shows complete list of cinemas found or empty state for debugging
   */
  async assertCinemasListVisible(): Promise<void> {
    await allure.test.step('Assert cinemas list is visible', async () => {
      const isVisible = await this.cinema.verifyCinemasListVisible();

      // Get cinema names for debugging
      let cinemaNames: string[] = [];
      try {
        await this.cinema.logCinemaNames(); // This logs cinema names
        // Try to get cinema names if method exists
        if (typeof this.cinema.getCinemaNames === 'function') {
          cinemaNames = await this.cinema.getCinemaNames();
        }
      } catch (error) {
        cinemaNames = ['Error getting cinema names'];
      }

      const assertionData = {
        assertion: 'Cinemas List Visibility',
        expected: true,
        actual: isVisible,
        result: isVisible ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString(),
        debugInfo: {
          cinemasFound: cinemaNames.length,
          cinemasList:
            cinemaNames.length > 0 ? cinemaNames : ['NO CINEMAS FOUND'],
          pageState: 'Cinemas page loaded',
          visibilityCheck: isVisible,
        },
      };

      await allure.test.step('Cinemas List Assertion Details', async () => {
        console.log(
          `Cinemas List Full Data: ${JSON.stringify(assertionData, null, 2)}`
        );
      });

      if (!isVisible) {
        throw new Error(
          `Expected cinemas list to be visible, but it was not found. Cinemas detected: ${JSON.stringify(cinemaNames)}`
        );
      }
    });
  }

  /**
   * Asserts that cinema detail page has loaded correctly
   * Shows complete information about the cinema detail page state
   */
  async assertCinemaDetailPageLoaded(): Promise<void> {
    await allure.test.step('Assert cinema detail page loaded', async () => {
      const isLoaded = await this.cinemaDetail.verifyCinemaDetailPageLoaded();

      // Get additional debugging info
      let cinemaName = '';
      let filmNames: string[] = [];
      try {
        cinemaName = await this.cinemaDetail.getCinemaName();
        filmNames = await this.cinemaDetail.getFilmNames();
      } catch (error) {
        cinemaName = 'Error getting cinema name';
        filmNames = ['Error getting film names'];
      }

      const assertionData = {
        assertion: 'Cinema Detail Page Load',
        expected: true,
        actual: isLoaded,
        result: isLoaded ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString(),
        debugInfo: {
          cinemaName,
          filmsCount: filmNames.length,
          filmsList: filmNames.length > 0 ? filmNames : ['NO FILMS FOUND'],
          pageLoadStatus: isLoaded,
          detailPageState: 'Cinema detail page accessed',
        },
      };

      await allure.test.step('Cinema Detail Assertion Details', async () => {
        console.log(
          `Cinema Detail Full Data: ${JSON.stringify(assertionData, null, 2)}`
        );
      });

      if (!isLoaded) {
        throw new Error(
          `Expected cinema detail page to be loaded, but it was not. Cinema: ${cinemaName}, Films: ${JSON.stringify(filmNames)}`
        );
      }
    });
  }

  /**
   * Asserts that cinema has films available
   * Shows complete films list and cinema information
   */
  async assertCinemaHasFilms(): Promise<void> {
    await allure.test.step('Assert cinema has films available', async () => {
      const filmNames = await this.cinemaDetail.getFilmNames();
      const hasFilms = filmNames.length > 0;

      let cinemaName = '';
      try {
        cinemaName = await this.cinemaDetail.getCinemaName();
      } catch (error) {
        cinemaName = 'Error getting cinema name';
      }

      const assertionData = {
        assertion: 'Cinema Films Availability',
        expectedMinimum: 1,
        actualCount: filmNames.length,
        hasFilms,
        allFilms: filmNames.length > 0 ? filmNames : ['NO FILMS AVAILABLE'],
        result: hasFilms ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString(),
        debugInfo: {
          cinemaName,
          isEmpty: filmNames.length === 0,
          firstFewFilms: filmNames.slice(0, 5),
          totalFilmsFound: filmNames.length,
        },
      };

      await allure.test.step('Cinema Films Assertion Details', async () => {
        console.log(
          `Cinema Films Full Data: ${JSON.stringify(assertionData, null, 2)}`
        );
      });

      if (!hasFilms) {
        throw new Error(
          `Expected cinema "${cinemaName}" to have films available, but found ${filmNames.length} films. All films: ${JSON.stringify(filmNames)}`
        );
      }
    });
  }

  /**
   * Asserts that cinema selection flow works end-to-end
   */
  async assertCinemaSelectionFlow(): Promise<void> {
    await allure.test.step(
      'Assert complete cinema selection flow',
      async () => {
        // Check list is visible
        await this.assertCinemasListVisible();

        // Select a cinema and verify detail page loads
        const selectedCinema = await this.cinema.selectFirstCinema();
        await this.assertCinemaDetailPageLoaded();

        // Get cinema name from detail page
        const cinemaName = await this.cinemaDetail.getCinemaName();

        const flowData = {
          flow: 'Cinema Selection',
          selectedCinema,
          cinemaNameOnDetailPage: cinemaName,
          status: 'COMPLETED',
          timestamp: new Date().toISOString(),
        };

        await allure.test.step('Flow Completion Details', async () => {
          console.log(
            `Cinema Selection Flow: ${JSON.stringify(flowData, null, 2)}`
          );
        });
      }
    );
  }
}
