/**
 * Selectors for the Movies page.
 */
export const MOVIES_SELECTORS = {
  topMoviesContainer: '.v-carousel__container .v-film-list-film',
  allMoviesContainer: '.v-film-list-grid .v-film-list-film',
  movieLink: '.v-film-list-film__link',
  movieTitle: '.v-film-title__text',
  nextButton: '.v-carousel-scroll-button.v-carousel-scroll-button--next',
  prevButton: '.v-carousel__prev-button',
  movieDetailTitle: 'h1[data-testid="film-title"], h1.film-detail__title, .film-detail-header h1',
};
