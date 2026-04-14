/**
 * PRAETOR E2E assertions — Allure-wrapped expect() calls for full checkout flow.
 *
 * Receives Page directly (ADR-0009 exception for assertions layer).
 */
import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  purchaseSummarySelectors,
  paymentSelectors,
} from '../../../../../core/selectors/checkout';

export class PraetorE2EAssertions {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Verify navigation reached the purchase summary page */
  async expectOnPurchaseSummary(): Promise<void> {
    await allure.step('Verify on purchase summary page', async () => {
      await this.page.waitForURL('**/compra/resumen-de-tu-compra/**', {
        timeout: 20000,
        waitUntil: 'domcontentloaded',
      });
      expect(this.page.url()).toContain('/compra/resumen-de-tu-compra/');
    });
  }

  /** Verify the purchase summary form fields are visible */
  async expectSummaryFormVisible(): Promise<void> {
    await allure.step('Verify purchase summary form visible', async () => {
      const nameInput = this.page.locator(purchaseSummarySelectors.firstNameInput);
      await expect(nameInput).toBeVisible({ timeout: 10000 });

      const emailInput = this.page.locator(purchaseSummarySelectors.emailInput);
      await expect(emailInput).toBeVisible();
    });
  }

  /** Verify navigation reached the payment page */
  async expectOnPaymentPage(): Promise<void> {
    await allure.step('Verify on payment page', async () => {
      await this.page.waitForURL('**/compra/pago-del-pedido/**', {
        timeout: 20000,
        waitUntil: 'domcontentloaded',
      });
      expect(this.page.url()).toContain('/compra/pago-del-pedido/');
    });
  }

  /** Verify the Redsys credit card section is visible */
  async expectRedsysVisible(): Promise<void> {
    await allure.step('Verify Redsys credit card section', async () => {
      const redsys = this.page.locator(paymentSelectors.redsysContainer);
      await expect(redsys).toBeVisible({ timeout: 30000 });
    });
  }

  /** Verify the payment heading is correct */
  async expectPaymentHeading(): Promise<void> {
    await allure.step('Verify payment page heading', async () => {
      const heading = this.page.locator(paymentSelectors.heading).filter({
        hasText: 'Pago del pedido',
      });
      await expect(heading).toBeVisible({ timeout: 10000 });
    });
  }

  /** Verify gift card section on payment page */
  async expectGiftCardSection(): Promise<void> {
    await allure.step('Verify gift card section on payment', async () => {
      const giftCard = this.page.locator(paymentSelectors.giftCardFormContainer);
      await expect(giftCard).toBeVisible({ timeout: 10000 });
    });
  }

  /** Verify navigation reached the bar page */
  async expectOnBarPage(): Promise<void> {
    await allure.step('Verify on bar page', async () => {
      await this.page.waitForURL('**/compra/productos-de-bar/**', {
        timeout: 20000,
        waitUntil: 'domcontentloaded',
      });
      expect(this.page.url()).toContain('/compra/productos-de-bar/');
    });
  }

  /** Verify the ticket count matches expected */
  async expectTicketCountInSummary(expectedCount: number): Promise<void> {
    await allure.step(
      `Verify ${expectedCount} ticket(s) in summary`,
      async () => {
        const summaryText = await this.page
          .locator('.v-order-ticket')
          .allTextContents();
        const totalText = summaryText.join(' ');
        expect(totalText).toContain(`${expectedCount}x`);
      }
    );
  }
}
