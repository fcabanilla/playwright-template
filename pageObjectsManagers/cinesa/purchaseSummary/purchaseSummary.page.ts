import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { PURCHASE_SUMMARY_SELECTORS } from './purchaseSummary.selectors';
import { purchaseSummaryTestData } from './purchaseSummary.data';

/**
 * The PurchaseSummary Page Object Model.
 * Contains methods to interact with the purchase summary page.
 */
export class PurchaseSummary {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Accepts terms and conditions and clicks the continue button.
   */
  async acceptAndContinue(): Promise<void> {
    const { firstName, lastName, email, phone } = purchaseSummaryTestData;
    await this.fillForm(firstName, lastName, email, phone);
    await this.acceptTermsAndConditions();
    await this.clickContinue();
  }

  /**
   * Accepts the terms and conditions by checking the checkbox.
   * @private
   */
  private async acceptTermsAndConditions(): Promise<void> {
    await allure.test.step('Accepting terms and conditions', async () => {
      await this.page.waitForSelector(PURCHASE_SUMMARY_SELECTORS.termsCheckbox, { state: 'attached' });
      await this.page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      }, PURCHASE_SUMMARY_SELECTORS.termsCheckbox);
    });
  }

  /**
   * Clicks the continue button to proceed.
   * @private
   */
  private async clickContinue(): Promise<void> {
    await allure.test.step('Clicking the continue button', async () => {
      await this.page.locator(PURCHASE_SUMMARY_SELECTORS.continueButton).click();
    });
  }

  /**
   * Fills out the form with the provided data.
   * @param firstName - The first name to enter.
   * @param lastName - The last name to enter.
   * @param email - The email to enter.
   * @param phone - The phone number to enter.
   */
  private async fillForm(firstName: string, lastName: string, email: string, phone: string): Promise<void> {
    await allure.test.step('Filling out the form', async () => {
      await this.page.locator(PURCHASE_SUMMARY_SELECTORS.firstNameInput).fill(firstName);
      await this.page.locator(PURCHASE_SUMMARY_SELECTORS.lastNameInput).fill(lastName);
      await this.page.locator(PURCHASE_SUMMARY_SELECTORS.emailInput).fill(email);
      await this.page.locator(PURCHASE_SUMMARY_SELECTORS.phoneInput).fill(phone);
    });
  }
}
