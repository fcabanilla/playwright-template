// cinemaDetail.selectors.ts
/**
 * Interface defining the selectors for the Cinema Detail page.
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
   * Selector for the showtime button or element within the film details.
   */
  showtime: string;
  /**
   * Selector for special attributes like "Vose", "iSense", or "D-BOX".
   */
  specialAttributes: string;
}

/**
 * Selectors for the Cinema Detail page.
 */
export const cinemaDetailSelectors: CinemaDetailSelectors = {
  filmList: '.v-showtime-picker-film-list',
  filmItem: '.v-showtime-picker-film-list__item',
  filmName: '.v-showtime-picker-film-details .v-film-title__text',
  showtime: '.v-showtime-picker-site-list .v-showtime-button',
  specialAttributes: '.v-attribute__icon--type-standard, .v-attribute__icon--type-hero',
};
