import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import {
  assertMoviesRedirection,
  assertMovieSchemaMatches,
  assertMovieSchemaURLsAreValid,
} from './movies.assertions';

test.describe('Cinesa Movies Tests', () => {
  test.beforeEach(async ({ navbar, cookieBanner, promotionalModal }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test('Movies page display and layout', 
    { tag: ['@movies', '@cinesa', '@smoke', '@fast'] },
    async ({
    webActions,
    navbar,
    cookieBanner,
    promotionalModal,
  }, testInfo) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    await webActions.waitForLoadState('networkidle');
    await takeScreenshot(webActions.getPage(), testInfo, 'Movies page display and layout');
  });

  test('Cinesa Movies page redirection test', 
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({
    webActions,
    navbar,
    cookieBanner,
    promotionalModal,
  }) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    await webActions.waitForLoadState('networkidle');
    assertMoviesRedirection(webActions.getPage());
  });

  test('Navigate through Top Movies', 
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({
    navbar,
    cookieBanner,
    promotionalModal,
    movieList,
  }) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    
    await movieList.loadTopMovies();
    await movieList.navigateToFirstTopMovie();
  });

  test('Navigate through Random Movies from All Movies', 
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({
    navbar,
    cookieBanner,
    promotionalModal,
    movieList,
  }) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Now Showing', 
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({
    navbar,
    cookieBanner,
    promotionalModal,
    movieList,
  }) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    await movieList.clickMoviesTabByIndex(1);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Coming Soon', 
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({
    navbar,
    cookieBanner,
    promotionalModal,
    movieList,
  }) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    await movieList.navigateComingSoonMovies();
  });

  test('Navigate through Random Movies from Advance Sale', 
    { tag: ['@movies', '@cinesa', '@regression', '@medium'] },
    async ({
    navbar,
    cookieBanner,
    promotionalModal,
    movieList,
  }) => {
    await navbar.navigateToMovies();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
    await movieList.navigateAdvanceSaleMovies();
  });

  test('Oasiz Movie Schema validation test', 
    { tag: ['@movies', '@cinesa', '@schema', '@regression', '@high'] },
    async ({
    moviePage,
    navbar,
    cinema,
    cinemaDetail,
  }) => {
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    const selectedInfo = await cinemaDetail.selectRandomFilmForDetails();
    const movieSchema = await moviePage.extractMovieSchema();
    await assertMovieSchemaMatches(movieSchema, selectedInfo.film, '');
  });

  test('Grancasa Movie Schema validation test', 
    { tag: ['@movies', '@cinesa', '@schema', '@regression', '@high'] },
    async ({
    moviePage,
    navbar,
    cinema,
    cinemaDetail,
  }) => {
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    const selectedInfo = await cinemaDetail.selectRandomFilmForDetails();
    const movieSchema = await moviePage.extractMovieSchema();
    await assertMovieSchemaMatches(movieSchema, selectedInfo.film, '');
  });

  test('Movie Schema URL validation test - Bug Detection', 
    { tag: ['@movies', '@cinesa', '@schema', '@regression', '@high'] },
    async ({
    moviePage,
    navbar,
    cinema,
    cinemaDetail,
  }) => {
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectRandomFilmForDetails();
    const movieSchema = await moviePage.extractMovieSchema();
    await assertMovieSchemaURLsAreValid(movieSchema);
  });
});
