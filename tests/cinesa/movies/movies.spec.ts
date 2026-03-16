import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { getCinemasForMovieTests } from './movies.data';
import {
  assertMoviesRedirection,
  assertMovieSchemaMatches,
  assertMovieSchemaURLsAreValid,
} from './movies.assertions';
import { assertNoCloudflareProtection } from '../../helpers/cloudflareDetector';

// Get available cinemas for movie schema tests
const CINEMAS_FOR_SCHEMA = getCinemasForMovieTests();

test.describe('Cinesa Movies Tests', () => {
  // Force serial execution (1 worker) to avoid concurrency issues
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page, navbar }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Movies - Content Catalog');

    await navbar.navigateToHome();
    await assertNoCloudflareProtection(page, 'beforeEach setup');
  });

  test(
    'Films · Catalog · Display & Layout',
    { tag: ['@movies', '@cinesa', '@smoke', '@fast'] },
    async ({ webActions, navbar }, testInfo) => {
      await allure.story('Movies catalog page display and layout');
      await navbar.navigateToMovies();
      await webActions.waitForLoadState('domcontentloaded');
      await takeScreenshot(
        webActions.getPage(),
        testInfo,
        'Movies page display and layout'
      );
    }
  );

  test(
    'Films · Catalog · Navigate · Redirect',
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({ webActions, navbar }) => {
      await allure.story('Movies page URL redirection validation');
      await navbar.navigateToMovies();
      await webActions.waitForLoadState('domcontentloaded');
      assertMoviesRedirection(webActions.getPage());
    }
  );

  test(
    'Films · Navigation · Browse · Top Movies',
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({ navbar, movieList }) => {
      await allure.story('Navigation through Top Movies section');
      await navbar.navigateToMovies();
      await movieList.loadTopMovies();
      await movieList.navigateToFirstTopMovie();
    }
  );

  test(
    'Films · Navigation · Browse · Random from All Movies',
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({ navbar, movieList }) => {
      await allure.story('Random movie navigation - All Movies tab');
      await navbar.navigateToMovies();
      await movieList.navigateThroughRandomMovies();
    }
  );

  test(
    'Films · Navigation · Browse · Random from Now Showing',
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({ navbar, movieList }) => {
      await allure.story('Random movie navigation - Now Showing tab');
      await navbar.navigateToMovies();
      await movieList.navigateNowShowingMovies();
    }
  );

  test(
    'Films · Navigation · Browse · Random from Coming Soon',
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({ navbar, movieList }) => {
      await allure.story('Random movie navigation - Coming Soon tab');
      await navbar.navigateToMovies();
      await movieList.navigateComingSoonMovies();
    }
  );

  test(
    'Films · Navigation · Browse · Random from Advance Sale',
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({ navbar, movieList }) => {
      await allure.story('Random movie navigation - Advance Sale tab');
      await navbar.navigateToMovies();
      await movieList.navigateAdvanceSaleMovies();
    }
  );

  // Parametrized Movie Schema validation tests
  for (const cinema of CINEMAS_FOR_SCHEMA) {
    test(
      `Films · Schema · Validate · ${cinema.name}`,
      {
        tag: [
          '@movies',
          '@cinesa',
          '@schema',
          '@regression',
          '@high',
          ...cinema.tags,
        ],
      },
      async ({ moviePage, navbar, cinema: cinemaPage, cinemaDetail }) => {
        await allure.story(`Movie Schema validation - ${cinema.name}`);
        await navbar.navigateToCinemas();
        await cinemaPage[cinema.selectMethod]();
        const selectedInfo = await cinemaDetail.selectRandomFilmForDetails();
        const movieSchema = await moviePage.extractMovieSchema();
        await assertMovieSchemaMatches(movieSchema, selectedInfo.film, '');
      }
    );
  }

  test(
    'Films · Schema · Validate URLs · Bug detection',
    {
      tag: [
        '@movies',
        '@cinesa',
        '@schema',
        '@regression',
        '@high',
        '@OCG-3316',
        '@fix-test',
      ],
    },
    async ({ moviePage, navbar, cinema, cinemaDetail }) => {
      await allure.story('OCG-3316 - Movie Schema URL validation');
      await navbar.navigateToCinemas();
      await cinema.selectOasizCinema();
      await cinemaDetail.selectRandomFilmForDetails();
      const movieSchema = await moviePage.extractMovieSchema();
      await assertMovieSchemaURLsAreValid(movieSchema);
    }
  );
});
