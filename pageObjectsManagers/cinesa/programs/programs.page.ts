import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { PROGRAMS_SELECTORS } from './programs.selectors';

/**
 * The Programs Page Object Model.
 * Contains methods to interact with the programs page.
 */
export class ProgramsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the programs page to load completely.
   */
  async waitForProgramsPage(): Promise<void> {
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
   * Takes a screenshot of the programs page for reporting.
   */
  async takeScreenshot(testInfo: any): Promise<void> {
    await allure.test.step('Taking screenshot of programs page', async () => {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1000);
      const screenshotBuffer = await this.page.screenshot({ fullPage: true });
      await testInfo.attach('Captura de pantalla', {
        body: screenshotBuffer,
        contentType: 'image/png'
      });
    });
  }
}
