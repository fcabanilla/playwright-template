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

/**
 * Validates that all URLs in the movie schema are properly formatted and valid.
 * This function checks for common URL issues like concatenated 'undefined' values.
 * @param movieSchema The movie schema extracted from the page.
 */
export function assertMovieSchemaURLsAreValid(movieSchema: any): void {
  const validateURL = (url: string, fieldName: string): void => {
    expect(url, `${fieldName} should not be empty`).toBeTruthy();
    expect(url, `${fieldName} should not contain 'undefined': ${url}`).not.toContain('undefined');
    expect(url, `${fieldName} should not contain 'null': ${url}`).not.toContain('null');
    expect(url, `${fieldName} should start with http:// or https://: ${url}`).toMatch(/^https?:\/\//);
    expect(url, `${fieldName} should not have malformed concatenation: ${url}`).not.toMatch(/undefined$/);
    expect(url, `${fieldName} should not have malformed concatenation: ${url}`).not.toMatch(/null$/);
    try {
      new URL(url);
    } catch (error) {
      throw new Error(`${fieldName} is not a valid URL: ${url}`);
    }
  };
  if (movieSchema.url) {
    validateURL(movieSchema.url, 'Movie URL');
  }
  if (movieSchema.image) {
    validateURL(movieSchema.image, 'Movie image URL');
  }
  if (movieSchema.trailer && movieSchema.trailer.url) {
    validateURL(movieSchema.trailer.url, 'Movie trailer URL');
  }
  console.log('✅ All URLs in movie schema are valid');
}
