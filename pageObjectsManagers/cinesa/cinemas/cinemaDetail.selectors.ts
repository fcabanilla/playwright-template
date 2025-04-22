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
}

/**
 * Selectors for the Cinema Detail page.
 */
export const cinemaDetailSelectors: CinemaDetailSelectors = {
  // Contenedor de la lista de películas
  filmList: '.v-showtime-picker-film-list',
  // Cada item individual de película
  filmItem: '.v-showtime-picker-film-list__item',
  // Selector para el título de la película dentro de los detalles (dentro del <h2>)
  filmName: '.v-showtime-picker-film-details .v-film-title__text',
  // Selector para los botones de showtime (horarios)
  showtime: '.v-showtime-picker-site-list .v-showtime-button',
};
