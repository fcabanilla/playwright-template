import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  purchaseSummarySelectors,
  PurchaseSummarySelectors,
  CustomerDetails,
  DEFAULT_GUEST_DETAILS,
} from '../../../../../core/selectors/checkout';
import { WebActions } from '../../../../../core/webactions/webActions';

/**
 * PRAETOR PurchaseSummary Page Object — Cinesa checkout step 5 (Order Review).
 *
 * Handles customer details form, terms acceptance, email confirmation modal,
 * and navigation to payment page.
 *
 * Verified DOM selectors from MCP exploration on preprod Oasiz (2026-04-13).
 */
export class PraetorPurchaseSummary {
  private readonly webActions: WebActions;
  private readonly page: Page;
  private readonly selectors: PurchaseSummarySelectors;

  constructor(page: Page) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.selectors = purchaseSummarySelectors;
  }

  /** Wait for the purchase summary page to fully load */
  async waitForPageLoad(): Promise<void> {
    await allure.step('Wait for purchase summary page', async () => {
      await this.page
        .locator(this.selectors.heading)
        .filter({ hasText: 'Resumen' })
        .waitFor({ state: 'visible', timeout: 15000 });
    });
  }

  /** Fill customer details form with provided or default data */
  async fillCustomerDetails(
    details: CustomerDetails = DEFAULT_GUEST_DETAILS
  ): Promise<void> {
    await allure.step('Fill customer details form', async () => {
      await this.webActions.fill(
        this.selectors.firstNameInput,
        details.firstName,
        'firstNameInput'
      );
      await this.webActions.fill(
        this.selectors.lastNameInput,
        details.lastName,
        'lastNameInput'
      );
      await this.webActions.fill(
        this.selectors.emailInput,
        details.email,
        'emailInput'
      );
      await this.webActions.fill(
        this.selectors.phoneInput,
        details.phone,
        'phoneInput'
      );
    });
  }

  /** Accept privacy policy and terms checkbox */
  async acceptTerms(): Promise<void> {
    await allure.step('Accept privacy policy and terms', async () => {
      // The actual checkbox input is covered by a styled div wrapper —
      // click the wrapper instead of the input to avoid intercept errors
      const wrapper = this.page.locator(this.selectors.termsCheckboxWrapper);
      await wrapper.click();

      // Verify checkbox is now checked
      const input = this.page.locator(this.selectors.termsCheckboxInput);
      await input.waitFor({ state: 'attached' });
    });
  }

  /** Click the main "Continuar" button */
  async clickContinue(): Promise<void> {
    await allure.step('Click continue button', async () => {
      await this.page.locator(this.selectors.continueButton).click();
    });
  }

  /** Handle the email confirmation modal that appears after clicking continue */
  async confirmEmailModal(): Promise<void> {
    await allure.step('Confirm email in modal', async () => {
      const modal = this.page.locator(this.selectors.emailConfirmationModal);
      await modal.waitFor({ state: 'visible', timeout: 10000 });

      const confirmBtn = this.page.locator(
        this.selectors.emailConfirmationConfirmButton
      );
      await confirmBtn.click();

      // Wait for navigation to payment page (use domcontentloaded — Redsys
      // external scripts delay the full 'load' event on preprod)
      await this.page.waitForURL('**/pago-del-pedido/**', {
        timeout: 25000,
        waitUntil: 'domcontentloaded',
      });
    });
  }

  /**
   * Complete the entire purchase summary step:
   * fill form → accept terms → click continue → confirm email modal
   */
  async acceptAndContinue(
    details: CustomerDetails = DEFAULT_GUEST_DETAILS
  ): Promise<void> {
    await allure.step('Complete purchase summary', async () => {
      await this.waitForPageLoad();
      await this.fillCustomerDetails(details);
      await this.acceptTerms();
      await this.clickContinue();
      await this.confirmEmailModal();
    });
  }

  /** Get the total order amount text */
  async getTotalAmount(): Promise<string> {
    return allure.step('Get total amount', async () => {
      const heading = this.page.locator('text=Total').first();
      const parent = heading.locator('..');
      const priceEl = parent.locator('div, span').filter({ hasText: /\d+,\d+\s*€/ }).first();
      return (await priceEl.textContent()) ?? '';
    });
  }

  /** Check if the countdown timer is visible */
  async isCountdownVisible(): Promise<boolean> {
    return allure.step('Check countdown visibility', async () => {
      const timer = this.page.locator(this.selectors.countdownTimer);
      return timer.isVisible();
    });
  }
}
