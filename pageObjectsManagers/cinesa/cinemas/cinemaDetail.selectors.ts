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
   * Selector for the D-BOX showtime screen name containing 'D-BOX' text.
   */
  dboxIcon: string;
  /**
   * Selector for the screen name element inside a showtime button.
   */
  showtimeScreenName: string;
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
  /**
   * Selector for blocking modals (promotional dialogs) that overlay the cinema detail page.
   */
  blockingModal: string;
  /**
   * Selector for the close button inside blocking modals.
   */
  blockingModalCloseButton: string;
  /** Selector for the date picker container. */
  dayPickerContainer: string;
  /** Selector for each day item in the date picker. */
  dayPickerItem: string;
  /** Selector for day picker buttons (clickable day elements). */
  dayPickerButton: string;
  /** Selector for the currently active/selected day button. */
  dayPickerActiveButton: string;
  /** Selector for the "Show all movies" checkbox in the showtime picker. */
  showAllMoviesCheckbox: string;
}

/**
 * Selectors for the Cinema Detail page.
 */
export const cinemaDetailSelectors: CinemaDetailSelectors = {
  filmList: '.v-showtime-picker-film-list',
  filmItem: '.v-showtime-picker-film-list__item',
  filmName: '.v-showtime-picker-film-details .v-film-title__text',
  showtime: '.v-showtime-picker-site-list .v-showtime-button',
  specialAttributes:
    '.v-attribute__icon--type-standard, .v-attribute__icon--type-hero',
  dboxIcon: '.v-showtime-button__screen-name',
  showtimeScreenName: '.v-showtime-button__screen-name',
  filmTitleLink: '.v-showtime-picker-film-details .v-film-title__text',
  duration: '.v-film-details__duration, .duration',
  attributeIcon: '.v-attribute-icon, .icon-attribute',
  showtimeInternalIcon: 'img, .icon, i',
  blockingModal:
    'dialog[open], aside.v-modal.secondary-attribute-message-modal',
  blockingModalCloseButton:
    'dialog button:has-text("Close modal"), aside.v-modal .v-modal-header__close-button',
  dayPickerContainer: '.v-date-picker',
  dayPickerItem: '.v-date-picker-date',
  dayPickerButton: '.v-date-picker-date__button',
  dayPickerActiveButton: '.v-date-picker-date__button--selected',
  showAllMoviesCheckbox:
    '.v-showtime-picker-show-all-movies input[type="checkbox"]',
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
