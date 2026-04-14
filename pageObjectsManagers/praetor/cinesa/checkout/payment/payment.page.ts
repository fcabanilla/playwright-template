import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { paymentSelectors, PaymentSelectors } from '../../../../../core/selectors/checkout';

/**
 * PRAETOR Payment Page Object — Cinesa checkout step 6 (Payment).
 *
 * Handles gift card payment and Redsys credit card presence verification.
 * We do NOT complete actual payments in tests — we only verify the payment
 * page loads correctly with expected elements.
 *
 * Verified DOM selectors from MCP exploration on preprod Oasiz (2026-04-13).
 */
export class PraetorPayment {
  private readonly page: Page;
  private readonly selectors: PaymentSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = paymentSelectors;
  }

  /** Wait for the payment page to fully load */
  async waitForPageLoad(): Promise<void> {
    await allure.step('Wait for payment page', async () => {
      await this.page
        .locator(this.selectors.heading)
        .filter({ hasText: 'Pago' })
        .waitFor({ state: 'visible', timeout: 15000 });
    });
  }

  /** Check if the Redsys credit card option is visible */
  async isRedsysVisible(): Promise<boolean> {
    return allure.step('Check Redsys credit card visibility', async () => {
      const redsys = this.page.locator(this.selectors.redsysContainer);
      return redsys.isVisible();
    });
  }

  /** Check if the gift card section is visible */
  async isGiftCardSectionVisible(): Promise<boolean> {
    return allure.step('Check gift card section visibility', async () => {
      const giftCard = this.page.locator(this.selectors.giftCardFormContainer);
      return giftCard.isVisible();
    });
  }

  /** Check if the gift card number input is enabled */
  async isGiftCardEnabled(): Promise<boolean> {
    return allure.step('Check gift card enabled state', async () => {
      const input = this.page.locator(this.selectors.giftCardNumberInput);
      return input.isEnabled();
    });
  }

  /** Get the displayed total amount text */
  async getTotalAmount(): Promise<string> {
    return allure.step('Get payment total amount', async () => {
      // Find the total label and its adjacent value
      const totalSection = this.page.locator('text=Total').first();
      const parent = totalSection.locator('..');
      const priceEl = parent
        .locator('div, span')
        .filter({ hasText: /\d+,\d+\s*€/ })
        .first();
      return (await priceEl.textContent())?.trim() ?? '';
    });
  }

  /** Verify the payment page has all required elements */
  async verifyPaymentPageElements(): Promise<void> {
    await allure.step('Verify payment page elements', async () => {
      await this.waitForPageLoad();

      // Verify heading
      await this.page
        .locator(this.selectors.heading)
        .filter({ hasText: 'Pago del pedido' })
        .waitFor({ state: 'visible' });

      // Verify Redsys container
      await this.page
        .locator(this.selectors.redsysContainer)
        .waitFor({ state: 'visible', timeout: 10000 });
    });
  }
}
