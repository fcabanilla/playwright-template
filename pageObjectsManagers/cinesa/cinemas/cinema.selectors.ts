/**
 * Interface that defines the selectors for the cinema page.
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
   * Selector for the filter input.
   */
  filterInput: string;
}

/**
 * Selectors for the cinema page.
 */
export const cinemaSelectors: CinemaSelectors = {
  container: '.cinema-list',
  cinemaElement: '.cinema-list-element',
  cinemaName: '.cinema-list-element__name',
  cinemaDesc: '.cinema-list-element__desc',
  filterInput: 'input.v-input',
};
