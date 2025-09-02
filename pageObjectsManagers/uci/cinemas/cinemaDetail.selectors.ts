/**
 * Interface defining the selectors for the UCI Cinema Detail page.
 */
export interface CinemaDetailSelectors {
  /**
   * Selector for the container that holds the film list.
   */
  filmList: string;
  /**
   * Selector for each film item element.
   */
  filmItem: string;
  /**
   * Selector for the film name element within a film item.
   */
  filmName: string;
  /**
   * Selector for the film title element.
   */
  filmTitle: string;
  /**
   * Selector for the showtime button or element within the film details.
   */
  showtime: string;
  /**
   * Selector for showtime container.
   */
  showtimeContainer: string;
  /**
   * Selector for special attributes like language, format, or special features.
   */
  specialAttributes: string;
  /**
   * Selector for the film poster image.
   */
  filmPoster: string;
  /**
   * Selector for the film title link that navigates to the movie details page.
   */
  filmTitleLink: string;
  /**
   * Selector for date picker or date selection.
   */
  dateSelector: string;
  /**
   * Selector for cinema name/title on the detail page.
   */
  cinemaTitle: string;
  /**
   * Alternative selectors for film names.
   */
  alternativeFilmSelectors: string[];
  /**
   * Alternative selectors for cinema title.
   */
  alternativeCinemaTitleSelectors: string[];
}

/**
 * Constants for cinema detail page operations.
 */
export const cinemaDetailConstants = {
  /**
   * Default film name when selection fails.
   */
  defaultFilmName: 'Random UCI Film',
  /**
   * Default showtime text.
   */
  defaultShowtimeText: 'Random Showtime',
  /**
   * First available showtime text.
   */
  firstAvailableShowtime: 'First Available Showtime',
  /**
   * First film name.
   */
  firstFilmName: 'First UCI Film',
  /**
   * Unknown cinema name fallback.
   */
  unknownCinemaName: 'UCI Cinema (Unknown)',
  /**
   * Error cinema name fallback.
   */
  errorCinemaName: 'UCI Cinema (Error)',
  /**
   * Wait timeout for film list (in milliseconds).
   */
  filmListTimeout: 15000,
  /**
   * Wait time for films to load (in milliseconds).
   */
  filmsLoadWaitTime: 2000,
  /**
   * Page load wait time (in milliseconds).
   */
  pageLoadWaitTime: 3000,
  /**
   * Cinema title wait timeout (in milliseconds).
   */
  cinemaTitleTimeout: 5000,
} as const;

/**
 * Selectors for the UCI Cinema Detail page.
 * Updated with actual selectors from the UCI website structure based on real HTML.
 */
export const cinemaDetailSelectors: CinemaDetailSelectors = {
  // Film list container - the main selector that contains all movies
  filmList: '#selector-from-theatre',

  // Individual film items - each movie has this class
  filmItem: '.program-list-element',

  // Film name/title elements - the h2 with movie title (updated based on actual HTML)
  filmName: '.program-list-element h2[data-v-64b23b32]',
  filmTitle: 'h2[data-v-64b23b32]',

  // Showtime elements - these appear when showtimes are available
  showtime:
    'button:has-text("Prossima data disponibile"), .showtime-button, .time-button',
  showtimeContainer: '.mt-8',

  // Special attributes (language, format, etc.)
  specialAttributes: '.text-gray-1, .flex.flex-row.w-full.space-x-\\[5px\\]',

  // Film poster - the movie poster image
  filmPoster: '.movie-poster, [role="img"]',

  // Film title link for navigation - link to individual movie page
  filmTitleLink: 'a[href^="/film/"]',

  // Date selector - the calendar at the top
  dateSelector: '.border-b-2.border-yellow, .cursor-pointer.text-center',

  // Cinema title - the h1 with cinema name
  cinemaTitle: 'h1.uppercase.font-barlow.text-white.text-6xl',

  // Alternative selectors for film names
  alternativeFilmSelectors: [
    '.program-list-element h2',
    '#selector-from-theatre h2',
    '.text-white.text-2xl.font-nunitoSansSemi h2',
    'h2[data-v-64b23b32]',
    '.movie-item',
    '.film-item',
    '[data-testid*="film"]',
    '[class*="program"]',
  ],

  // Alternative selectors for cinema title
  alternativeCinemaTitleSelectors: [
    'h1',
    'h1.uppercase',
    '[class*="cinema"]',
    '[class*="title"]',
    '.text-6xl',
  ],
};
