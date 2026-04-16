import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { PROGRAMS_PAGE_SELECTORS } from './programs.selectors';

export class ProgramsPage {
  constructor(private readonly webActions: WebActions) {}

  /**
   * Waits for the programs page grid to be visible.
   */
  async waitForProgramsPage(): Promise<void> {
    await allure.step('Wait for programs page to load', async () => {
      await this.webActions.waitForVisible(PROGRAMS_PAGE_SELECTORS.gridRow);
    });
  }

  /**
   * Clicks the Unlimited program button (right card).
   */
  async clickUnlimitedButton(): Promise<void> {
    await allure.step('Click Unlimited program button', async () => {
      await this.webActions.waitForVisible(
        PROGRAMS_PAGE_SELECTORS.unlimitedButton
      );
      await this.webActions.click(PROGRAMS_PAGE_SELECTORS.unlimitedButton);
    });
  }
}
