/**
 * PRAETOR Authenticated Checkout assertions — Allure-wrapped expect() calls.
 *
 * Extends standard E2E assertions with logged-in user validations:
 * - Login step is skipped (navigates directly from seats to tickets)
 * - User data may be pre-filled in purchase summary
 *
 * Receives Page directly (ADR-0009 exception for assertions layer).
 */
import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  purchaseSummarySelectors,
  paymentSelectors,
} from '../../../../../core/selectors/checkout';

export class AuthenticatedCheckoutAssertions {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Verify the checkout flow skipped the login step (went directly to tickets) */
  async expectLoginStepSkipped(): Promise<void> {
    await allure.step(
      'Verify login step was skipped (authenticated session)',
      async () => {
        await this.page.waitForURL('**/compra/tus-entradas/**', {
          timeout: 20000,
          waitUntil: 'domcontentloaded',
        });
        expect(this.page.url()).toContain('/compra/tus-entradas/');
      },
    );
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

  /** Verify purchase summary form fields are visible */
  async expectSummaryFormVisible(): Promise<void> {
    await allure.step(
      'Verify purchase summary form visible',
      async () => {
        const nameInput = this.page.locator(
          purchaseSummarySelectors.firstNameInput,
        );
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        const emailInput = this.page.locator(
          purchaseSummarySelectors.emailInput,
        );
        await expect(emailInput).toBeVisible();
      },
    );
  }

  /** Verify user data is pre-filled in purchase summary (logged-in user benefit) */
  async expectUserDataPreFilled(): Promise<void> {
    await allure.step(
      'Verify user data is pre-filled (authenticated session)',
      async () => {
        const emailInput = this.page.locator(
          purchaseSummarySelectors.emailInput,
        );
        await expect(emailInput).toBeVisible({ timeout: 10000 });

        const emailValue = await emailInput.inputValue();
        expect(emailValue.length).toBeGreaterThan(0);
      },
    );
  }
}
