import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  promoModalSelectors,
  PromoModalSelectors,
} from './promoModal.selectors';

/**
 * Handles promotional modal that appears on UCI Cinemas.
 * This modal has an overlay that blocks all interactions until closed.
 */
export class PromoModal {
  readonly page: Page;
  readonly selectors: PromoModalSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = promoModalSelectors;
  }

  /**
   * Waits for the promotional modal to appear and closes it.
   * This method should be called at the beginning of each test to avoid blocking.
   */
  async waitAndCloseModal(): Promise<void> {
    await allure.test.step(
      'Waiting and closing promotional modal',
      async () => {
        try {
          // Wait up to 10 seconds for the modal to appear
          console.log('Waiting for promotional modal...');
          await this.page.waitForTimeout(3000);

          // Check if modal is present using overlay as indicator
          const overlay = this.page.locator(this.selectors.overlay);
          const isModalVisible = await overlay.isVisible({ timeout: 5000 });

          if (isModalVisible) {
            console.log('Promotional modal detected, closing...');

            // Strategy 1: Use specific close button (size-10 and z-50)
            try {
              const closeButton = this.page.locator(this.selectors.closeButton);
              await closeButton.click({ timeout: 5000 });
              console.log('Modal closed using specific button');
            } catch (buttonError) {
              console.log(
                'Failed with specific button, trying alternative selector...'
              );

              // Strategy 2: Use the original codegen selector
              const alternativeCloseButton = this.page
                .locator('section')
                .filter({
                  hasText:
                    /^Prevendite aperte per Demon SlayerCorri a prendere il tuo biglietto!Acquista$/,
                })
                .getByRole('button');

              await alternativeCloseButton.click({ timeout: 5000 });
              console.log('Modal closed using alternative selector');
            }

            // Wait for overlay to disappear
            await overlay.waitFor({ state: 'hidden', timeout: 10000 });
            console.log('Promotional modal closed successfully');

            // Wait an additional moment for the page to stabilize
            await this.page.waitForTimeout(2000);
          } else {
            console.log('No promotional modal detected');
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          console.log('Error handling promotional modal:', message);

          // Emergency strategy: Press Escape
          try {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(2000);
            console.log('Modal closed with Escape key');
          } catch (escapeError) {
            const escapeMessage =
              escapeError instanceof Error
                ? escapeError.message
                : String(escapeError);
            console.log('Could not close with Escape:', escapeMessage);
          }
        }
      }
    );
  }

  /**
   * Checks if the promotional modal is currently visible.
   */
  async isModalVisible(): Promise<boolean> {
    try {
      const overlay = this.page.locator(this.selectors.overlay);
      return await overlay.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  /**
   * Clicks on the "Acquista" button of the modal without closing it.
   * Useful for tests that want to test the modal functionality.
   */
  async clickCTA(): Promise<void> {
    await allure.test.step('Clicking on modal CTA button', async () => {
      const ctaButton = this.page.locator(this.selectors.ctaButton);
      await ctaButton.click();
    });
  }
}
