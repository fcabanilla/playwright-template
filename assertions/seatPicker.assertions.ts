import { expect, Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { SeatPicker } from '../pageObjectsManagers/cinesa/seatPicker';

export class SeatPickerAssertions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify the seat state using soft assertion.
   * @param seatIdentifier - Unique seat identifier.
   * @param expectedState - Expected state (e.g. 'available', 'selected')
   */
  async assertSeatState(
    seatIdentifier: string,
    expectedState: boolean
  ): Promise<void> {
    await allure.test.step(
      `Asserting seat with id "${seatIdentifier}" is "${expectedState}"`,
      async () => {
        // Uso de la función getSeatState del POM para obtener el estado del asiento.
        const seatPicker = new SeatPicker(this.page);
        const actualState = await seatPicker.getSeatState(seatIdentifier);
        await expect(
          actualState,
          `Expected state to be "${expectedState}", but got "${actualState}"`
        ).toBe(String(expectedState));
      }
    );
  }

  /**
   * Assert that the legend contains the expected items.
   * @param expectedItems - Array of expected legend labels.
   */
  async assertLegend(expectedItems: string[]): Promise<void> {
    await allure.test.step('Asserting seat picker legend', async () => {
      const legend = this.page.locator('.seat-picker-legend');
      for (const item of expectedItems) {
        await expect(
          legend.locator('span', { hasText: item }),
          `Legend item "${item}" is not visible`
        ).toBeVisible();
      }
    });
  }
}
