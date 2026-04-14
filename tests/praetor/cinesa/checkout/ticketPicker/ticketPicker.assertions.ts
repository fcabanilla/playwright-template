/**
 * PRAETOR TicketPicker assertions — Allure-wrapped expect() calls.
 *
 * Receives Page directly (ADR-0009 exception for assertions layer).
 */
import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  ticketPickerSelectors,
  TicketPickerSelectors,
} from '../../../../../core/selectors/checkout/ticketPicker.selectors';

export class PraetorTicketPickerAssertions {
  private readonly page: Page;
  private readonly selectors: TicketPickerSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = ticketPickerSelectors;
  }

  /** Verify ticket rows are visible on the page */
  async expectTicketRowsVisible(): Promise<void> {
    await allure.step('Verify ticket rows are visible', async () => {
      const rows = this.page.locator(this.selectors.ticketRow);
      await expect(rows.first()).toBeVisible({ timeout: 30000 });
    });
  }

  /** Verify minimum number of ticket rows */
  async expectMinimumTicketRows(min: number): Promise<void> {
    await allure.step(`Verify at least ${min} ticket rows`, async () => {
      const count = await this.page.locator(this.selectors.ticketRow).count();
      await allure.parameter('Ticket row count', String(count));
      expect(count).toBeGreaterThanOrEqual(min);
    });
  }

  /** Verify confirm button is disabled (no tickets selected) */
  async expectConfirmButtonDisabled(): Promise<void> {
    await allure.step('Verify confirm button is disabled', async () => {
      const button = this.page.locator(this.selectors.confirmButton).first();
      await expect(button).toBeDisabled();
    });
  }

  /** Verify confirm button is enabled (tickets selected) */
  async expectConfirmButtonEnabled(): Promise<void> {
    await allure.step('Verify confirm button is enabled', async () => {
      const button = this.page.locator(this.selectors.confirmButton).first();
      await expect(button).toBeEnabled();
    });
  }

  /** Verify navigated to bar page after confirming tickets */
  async expectNavigatedToBar(): Promise<void> {
    await allure.step('Verify navigation to bar page', async () => {
      await this.page.waitForURL('**/compra/productos-de-bar/**', {
        timeout: 15000,
        waitUntil: 'domcontentloaded',
      });
      expect(this.page.url()).toContain('/compra/productos-de-bar/');
    });
  }

  /** Verify ticket prices are displayed */
  async expectTicketPricesVisible(): Promise<void> {
    await allure.step('Verify ticket prices are visible', async () => {
      const prices = this.page.locator(this.selectors.ticketPrice);
      const count = await prices.count();
      expect(count).toBeGreaterThan(0);

      // Verify at least one price has text content
      const firstPrice = await prices.first().textContent();
      expect(firstPrice).toBeTruthy();
    });
  }
}
