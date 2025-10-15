import { Page } from '@playwright/test';
import { promotionalModalSelectors } from './promotionalModal.selectors';

/**
 * Page Object for handling the promotional modal/popup that appears on LAB environment
 * This modal shows "VENTA ANTICIPADA" message and needs to be closed before interacting with the page
 */
export class PromotionalModal {
  private readonly page: Page;
  private readonly selectors = promotionalModalSelectors;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Closes the promotional modal by clicking the close button (X)
   * Waits for the modal to be visible first, then clicks the close button
   */
  async closeModal(): Promise<void> {
    await this.page.locator(this.selectors.modal).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator(this.selectors.closeButton).click();
    await this.page.waitForTimeout(500); // Wait for modal close animation
  }

  /**
   * Closes the promotional modal if it's visible, otherwise does nothing
   * Useful for tests that may or may not show the modal
   * Uses a short timeout to avoid hanging if modal doesn't appear
   */
  async closeModalIfVisible(): Promise<void> {
    try {
      // Wait max 2 seconds for modal to appear
      await this.page.locator(this.selectors.modal).waitFor({ state: 'visible', timeout: 2000 });
      // If we get here, modal is visible, so close it
      await this.page.locator(this.selectors.closeButton).click();
      await this.page.waitForTimeout(500);
    } catch {
      // Modal not visible or timeout, that's ok, just continue
    }
  }

  /**
   * Checks if the promotional modal is currently visible
   */
  async isModalVisible(): Promise<boolean> {
    return await this.page.locator(this.selectors.modal).isVisible();
  }
}
