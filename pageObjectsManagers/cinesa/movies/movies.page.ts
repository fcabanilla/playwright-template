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
    //await this.loadTopMovies();
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
      console.log(`Iteration: ${i + 1}, Movie Title: ${movie.title}`);
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
}
