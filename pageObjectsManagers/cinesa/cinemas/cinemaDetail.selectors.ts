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
  /**
   * Selector for the D-BOX icon within a showtime.
   */
  dboxIcon: string;
  /**
   * Selector for the film title link that navigates to the movie details page.
   */
  filmTitleLink: string;
  /**
   * Selector for the film duration metadata element.
   */
  duration: string;
  /**
   * Selector for attribute icons within a film card.
   */
  attributeIcon: string;
  /**
   * Selector for internal icons/flags within a showtime button.
   */
  showtimeInternalIcon: string;
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
  dboxIcon: 'img[alt="D-BOX"]',
  filmTitleLink: '.v-showtime-picker-film-details .v-film-title__text',
  duration: '.v-film-details__duration, .duration',
  attributeIcon: '.v-attribute-icon, .icon-attribute',
  showtimeInternalIcon: 'img, .icon, i',
};

/**
 * Maps CSS class names to display format labels.
 * Used to detect showtime formats from button class attributes.
 * Extend this map when adding new cinema platforms or regions.
 */
export const showtimeFormatMap: Record<string, string> = {
  isense: 'iSense',
  imax: 'IMAX',
  vip: 'VIP',
};
