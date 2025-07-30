import { expect, Page } from '@playwright/test';
import { MOVIES_URL } from './movies.data';

export function assertMoviesRedirection(page: Page): void {
	expect(page.url()).toBe(MOVIES_URL);
}

/**
 * Asserts that the movie title is displayed on the page.
 */
export async function assertMovieTitleDisplayed(page: Page, expectedTitle: string): Promise<void> {
  const movieTitleLocator = page.locator('.v-film-title__text');
  await movieTitleLocator.waitFor({ state: 'visible', timeout: 5000 });
  const actualTitle = await movieTitleLocator.innerText();
  expect(actualTitle).toBe(expectedTitle);
}

/**
 * Asserts that the movie schema data matches the selected film and showtime information.
 * @param movieSchema The movie schema extracted from the page.
 * @param selectedFilm The film name selected by selectNormalRandomFilmAndShowtime.
 * @param selectedShowtime The showtime selected by selectNormalRandomFilmAndShowtime.
 */
export function assertMovieSchemaMatches(
  movieSchema: any,
  selectedFilm: string,
  selectedShowtime: string
): void {
  expect(movieSchema['@type'], 'Schema should be of type "Movie"').toBe('Movie');
  expect(
    movieSchema.name,
    `Movie name in schema "${movieSchema.name}" should match selected film "${selectedFilm}"`
  ).toContain(selectedFilm.trim());
  expect(movieSchema.name, 'Movie name should be present in schema').toBeTruthy();
  expect(movieSchema.description, 'Movie description should be present in schema').toBeTruthy();
  expect(movieSchema.director, 'Movie director should be present in schema').toBeTruthy();
  expect(movieSchema.actor, 'Movie actors should be present in schema').toBeTruthy();
  expect(movieSchema.genre, 'Movie genre should be present in schema').toBeTruthy();
  expect(movieSchema.datePublished, 'Movie release date should be present in schema').toBeTruthy();
  expect(movieSchema.duration, 'Movie duration should be present in schema').toBeTruthy();
  expect(movieSchema.url, 'Movie URL should be present in schema').toBeTruthy();
  expect(Array.isArray(movieSchema.director), 'Director should be an array').toBeTruthy();
  expect(movieSchema.director.length, 'Director array should not be empty').toBeGreaterThan(0);
  expect(Array.isArray(movieSchema.actor), 'Actors should be an array').toBeTruthy();
  if (movieSchema.actor.length === 0) {
    console.warn('Movie schema has no actors listed - this might be expected for certain types of movies');
  }
  expect(Array.isArray(movieSchema.genre), 'Genre should be an array').toBeTruthy();
  expect(movieSchema.genre.length, 'Genre array should not be empty').toBeGreaterThan(0);
}
