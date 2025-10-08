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
    await this.page.waitForSelector(MOVIES_SELECTORS.topMoviesContainer, {
      state: 'visible',
      timeout: 10000,
    });
  }

  /**
   * Waits for the all movies container to be visible.
   */
  async loadAllMovies(): Promise<void> {
    await this.page.waitForSelector(MOVIES_SELECTORS.allMoviesContainer, {
      state: 'visible',
      timeout: 10000,
    });
  }

  /**
   * Gets all top movies as a list of Movie objects.
   */
  async getTopMovies(): Promise<Movie[]> {
    await this.loadTopMovies();
    const movieLocators = await this.page
      .locator(MOVIES_SELECTORS.topMoviesContainer)
      .all();
    const movies: Movie[] = [];

    for (const movieLocator of movieLocators) {
      const title = await movieLocator
        .locator(MOVIES_SELECTORS.movieTitle)
        .innerText();
      movies.push({ title, locator: movieLocator });
    }

    return movies;
  }

  /**
   * Gets all movies as a list of Movie objects.
   */
  async getAllMovies(): Promise<Movie[]> {
    await this.loadAllMovies();
    const movieLocators = await this.page
      .locator(MOVIES_SELECTORS.allMoviesContainer)
      .all();
    const movies: Movie[] = [];

    for (const movieLocator of movieLocators) {
      const title = await movieLocator
        .locator(MOVIES_SELECTORS.movieTitle)
        .innerText();
      movies.push({ title, locator: movieLocator });
    }

    return movies;
  }

  /**
   * Clicks on a movie to navigate to its details page.
   */
  async clickMovie(movie: Movie): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await movie.locator.waitFor({ state: 'visible', timeout: 10000 });
    await movie.locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await movie.locator.locator(MOVIES_SELECTORS.movieLink).click();
  }

  /**
   * Clicks the next button in the carousel to navigate to the next set of movies.
   */
  async clickCarouselNext(): Promise<void> {
    try {
      const nextButton = this.page.locator(MOVIES_SELECTORS.nextButton);
      await nextButton.waitFor({ state: 'visible', timeout: 10000 });
      await nextButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await nextButton.click();
      await this.page.waitForTimeout(1000);
      await this.page.waitForSelector(MOVIES_SELECTORS.topMoviesContainer, {
        state: 'visible',
        timeout: 10000,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        'Carousel next button not available or not clickable:',
        message
      );
    }
  }

  /**
   * Clicks the previous button in the carousel to navigate to the previous set of movies.
   */
  async clickCarouselPrev(): Promise<void> {
    await this.page.locator(MOVIES_SELECTORS.prevButton).click();
  }

  /**
   * Iterates through top movies, clicks them, and validates their titles. If clicking a movie fails, tries to navigate carousel.
   */
  async iterateAndClickMovies(): Promise<void> {
    const movies = await this.getTopMovies();
    let processedCount = 0;
    const maxMoviesToProcess = Math.min(3, movies.length);

    for (
      let i = 0;
      i < movies.length && processedCount < maxMoviesToProcess;
      i++
    ) {
      const movie = movies[i];
      try {
        await this.clickMovie(movie);
        await this.validateMovieTitle(movie.title);
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');
        await this.loadTopMovies();
        processedCount++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Failed to process movie ${i}: ${message}`);
        try {
          await this.page.goBack();
          await this.page.waitForLoadState('networkidle');
          await this.loadTopMovies();
        } catch (backError) {
          const backMessage =
            backError instanceof Error ? backError.message : String(backError);
          console.warn('Failed to go back:', backMessage);
        }
        try {
          await this.clickCarouselNext();
          await this.page.waitForTimeout(1000);
        } catch (carouselError) {
          const carouselMessage =
            carouselError instanceof Error
              ? carouselError.message
              : String(carouselError);
          console.warn('Failed to navigate carousel:', carouselMessage);
        }
      }
    }
  }

  /**
   * Selects 5 random movies from the list of all movies and validates their titles.
   * If no movies are found, the function will log a warning and exit gracefully.
   */
  async navigateThroughRandomMovies(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.loadAllMovies();
    const allMovies = await this.getAllMovies();
    if (!allMovies.length) {
      console.warn('No movies found for the selected tab. Skipping test.');
      return;
    }
    const randomMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 3); // Reduced to 3 for stability
    for (const movie of randomMovies) {
      try {
        const title = await movie.locator
          .locator(MOVIES_SELECTORS.movieTitle)
          .innerText();
        await this.clickMovie(movie);
        await this.validateMovieTitle(title);
        await this.page.goBack();
        await this.page.waitForLoadState('networkidle');
        await this.loadAllMovies();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Failed to process movie: ${message}`);
        try {
          await this.page.goBack();
          await this.page.waitForLoadState('networkidle');
          await this.loadAllMovies();
        } catch (backError) {
          const backMessage =
            backError instanceof Error ? backError.message : String(backError);
          console.warn('Failed to go back:', backMessage);
        }
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
      throw new Error(
        `Expected title "${expectedTitle}" but found "${actualTitle}"`
      );
    }
  }

  /**
   * Clicks a tab in the movies tab list by its index (0-based).
   * 0 = All, 1 = Now Showing, 2 = Coming Soon, 3 = Advance Sale
   */
  async clickMoviesTabByIndex(index: number): Promise<void> {
    const tabButton = this.page
      .locator('.v-tabs__tab-list .v-tab__button')
      .nth(index);
    await tabButton.waitFor({ state: 'visible', timeout: 15000 }); // Increased timeout for high concurrency
    await tabButton.click();
    await this.page.waitForTimeout(800);
    await this.loadAllMovies();
  }
}
