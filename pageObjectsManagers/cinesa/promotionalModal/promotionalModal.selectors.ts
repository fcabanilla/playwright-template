export interface PromotionalModalSelectors {
  modal: string;
  closeButton: string;
  modalOverlay: string;
  dialogModal: string;
  dialogCloseButton: string;
}

export const promotionalModalSelectors: PromotionalModalSelectors = {
  modal: 'aside.v-modal.global-popup',
  closeButton: '.v-modal-header__close-button',
  modalOverlay: '.v-modal__background-overlay',
  dialogModal: 'dialog[open]',
  dialogCloseButton: 'dialog button:has-text("Close modal")',
} as const;
