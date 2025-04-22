import { Page } from '@playwright/test';
import { TICKET_PICKER_SELECTORS } from './ticketPicker.selectors';
import { assertTicketCount } from '../../../tests/cinesa/ticketPicker/ticketPicker.assertions';

export class TicketPicker {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Adds a ticket by clicking the increment button.
   */
  private async addTicket(): Promise<void> {
    const incrementButton = this.page.locator(TICKET_PICKER_SELECTORS.incrementButton).first();
    await incrementButton.click();
  }

  /**
   * Gets the current ticket count from the input field.
   */
  private async getTicketCount(): Promise<number> {
    const inputField = this.page.locator(TICKET_PICKER_SELECTORS.quantityInput).first();
    const value = await inputField.inputValue();
    return parseInt(value, 10);
  }

  /**
   * Confirms the selected tickets by clicking the confirm button.
   */
  private async confirmTickets(): Promise<void> {
    const confirmButton = this.page.locator(TICKET_PICKER_SELECTORS.confirmButton);
    await confirmButton.click();
  }

  /**
   * Handles ticket selection, validation, and confirmation.
   */
  async selectTicket(): Promise<void> {
    await this.addTicket();
    const ticketCount = await this.getTicketCount();
    await assertTicketCount(ticketCount, 1); // Use the assertion for validation
    await this.confirmTickets();
  }
}
