import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { PURCHASE_SUMMARY_SELECTORS } from './purchaseSummary.selectors';
import { purchaseSummaryTestData } from './purchaseSummary.data';

/**
 * The PurchaseSummary Page Object Model.
 * Contains methods to interact with the purchase summary page.
 */
export class PurchaseSummary {
  readonly webActions: WebActions;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
  }

  /**
   * Accepts terms and conditions and clicks the continue button.
   */
  async acceptAndContinue(): Promise<void> {
    const { firstName, lastName, email, phone } = purchaseSummaryTestData;
    await this.fillForm(firstName, lastName, email, phone);
    await this.acceptTermsAndConditions();
    await this.clickContinue();
    await this.confirmPopup();
  }

  /**
   * Accepts the terms and conditions by checking the checkbox.
   * @private
   */
  private async acceptTermsAndConditions(): Promise<void> {
    await allure.step('Accepting terms and conditions', async () => {
      // Wait for terms checkbox and click it using WebActions
      await this.webActions.click(PURCHASE_SUMMARY_SELECTORS.termsCheckbox, 'Accept terms and conditions');
    });
  }

  /**
   * Clicks the continue button to proceed.
   * @private
   */
  private async clickContinue(): Promise<void> {
    await allure.step('Clicking the continue button', async () => {
      await this.webActions.click(PURCHASE_SUMMARY_SELECTORS.continueButton, 'Click continue button');
    });
  }

  /**
   * Confirms the popup by clicking the confirm button.
   * @private
   */
  private async confirmPopup(): Promise<void> {
    await allure.step('Confirming popup', async () => {
      // Wait for confirm button to be visible and enabled, then click it
      await this.webActions.expectVisible(PURCHASE_SUMMARY_SELECTORS.confirmPopupButton);
      await this.webActions.click(PURCHASE_SUMMARY_SELECTORS.confirmPopupButton, 'Confirm popup');
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
    await allure.step('Filling out the form', async () => {
      // Use WebActions fill method for full ADR-0009 compliance
      await this.webActions.fill(PURCHASE_SUMMARY_SELECTORS.firstNameInput, firstName);
      await this.webActions.fill(PURCHASE_SUMMARY_SELECTORS.lastNameInput, lastName);
      await this.webActions.fill(PURCHASE_SUMMARY_SELECTORS.emailInput, email);
      await this.webActions.fill(PURCHASE_SUMMARY_SELECTORS.phoneInput, phone);
    });
  }
}
