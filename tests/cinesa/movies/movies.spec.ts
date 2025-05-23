import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { takeScreenshot } from '../../../pageObjectsManagers/cinesa/generic/generic';
import { assertMoviesRedirection } from './movies.assertions';
import { MovieList } from '../../../pageObjectsManagers/cinesa/movies/movies.page';

test.describe('Cinesa Movies Tests', () => {
  test('Movies page display and layout', async ({ page, navbar, cookieBanner }, testInfo) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    await takeScreenshot(page, testInfo, 'Movies page display and layout');
  });

  test('Cinesa Movies page redirection test', async ({ page, navbar, cookieBanner }) => {
    await navbar.navigateToHome();
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    assertMoviesRedirection(page);
  });

  test('Navigate through Top Movies', async ({ page, navbar, cookieBanner }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.iterateAndClickMovies();
  });

  test('Navigate through Random Movies from All Movies', async ({ page, navbar, cookieBanner }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Now Showing', async ({ page, navbar, cookieBanner }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.clickMoviesTabByIndex(1);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Coming Soon', async ({ page, navbar, cookieBanner }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.clickMoviesTabByIndex(2);
    await movieList.navigateThroughRandomMovies();
  });

  test('Navigate through Random Movies from Advance Sale', async ({ page, navbar, cookieBanner }) => {
    await page.goto('https://www.cinesa.es/');
    await cookieBanner.acceptCookies();
    await navbar.navigateToMovies();
    const movieList = new MovieList(page);
    await movieList.clickMoviesTabByIndex(3);
    await movieList.navigateThroughRandomMovies();
  });
});
