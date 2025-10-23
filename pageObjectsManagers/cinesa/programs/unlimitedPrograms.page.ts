import * as allure from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { PROGRAMS_SELECTORS } from './unlimitedPrograms.selectors';

/**
 * The Unlimited Programs Page Object Model.
 * Contains methods to interact with the unlimited programs page.
 */
export class UnlimitedProgramsPage {
  constructor(private readonly webActions: WebActions) {}

  /**
   * Waits for the unlimited programs page to load completely.
   */
  async waitForProgramsUnlimitedPage(): Promise<void> {
    await allure.test.step(
      'Waiting for unlimited programs page to load',
      async () => {
        await this.webActions.waitForVisible(PROGRAMS_SELECTORS.container);
        await this.webActions.waitForVisible(
          PROGRAMS_SELECTORS.tarjetas.container
        );
        await this.webActions.waitForVisible(PROGRAMS_SELECTORS.tarjetas.card);
      }
    );
  }
}
