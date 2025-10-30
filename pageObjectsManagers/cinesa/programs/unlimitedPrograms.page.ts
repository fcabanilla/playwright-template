import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { PROGRAMS_SELECTORS } from './unlimitedPrograms.selectors';
import { UNLIMITED_PROGRAMS_URL } from '../../../tests/cinesa/programs/programs.data';

/**
 * The Unlimited Programs Page Object Model.
 * Contains methods to interact with the unlimited programs page.
 * Follows ADR-0009: Uses WebActions abstraction, no direct Playwright API access.
 */
export class UnlimitedProgramsPage {
  constructor(private readonly webActions: WebActions) {}

  /**
   * Navigates to the unlimited programs page.
   */
  async navigateToUnlimitedPrograms(): Promise<void> {
    await allure.step('Navigate to unlimited programs page', async () => {
      await this.webActions.navigateTo(UNLIMITED_PROGRAMS_URL);
    });
  }

  /**
   * Waits for the unlimited programs page to load completely.
   */
  async waitForProgramsUnlimitedPage(): Promise<void> {
    await allure.step(
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
