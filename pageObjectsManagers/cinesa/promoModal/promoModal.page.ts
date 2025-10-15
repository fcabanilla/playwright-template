/**
 * Page Object for Promotional Modal/Banner
 * Following ADR-0009: Page Objects delegate to WebActions, never access Playwright API directly
 *
 * This modal appears on page load with promotional content.
 * Common actions: close modal, click CTA button, check if visible
 *
 * @module PromoModalPage
 */

import { Page } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import {
  promoModalSelectors,
  PromoModalSelectors,
} from './promoModal.selectors';

/**
 * Page Object for Promotional Modal
 * Delegates all Playwright API calls to WebActions
 */
export class PromoModalPage {
  private readonly webActions: WebActions;
  readonly selectors: PromoModalSelectors;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
    this.selectors = promoModalSelectors;
  }

  /**
   * Waits for the promotional modal to be visible
   *
   * @param timeout - Optional timeout in milliseconds (default: 5000ms)
   * @returns Promise that resolves when modal is visible
   */
  async waitForModal(timeout: number = 5000): Promise<void> {
    await this.webActions.waitForVisible(this.selectors.container, timeout);
  }

  /**
   * Checks if the promotional modal is currently visible
   *
   * @returns Promise resolving to true if modal is visible, false otherwise
   */
  async isVisible(): Promise<boolean> {
    return await this.webActions.isVisible(this.selectors.container);
  }

  /**
   * Closes the promotional modal by clicking the close button (X)
   *
   * @returns Promise that resolves when modal is closed
   */
  async close(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(this.selectors.closeButton);
  }

  /**
   * Clicks the Call-to-Action button in the modal
   *
   * @returns Promise that resolves when CTA is clicked
   */
  async clickCTA(): Promise<void> {
    await this.webActions.clickWithOverlayHandling(this.selectors.ctaButton);
  }

  /**
   * Gets the modal title text
   *
   * @returns Promise resolving to title text or null if not found
   */
  async getTitle(): Promise<string | null> {
    try {
      return await this.webActions.getText(this.selectors.title);
    } catch {
      return null;
    }
  }

  /**
   * Dismisses the modal if it's visible, otherwise does nothing
   * Useful for test setup to ensure clean state
   *
   * @param timeout - Optional timeout to wait for modal (default: 5000ms)
   * @returns Promise that resolves when modal is dismissed or not present
   */
  async dismissIfVisible(timeout: number = 5000): Promise<void> {
    try {
      await this.waitForModal(timeout);
      await this.close();
    } catch {
      // Modal not present or already closed, continue
    }
  }
}
