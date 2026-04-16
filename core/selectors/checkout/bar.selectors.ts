/**
 * Shared Bar selectors — Cinesa checkout step 4 (Bar & Food Services).
 *
 * MCP-verified from lab + preprod Oasiz.
 */

export interface BarSelectors {
  modal: string;
  modalButton: string;
  barMainButton: string;
  menusTab: string;
  menuItems: string;
  menuItemName: string;
  menuItemButton: string;
  modalSections: string;
  modalSectionOptions: string;
  addToCartButton: string;
  barSummaryContinueButton: string;
  galiciaModal: string;
  galiciaModalContinueButton: string;
}

export const barSelectors: BarSelectors = {
  modal: 'aside.v-modal',
  modalButton: 'aside.v-modal button',
  barMainButton:
    '.v-button.v-button--color-primary.v-button--size-medium.button-skip',
  menusTab: 'button.v-tab__button >> nth=1',
  menuItems: 'ul.v-item-picker-grid li.v-item-picker-item-button',
  menuItemName: '.v-item-details__name',
  menuItemButton: '.v-item-picker-item-button__button',
  modalSections: '.v-accordion .v-accordion-section',
  modalSectionOptions: '.v-item-picker-item-option',
  addToCartButton: 'button.v-item-modal-footer__action-button',
  barSummaryContinueButton: 'button.v-button.button-review',
  galiciaModal: 'aside.v-modal[role="dialog"]',
  galiciaModalContinueButton:
    'aside.v-modal[role="dialog"] button:has-text("Continuar")',
} as const;
