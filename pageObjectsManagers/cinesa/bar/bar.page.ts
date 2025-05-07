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
   * Handles the bar page by clicking the button inside the modal and the main button.
   */
  async skipBar(): Promise<void> {
    await allure.test.step('Handling the bar modal and main button', async () => {
      const modal = this.page.locator(BAR_SELECTORS.modal);
      const modalButton = this.page.locator(BAR_SELECTORS.modalButton);
      const mainButton = this.page.locator(BAR_SELECTORS.barMainButton);

      await modal.waitFor({ state: 'visible', timeout: 10000 });
      if (await modal.isVisible()) {
        await modalButton.waitFor({ state: 'visible', timeout: 5000 });
        await modalButton.click();
        await modal.waitFor({ state: 'hidden', timeout: 5000 });
      }

      await mainButton.waitFor({ state: 'visible', timeout: 5000 });
      await mainButton.click();
    });
  }
}
