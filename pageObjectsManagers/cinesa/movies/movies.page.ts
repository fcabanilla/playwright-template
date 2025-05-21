import { Page, Locator } from '@playwright/test';
import { MOVIES_SELECTORS } from './movies.selectors';
import { MoviePage } from '../movie/movie.page';

export interface Movie {
  title: string;
  locator: Locator;
}

/**
 * The MovieList Page Object Model.
 * Contains methods to interact with the movie list page.
 */
export class MovieList {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the top movies container to be visible.
   */
  async loadTopMovies(): Promise<void> {
    await this.page.waitForSelector(MOVIES_SELECTORS.topMoviesContainer, { state: 'visible', timeout: 10000 });
  }

  /**
   * Waits for the all movies container to be visible.
   */
  async loadAllMovies(): Promise<void> {
    await this.page.waitForSelector(MOVIES_SELECTORS.allMoviesContainer, { state: 'visible', timeout: 10000 });
  }

  /**
   * Gets all top movies as a list of Movie objects.
   */
  async getTopMovies(): Promise<Movie[]> {
    await this.loadTopMovies();
    const movieLocators = await this.page.locator(MOVIES_SELECTORS.topMoviesContainer).all();
    const movies: Movie[] = [];

    for (const movieLocator of movieLocators) {
      const title = await movieLocator.locator(MOVIES_SELECTORS.movieTitle).innerText();
      movies.push({ title, locator: movieLocator });
    }

    return movies;
  }

  /**
   * Gets all movies as a list of Movie objects.
   */
  async getAllMovies(): Promise<Movie[]> {
    await this.loadAllMovies();
    const movieLocators = await this.page.locator(MOVIES_SELECTORS.allMoviesContainer).all();
    const movies: Movie[] = [];

    for (const movieLocator of movieLocators) {
      const title = await movieLocator.locator(MOVIES_SELECTORS.movieTitle).innerText();
      movies.push({ title, locator: movieLocator });
    }

    return movies;
  }

  /**
   * Clicks on a movie to navigate to its details page.
   */
  async clickMovie(movie: Movie): Promise<void> {
    await movie.locator.isVisible();
    await movie.locator.waitFor({ state: 'visible', timeout: 2000 });
    await this.page.waitForLoadState('domcontentloaded');
    await movie.locator.locator(MOVIES_SELECTORS.movieLink).click();
  }

  /**
   * Clicks the next button in the carousel to navigate to the next set of movies.
   */
  async clickCarouselNext(): Promise<void> {
    await this.page.locator(MOVIES_SELECTORS.nextButton).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator(MOVIES_SELECTORS.nextButton).click();
    await this.page.waitForSelector(MOVIES_SELECTORS.topMoviesContainer, { state: 'visible', timeout: 5000 });
  }

  /**
   * Clicks the previous button in the carousel to navigate to the previous set of movies.
   */
  async clickCarouselPrev(): Promise<void> {
    await this.page.locator(MOVIES_SELECTORS.prevButton).click();
  }

  /**
   * Iterates through all top movies, clicks them, and validates their titles. If clicking a movie times out, clicks the 'Next' button.
   */
  async iterateAndClickMovies(): Promise<void> {
    let carouselNextCount = 1; 
    const movies = await this.getTopMovies();
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      try {
        await Promise.race([
          this.clickMovie(movie),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Click timeout')), 6000))
        ]);
        await this.validateMovieTitle(movie.title);
        await this.page.goBack();
        await this.loadTopMovies();
      } catch (error) {
        for (let i = 0; i < carouselNextCount; i++) {
          await this.clickCarouselNext();
          }
        carouselNextCount++;
        await this.page.waitForTimeout(3000);
        await this.validateMovieTitle(movie.title);
        await this.page.goBack();
        await this.loadTopMovies();
      }
    }
  }

  /**
   * Selects 5 random movies from the list of all movies and validates their titles.
   * If no movies are found, the function will log a warning and exit gracefully.
   */
  async navigateThroughRandomMovies(): Promise<void> {
    const allMovies = await this.getAllMovies();
    if (!allMovies.length) {
      console.warn('No movies found for the selected tab. Skipping test.');
      return;
    }
    const randomMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 5);
    for (const movie of randomMovies) {
      const title = await movie.locator.locator(MOVIES_SELECTORS.movieTitle).innerText();
      await this.clickMovie(movie);
      await this.validateMovieTitle(title);
      await this.page.goBack();
      await this.loadAllMovies();
    }
  }

  /**
   * Waits for the movie details page to load and validates the title.
   */
  async validateMovieTitle(expectedTitle: string): Promise<void> {
    const moviePage = new MoviePage(this.page);
    await moviePage.waitForPageLoad();
    const actualTitle = await moviePage.getMovieTitle();
    if (actualTitle.toLowerCase() !== expectedTitle.toLowerCase()) {
      throw new Error(`Expected title "${expectedTitle}" but found "${actualTitle}"`);
    }
  }

  /**
   * Clicks a tab in the movies tab list by its index (0-based).
   * 0 = All, 1 = Now Showing, 2 = Coming Soon, 3 = Advance Sale
   */
  async clickMoviesTabByIndex(index: number): Promise<void> {
    const tabButton = this.page.locator('.v-tabs__tab-list .v-tab__button').nth(index);
    await tabButton.waitFor({ state: 'visible', timeout: 5000 });
    await tabButton.click();
    await this.page.waitForTimeout(800);
    await this.loadAllMovies();
  }
}
