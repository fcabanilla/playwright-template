/**
 * Selectors for the Programs page.
 */
export const PROGRAMS_SELECTORS = {
  container: '.page-wrapper',
  tarjetas: {
    container: '.cards-container',
    card: '.package-card >> nth=0', // First card to avoid strict mode violation
  },
};
