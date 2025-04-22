import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { BAR_SELECTORS } from './bar.selectors';

/**
 * The Bar Page Object Model.
 * Contains methods to interact with the bar page.
 */
export class BarPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Handles the bar page by skipping the popup (if present) and clicking the main button.
   */
  async skipBar(): Promise<void> {
    await allure.test.step('Handling the bar page', async () => {
      const popup = this.page.locator(BAR_SELECTORS.popup);
      const closeButton = this.page.locator(BAR_SELECTORS.popupCloseButton);
      const mainButton = this.page.locator(BAR_SELECTORS.barMainButton);

      if (await popup.isVisible()) {
        await closeButton.waitFor({ state: 'visible', timeout: 5000 });
        await closeButton.click();
        await popup.waitFor({ state: 'hidden', timeout: 5000 });
      }

      const modal = this.page.locator(BAR_SELECTORS.modal);
      if (await modal.isVisible()) {
        const modalButton = this.page.locator(BAR_SELECTORS.modalButton);
        await modalButton.waitFor({ state: 'visible', timeout: 5000 });
        await modalButton.click({ force: true });
        try {
          await modal.waitFor({ state: 'hidden', timeout: 2000 });
        } catch (error) {
        }
      }

      await mainButton.waitFor({ state: 'visible', timeout: 5000 });
      await mainButton.waitFor({ state: 'attached', timeout: 5000 });
      await mainButton.click();
    });
  }
}
