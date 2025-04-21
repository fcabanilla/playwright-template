import { Page } from '@playwright/test';
import { PROGRAMS_PAGE_SELECTORS } from './programs.selectors';

export class ProgramsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Espera a que la página de programas esté visible.
   */
  async waitForProgramsPage(): Promise<void> {
    await this.page.waitForSelector(PROGRAMS_PAGE_SELECTORS.gridRow, { state: 'visible', timeout: 10000 });
  }

  /**
   * Hace clic en el botón de la tarjeta derecha (Unlimited).
   */
  async clickUnlimitedButton(): Promise<void> {
    await this.page.waitForSelector(PROGRAMS_PAGE_SELECTORS.unlimitedButton, { state: 'visible', timeout: 10000 });
    await this.page.click(PROGRAMS_PAGE_SELECTORS.unlimitedButton);
  }
}
