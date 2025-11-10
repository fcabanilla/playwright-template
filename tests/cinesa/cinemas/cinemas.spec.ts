import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { getCinemasForSchemaTests } from './cinemas.data';
import {
  assertCinemasRedirection,
  assertCinemaSchemaMatches,
} from './cinemas.assertions';

// Get available cinemas for schema tests
const CINEMAS_FOR_SCHEMA = getCinemasForSchemaTests();

test.describe('Cinesa Cinemas Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Cinemas - Location Finder');

    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test(
    'should display cinemas page layout correctly',
    { tag: ['@cinemas', '@cinesa', '@smoke', '@medium'] },
    async ({ webActions, navbar }) => {
      await allure.story('Cinemas page display and layout');
      await navbar.navigateToCinemas();
      await webActions.waitForLoadState('domcontentloaded');
      // Take screenshot for visual verification
      await webActions.screenshot();
    }
  );

  test(
    'should redirect to cinemas page correctly',
    { tag: ['@cinemas', '@cinesa', '@navigation', '@fast'] },
    async ({ webActions, navbar }) => {
      await allure.story('Cinemas page URL redirection validation');
      await navbar.navigateToCinemas();
      await webActions.waitForLoadState('domcontentloaded');
      await assertCinemasRedirection(webActions.getPage());
    }
  );

  // Parametrized Cinema Schema validation tests
  for (const cinema of CINEMAS_FOR_SCHEMA) {
    test(
      `${cinema.name} Cinema Schema validation test`,
      {
        tag: [
          '@cinemas',
          '@cinesa',
          '@schema',
          '@seo',
          '@OCG-2550',
          '@fix-test',
          ...cinema.tags,
        ],
      },
      async ({ navbar, cinema: cinemaPage, cinemaDetail }) => {
        await allure.story(
          `OCG-2550 - Cinema Schema validation - ${cinema.name}`
        );
        await navbar.navigateToCinemas();
        const selectedCinemaName = await cinemaPage[cinema.selectMethod]();
        const cinemaSchema = await cinemaDetail.extractCinemaSchema();
        await assertCinemaSchemaMatches(cinemaSchema, selectedCinemaName);
      }
    );
  }
});
