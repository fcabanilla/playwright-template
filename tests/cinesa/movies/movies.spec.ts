import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import {
  assertMoviesRedirection,
  assertMovieSchemaMatches,
  assertMovieSchemaURLsAreValid,
} from './movies.assertions';
import { MovieList } from '../../../pageObjectsManagers/cinesa/movies/movies.page';
import { MoviePage } from '../../../pageObjectsManagers/cinesa/movie/movie.page';

test.describe('Cinesa Movies Tests', () => {
  test('Movies page display and layout', async ({
    page,
    navbar,
    cookieBanner,
  }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    await takeScreenshot(page, testInfo, 'Movies page display and layout');
  });

  test('Cinesa Movies page redirection test', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    assertMoviesRedirection(page);
  });

  test('Navigate through Top Movies', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.iterateAndClickMovies();
  });

  test('Navigate through Random Movies from All Movies', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Now Showing', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.clickMoviesTabByIndex(1);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Coming Soon', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.clickMoviesTabByIndex(2);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Advance Sale', async ({
    page,
    navbar,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.clickMoviesTabByIndex(3);
    await movieList.navigateThroughRandomMovies();
  });

  test('Oasiz Movie Schema validation test', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    const selectedInfo = await cinemaDetail.selectRandomFilmForDetails();
    const moviePage = new MoviePage(page);
    const movieSchema = await moviePage.extractMovieSchema();
    await assertMovieSchemaMatches(movieSchema, selectedInfo.film, '');
  });

  test('Grancasa Movie Schema validation test', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectGrancasaCinema();
    const selectedInfo = await cinemaDetail.selectRandomFilmForDetails();
    const moviePage = new MoviePage(page);
    const movieSchema = await moviePage.extractMovieSchema();
    await assertMovieSchemaMatches(movieSchema, selectedInfo.film, '');
  });

  test('Movie Schema URL validation test - Bug Detection', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
  }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToCinemas();
    await cinema.selectOasizCinema();
    await cinemaDetail.selectRandomFilmForDetails();
    const moviePage = new MoviePage(page);
    const movieSchema = await moviePage.extractMovieSchema();
    await assertMovieSchemaURLsAreValid(movieSchema);
  });
});
