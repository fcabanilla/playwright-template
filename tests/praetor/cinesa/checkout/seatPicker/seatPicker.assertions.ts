/**
 * PRAETOR SeatPicker assertions — Allure-wrapped expect() calls.
 *
 * Receives Page directly (ADR-0009 exception for assertions layer).
 */
import { Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import {
  seatPickerSelectors,
  SeatPickerSelectors,
} from '../../../../../core/selectors/checkout';

export class PraetorSeatPickerAssertions {
  readonly page: Page;
  readonly selectors: SeatPickerSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = seatPickerSelectors;
  }

  /** Verify seats are rendered on the page */
  async expectSeatsVisible(): Promise<void> {
    await allure.step('Verify seats are visible', async () => {
      const seats = this.page.locator(this.selectors.seat);
      await expect(seats.first()).toBeVisible({ timeout: 15000 });
    });
  }

  /** Verify minimum number of seats */
  async expectMinimumSeatCount(min: number): Promise<void> {
    await allure.step(`Verify at least ${min} seats exist`, async () => {
      const count = await this.page.locator(this.selectors.seat).count();
      await allure.parameter('Seat count', String(count));
      expect(count).toBeGreaterThanOrEqual(min);
    });
  }

  /** Verify at least one seat is selected */
  async expectSeatSelected(): Promise<void> {
    await allure.step('Verify at least one seat is selected', async () => {
      const selected = this.page.locator(this.selectors.seatSelected);
      await expect(selected.first()).toBeVisible();
    });
  }

  /** Verify no seats are selected */
  async expectNoSeatsSelected(): Promise<void> {
    await allure.step('Verify no seats are selected', async () => {
      const count = await this.page
        .locator(this.selectors.seatSelected)
        .count();
      expect(count).toBe(0);
    });
  }

  /** Verify confirm button is visible */
  async expectConfirmButtonVisible(): Promise<void> {
    await allure.step('Verify confirm button is visible', async () => {
      await expect(
        this.page.locator(this.selectors.confirmButton)
      ).toBeVisible();
    });
  }

  /** Verify confirm button is enabled (seat selected) */
  async expectConfirmButtonEnabled(): Promise<void> {
    await allure.step('Verify confirm button is enabled', async () => {
      await expect(
        this.page.locator(this.selectors.confirmButton)
      ).toBeEnabled();
    });
  }

  /** Verify confirm button is disabled (no seat selected) */
  async expectConfirmButtonDisabled(): Promise<void> {
    await allure.step('Verify confirm button is disabled', async () => {
      await expect(
        this.page.locator(this.selectors.confirmButton)
      ).toBeDisabled();
    });
  }

  /** Verify available seats exist */
  async expectAvailableSeatsExist(): Promise<void> {
    await allure.step('Verify available seats exist', async () => {
      const available = this.page.locator(this.selectors.seatAvailable);
      await expect(available.first()).toBeVisible();
    });
  }

  /** Verify navigated to login page after confirming seats */
  async expectNavigatedToLogin(): Promise<void> {
    await allure.step('Verify navigation to login page', async () => {
      await this.page.waitForURL('**/compra/inicio-de-sesion/**', {
        timeout: 15000,
        waitUntil: 'domcontentloaded',
      });
      expect(this.page.url()).toContain('/compra/inicio-de-sesion/');
    });
  }
}
