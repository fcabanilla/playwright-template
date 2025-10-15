/**
 * Selectors for Promotional Modal/Banner
 * This modal appears on page load with promotional content
 */
export interface PromoModalSelectors {
  /** Modal container */
  container: string;
  /** Modal header */
  header: string;
  /** Close button (X button in header) */
  closeButton: string;
  /** Modal body with content */
  body: string;
  /** Call-to-action button (primary action) */
  ctaButton: string;
  /** Modal title */
  title: string;
}

export const promoModalSelectors: PromoModalSelectors = {
  // Main container
  container: '.v-modal__container',

  // Header section
  header: '.v-modal-header',

  // Close button (X icon)
  closeButton: '.v-modal-header__close-button',

  // Body with promotional content
  body: '.v-modal__body',

  // Primary CTA button (if present)
  ctaButton: '.v-modal__body .v-button--color-primary',

  // Modal title
  title: '.v-modal-header__title',
};
