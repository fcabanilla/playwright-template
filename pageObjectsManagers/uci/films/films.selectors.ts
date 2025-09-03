export interface FilmsSelectors {
  // Main page elements
  filmsContainer: string;
  filmCard: string;
  filmTitle: string;
  filmImage: string;
  filmButton: string;

  // Filter and search elements
  searchInput: string;
  genreFilter: string;
  dateFilter: string;

  // Film details
  filmPoster: string;
  filmDescription: string;
  filmTrailer: string;

  // Booking elements
  bookNowButton: string;
  showtimesSection: string;
  showtimeButton: string;
}

// Constants for Films page
export const filmsConstants = {
  // UCI-specific selectors (primary)
  uciFilmTitleSelector: 'h2[data-v-64b23b32]',
  uciFilmsContainer: '[data-v-64b23b32]',

  // Wait times
  searchWaitTime: 1000,
  pageLoadTimeout: 10000,

  // Messages
  noFilmsFoundMessage: 'NO FILMS FOUND',

  // CSS nth-child pattern
  nthChildPattern: ':nth-child(',
  firstChildSelector: ':first-child',
  hasTextPattern: ':has-text("',
} as const;

// Alternative film title selectors for fallback
export const alternativeFilmTitleSelectors = [
  'h2[data-v-64b23b32]',
  '.film-title',
  '.movie-title',
  'h2',
  'h3',
  '[class*="title"]',
] as const;

// Alternative film card selectors for fallback
export const alternativeFilmCardSelectors = [
  '.program-list-element',
  '.film-card',
  '.movie-card',
  '[class*="film"]',
  '[class*="movie"]',
  '[class*="card"]',
] as const;

export const filmsSelectors: FilmsSelectors = {
  // Main page elements - based on actual UCI film page structure
  filmsContainer:
    '#selector-from-theatre, .program-list-element, [data-v-64b23b32]',
  filmCard: '.program-list-element, .film-card, .movie-card',
  filmTitle:
    '.program-list-element h2[data-v-64b23b32], h2[data-v-64b23b32], .film-title, .movie-title',
  filmImage:
    '.movie-poster, .film-image img, .movie-poster img, img[alt*="poster"]',
  filmButton:
    '.film-button, .movie-button, button:has-text("Acquista"), a:has-text("Vai al film")',

  // Filter and search elements
  searchInput:
    'input[placeholder*="cerca"], input[type="search"], .search-input',
  genreFilter: '.genre-filter, select[name="genre"], .filter-genre',
  dateFilter: '.date-filter, input[type="date"], .filter-date',

  // Film details
  filmPoster: '.film-poster img, .movie-poster img, .poster img',
  filmDescription: '.film-description, .movie-description, .synopsis',
  filmTrailer:
    '.trailer-button, button:has-text("Trailer"), a:has-text("Trailer")',

  // Booking elements
  bookNowButton:
    'button:has-text("Prenota"), button:has-text("Acquista"), .book-now',
  showtimesSection: '.showtimes, .orari, .programmazione',
  showtimeButton: '.showtime-button, .orario-button, button[data-showtime]',
};
