import type { Project } from '@playwright/test';
import {
  COMMON_TIMEOUTS,
  COMMON_SCREENSHOTS,
  COMMON_BROWSER_ARGS,
} from './common.config';
import { getCinesaStorageStatePath } from './storageState.helper';

/**
 * Cinesa Portugal project:
 * - Same test structure as Cinesa Spain but pointing to Portuguese environments
 * - Uses same Page Objects and fixtures (multi-region support)
 * - Exclude auth-related and infra checks from discovery
 */
export function getCinesaPortugalProject(): Project {
  const env = process.env.TEST_ENV;

  // Globs are resolved from testDir; keep them short and explicit.
  const TESTS_TO_IGNORE = [
    // Folders
    'cloudflare/**',
    'login/**',
    'signup/**',
    'mail/**',
    'mailing/**',

    // Files
    '**/*auth.saveState*.spec.ts',
    '**/*auth-save*.spec.ts',
    '**/*authSave*.spec.ts',
  ];

  return {
    name: 'Cinesa Portugal',
    testDir: './tests/cinesa', // Reuses same test structure
    testIgnore: TESTS_TO_IGNORE,
    use: {
      headless: true,
      ...COMMON_SCREENSHOTS,
      actionTimeout: COMMON_TIMEOUTS.action,
      navigationTimeout: COMMON_TIMEOUTS.navigation,
      locale: 'pt-PT', // Portuguese locale
      storageState: getCinesaStorageStatePath(env),
      launchOptions: {
        args: [...COMMON_BROWSER_ARGS],
      },
    },
  };
}
