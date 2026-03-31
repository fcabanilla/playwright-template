import type { Project } from '@playwright/test';
import { COMMON_TIMEOUTS, COMMON_BROWSER_ARGS } from './common.config';
import { getCinesaStorageStatePath } from './storageState.helper';

/**
 * PRAETOR project — Cinesa España checkout flow suite.
 *
 * Parallel suite that coexists with legacy Cinesa tests.
 * Lab-first development with Oasiz_ cinema.
 */
export function getPraetorCinesaProject(): Project {
  const env = process.env.TEST_ENV;
  const isHeaded = process.env.PW_HEADED === '1';

  return {
    name: 'Praetor-Cinesa',
    testDir: './tests/praetor/cinesa',
    outputDir: '.allure/playwright-artifacts',
    use: {
      headless: !isHeaded,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
      actionTimeout: COMMON_TIMEOUTS.action,
      navigationTimeout: COMMON_TIMEOUTS.navigation,
      storageState: getCinesaStorageStatePath(env),
      launchOptions: {
        args: [...COMMON_BROWSER_ARGS],
      },
    },
  };
}
