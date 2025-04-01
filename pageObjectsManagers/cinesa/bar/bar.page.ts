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
      const isPopupVisible = await this.page.locator(BAR_SELECTORS.popup).isVisible();
      if (isPopupVisible) {
        console.log('Popup detected. Closing it.');
        await this.page.locator(BAR_SELECTORS.popupCloseButton).click();
      } else {
        console.log('No popup detected.');
      }
      
      console.log('Clicking the main bar button.');
      await this.page.locator(BAR_SELECTORS.barMainButton).click();
    });
  }
}
