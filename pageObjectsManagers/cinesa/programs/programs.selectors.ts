/**
 * Selectors for the Programs (myCINESA & Unlimited) page.
 */
export const PROGRAMS_PAGE_SELECTORS = {
  gridRow: '.grid-row >> nth=0', // First grid row to avoid strict mode violation
  gridColumn: '.grid-column',
  myCinesaCard: '.grid-row .grid-column:first-child',
  unlimitedCard: '.grid-row .grid-column:last-child',
  unlimitedButton: '.grid-row .grid-column:last-child .cta-button button',
};
