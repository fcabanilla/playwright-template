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
   * If "seats" is provided, clicks that many times.
   */
  private async addTicket(seats?: number): Promise<void> {
    if (typeof seats === 'number' && seats > 0) {
      for (let i = 0; i < seats; i++) {
        const incrementButton = this.page.locator(TICKET_PICKER_SELECTORS.incrementButton).first();
        await incrementButton.click();
      }
    } else {
      const incrementButton = this.page.locator(TICKET_PICKER_SELECTORS.incrementButton).first();
      await incrementButton.click();
    }
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
  async selectTicket(seats?: number): Promise<void> {
    await this.addTicket(seats);
    const ticketCount = await this.getTicketCount();
    await assertTicketCount(ticketCount, seats ?? 1);
    await this.confirmTickets();
  }

  /**
   * Retrieves the title/description of each ticket type available in the list.
   * Returns an array of ticket type names.
   */
  async getTicketTypeNames(): Promise<string[]> {
    await this.page.waitForSelector(TICKET_PICKER_SELECTORS.ticketTitle, { timeout: 7000 });
    const ticketRows = this.page.locator(TICKET_PICKER_SELECTORS.ticketRow);
    const count = await ticketRows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const row = ticketRows.nth(i);
      let name = '';
      try {
        name = await row.locator(TICKET_PICKER_SELECTORS.ticketTitle).innerText();
      } catch (e) {
        const html = await row.innerHTML();
        console.log(`No se encontró título en fila ${i}. HTML:`, html);
      }
      names.push(name.trim());
    }
    return names;
  }
}
