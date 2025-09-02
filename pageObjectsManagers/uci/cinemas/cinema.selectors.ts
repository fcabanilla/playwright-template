/**
 * Interface that defines the selectors for the UCI cinema page.
 */
export interface CinemaSelectors {
  /**
   * Selector for the main container of the cinema list.
   */
  container: string;
  /**
   * Selector for each individual cinema element (link).
   */
  cinemaElement: string;
  /**
   * Selector for the cinema name within each element.
   */
  cinemaName: string;
  /**
   * Selector for the cinema description within each element.
   */
  cinemaDesc: string;
  /**
   * Selector for the filter/search input.
   */
  filterInput: string;
  /**
   * Selector for cinema cards or items.
   */
  cinemaCard: string;
  /**
   * Selector for cinema location/address.
   */
  cinemaLocation: string;
  /**
   * Alternative selectors for cinema name extraction.
   */
  alternativeCinemaNameSelectors: string[];
}

/**
 * Constants for cinema page operations.
 */
export const cinemaConstants = {
  /**
   * Default cinema name when none can be extracted.
   */
  defaultCinemaName: 'Random UCI Cinema',
  /**
   * First cinema fallback name.
   */
  firstCinemaName: 'First UCI Cinema',
  /**
   * Wait time for filter to apply (in milliseconds).
   */
  filterWaitTime: 1000,
} as const;

/**
 * Selectors for the UCI cinema page.
 * Updated with actual selectors from the UCI website structure.
 */
export const cinemaSelectors: CinemaSelectors = {
  // Main container for cinema list - the grid that contains all cinemas
  container: '.lg\\:grid.lg\\:grid-cols-3.lg\\:gap-4.pb-20',

  // Individual cinema elements - each cinema wrapper
  cinemaElement: 'a[href^="/cinema/"]',

  // Cinema name element - white text with nunitoSans font
  cinemaName: 'p.text-white.text-xl.font-nunitoSans',

  // Cinema description - not used but kept for interface compatibility
  cinemaDesc: '.text-gray-1.text-base',

  // Search/filter input - the search box at the top
  filterInput: 'input[type="text"].w-full.h-12.px-4.text-white.bg-blue-3',

  // Cinema card wrapper - each individual cinema item
  cinemaCard: 'div:has(> div > hr)',

  // Cinema location/address - gray text showing the city
  cinemaLocation: '.text-gray-1.text-base',

  // Alternative selectors for cinema name extraction
  alternativeCinemaNameSelectors: [
    'h3',
    'h4',
    '[class*="name"]',
    '[class*="title"]',
  ],
};
