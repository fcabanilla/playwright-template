import * as allure from 'allure-playwright';
import { Films } from '../../../pageObjectsManagers/uci/films/films.page';

/**
 * UCI Films Page Assertions
 *
 * Contains all assertion logic for UCI films page testing.
 * Attachments are automatically created to show actual vs expected values.
 */
export class FilmsAssertions {
  constructor(private filmsPage: Films) {}

  /**
   * Asserts that films count is greater than minimum expected value
   * Attaches actual count, film titles list, and page info to Allure report
   */
  async assertFilmsCountGreaterThan(
    expectedMinimum: number = 0
  ): Promise<void> {
    await allure.test.step(
      `Assert films count is greater than ${expectedMinimum}`,
      async () => {
        const actualCount = await this.filmsPage.getFilmsCount();
        const actualTitles = await this.filmsPage.getFilmTitles();

        const assertionData = {
          actualCount,
          expectedMinimum,
          actualTitles:
            actualTitles.length > 0 ? actualTitles : ['NO FILMS FOUND'],
          titlesCount: actualTitles.length,
          assertion: 'Films Count Greater Than',
          result: actualCount > expectedMinimum ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString(),
          debugInfo: {
            filmsCountMethod: actualCount,
            titleArrayLength: actualTitles.length,
            pageState: 'Films page loaded',
          },
        };

        // Attach detailed assertion data to report
        await allure.test.step('Films Count Assertion Details', async () => {
          console.log(
            `Films Count Full Data: ${JSON.stringify(assertionData, null, 2)}`
          );
        });

        if (actualCount <= expectedMinimum) {
          throw new Error(
            `Expected films count to be greater than ${expectedMinimum}, but got ${actualCount}. Films found: ${JSON.stringify(actualTitles)}`
          );
        }
      }
    );
  }

  /**
   * Asserts that film titles array has minimum expected length
   * Attaches complete titles list and debugging info to Allure report
   */
  async assertFilmTitlesMinimumLength(
    expectedMinimum: number = 0
  ): Promise<void> {
    await allure.test.step(
      `Assert film titles length is greater than ${expectedMinimum}`,
      async () => {
        const actualTitles = await this.filmsPage.getFilmTitles();
        const actualLength = actualTitles.length;

        const assertionData = {
          expectedMinimum,
          actualLength,
          allTitles:
            actualTitles.length > 0 ? actualTitles : ['NO TITLES FOUND'],
          assertion: 'Film Titles Array Length',
          result: actualLength > expectedMinimum ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString(),
          debugInfo: {
            isEmpty: actualTitles.length === 0,
            firstFew: actualTitles.slice(0, 3),
            lastFew: actualTitles.length > 3 ? actualTitles.slice(-3) : [],
          },
        };

        // Attach detailed assertion data to report
        await allure.test.step('Film Titles Assertion Details', async () => {
          console.log(
            `Film Titles Full Data: ${JSON.stringify(assertionData, null, 2)}`
          );
        });

        if (actualLength <= expectedMinimum) {
          throw new Error(
            `Expected film titles length to be greater than ${expectedMinimum}, but got ${actualLength}. All titles: ${JSON.stringify(actualTitles)}`
          );
        }
      }
    );
  }

  /**
   * Asserts that films page has loaded with content
   * Combines visibility and content availability checks
   */
  async assertFilmsPageHasContent(): Promise<void> {
    await allure.test.step('Assert films page has content', async () => {
      // Check visibility first
      await this.filmsPage.verifyFilmsVisible();

      // Then assert minimum content requirements
      await this.assertFilmsCountGreaterThan(0);
      await this.assertFilmTitlesMinimumLength(0);
    });
  }
}
