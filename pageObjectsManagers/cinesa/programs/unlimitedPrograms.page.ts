import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { PROGRAMS_SELECTORS } from './unlimitedPrograms.selectors';

/**
 * The Programs Page Object Model.
 * Contains methods to interact with the programs page.
 */
export class UnlimitedProgramsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the programs unlimited page to load completely.
   */
  async waitForProgramsUnlimitedPage(): Promise<void> {
    await allure.test.step('Waiting for programs page to load', async () => {
      await this.page.waitForSelector(PROGRAMS_SELECTORS.container, {
        state: 'visible',
        timeout: 10000,
      });
      await this.page.waitForSelector(PROGRAMS_SELECTORS.tarjetas.container, {
        state: 'visible',
        timeout: 10000,
      });
      await this.page.waitForSelector(PROGRAMS_SELECTORS.tarjetas.card, {
        state: 'visible',
        timeout: 10000,
      });
    });
  }

  /**
   * Waits for the programs page to load completely.
   */
  async waitForProgramsPage(): Promise<void> {
    await allure.test.step('Waiting for unlimited programs page to load', async () => {
      await this.page.waitForSelector(PROGRAMS_SELECTORS.container, {
        state: 'visible',
        timeout: 10000,
      });
      await this.page.waitForSelector(PROGRAMS_SELECTORS.tarjetas.container, {
        state: 'visible',
        timeout: 10000,
      });
      await this.page.waitForSelector(PROGRAMS_SELECTORS.tarjetas.card, {
        state: 'visible',
        timeout: 10000,
      });
    });
  }
}
