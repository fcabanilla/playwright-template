/**
 * Cinesa authenticated fixtures — extends standard Cinesa fixtures with
 * a pre-authenticated storageState so the checkout login step is skipped.
 *
 * Only overrides the `context` fixture; all POMs (navbar, cinema,
 * cinemaDetail, seatPicker, etc.) are inherited from the base fixtures.
 *
 * Usage:
 * ```ts
 * import { test, expect } from '../../../fixtures/cinesa/playwright.authenticated.fixtures';
 * ```
 */
import { test as base } from './playwright.fixtures';
import { createCinesaContext } from '../shared/contextFactory';
import { getAuthenticatedStorageStatePath } from '../../config/projects/storageState.helper';
import { WebActions } from '../../core/webactions/webActions';
import { getCinesaConfig, CinesaEnvironment } from '../../config/environments';

const env = process.env.TEST_ENV || 'production';

export const test = base.extend({
  context: async ({ browser }, use) => {
    const authStatePath = getAuthenticatedStorageStatePath(env);

    if (!authStatePath) {
      throw new Error(
        `Authenticated storageState not found for env="${env}". ` +
        `Generate it manually or run: TEST_ENV=${env} npx playwright test --project=auth-login-setup --headed`,
      );
    }

    const context = await createCinesaContext(browser, {
      storageStatePath: authStatePath,
    });

    // Apply consent seeds — createCinesaContext skips them when storageStatePath
    // is provided, but the authenticated state file only contains auth cookies
    const config = getCinesaConfig(env as CinesaEnvironment);
    const page = await context.newPage();
    const webActions = new WebActions(page);
    await webActions.applyConsentSeedsFor(config.baseUrl);
    await page.close();

    await use(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';
