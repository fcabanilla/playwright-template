import { WebActions } from '../../../core/webactions/webActions';
import { promotionalModalSelectors } from './promotionalModal.selectors';
import { allure } from 'allure-playwright';

/**
 * Page Object for handling the promotional modal/popup that appears on LAB environment
 * This modal shows "VENTA ANTICIPADA" message and needs to be closed before interacting with the page
 * Follows ADR-0009: Uses WebActions abstraction, no direct Playwright API access.
 */
export class PromotionalModal {
  private readonly webActions: WebActions;
  private readonly selectors = promotionalModalSelectors;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
  }

  /**
   * Closes the promotional modal by clicking the close button (X)
   * Waits for the modal to be visible first, then clicks the close button
   */
  async closeModal(): Promise<void> {
    await this.webActions.waitForSelector(this.selectors.modal, {
      timeout: 5000,
    });
    await this.webActions.click(this.selectors.closeButton);
    await this.webActions.wait(500); // Wait for modal close animation
  }

  /**
   * Closes the promotional modal if it's visible, otherwise does nothing
   * Useful for tests that may or may not show the modal
   * Uses a short timeout to avoid hanging if modal doesn't appear
   */
  async closeModalIfVisible(): Promise<void> {
    await allure.step('Close promotional modal (if visible)', async () => {
      // Try aside.v-modal.global-popup first
      try {
        await this.webActions.waitForSelector(this.selectors.modal, {
          timeout: 2000,
        });
        await this.webActions.click(this.selectors.closeButton);
        await this.webActions.wait(500);
        return;
      } catch {
        // Not the aside modal — try dialog variant below
      }

      // Try CMS-driven dialog modal (e.g. "MODAL TEST" promo)
      try {
        await this.webActions.waitForSelector(this.selectors.dialogModal, {
          timeout: 1000,
        });
        await this.webActions.click(this.selectors.dialogCloseButton);
        await this.webActions.wait(500);
      } catch {
        // No modal visible — continue
      }
    });
  }

  /**
   * Checks if the promotional modal is currently visible
   */
  async isModalVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.modal);
  }
}
