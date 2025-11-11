import type { Project } from '@playwright/test';
import {
  COMMON_TIMEOUTS,
  COMMON_SCREENSHOTS,
  COMMON_BROWSER_ARGS,
} from './common.config';
import { getCinesaStorageStatePath } from './storageState.helper';

/**
 * Cinesa project:
 * - Exclude auth-related and infra checks from discovery (no Allure noise).
 * - Scopes testIgnore to this project only.
 */
export function getCinesaProject(): Project {
  const env = process.env.TEST_ENV;

  // Globs are resolved from testDir; keep them short and explicit.
  const TESTS_TO_IGNORE = [
    // Folders
    'cloudflare/**',
//    'login/**',
//    'signup/**',
    'mail/**',      // por si existiera
    'mailing/**',   // carpeta real según tu árbol

    // Files (por si quedan sueltos fuera de esas carpetas)
    '**/*auth.saveState*.spec.ts',
    '**/*auth-save*.spec.ts',
    '**/*authSave*.spec.ts',
  ];

  return {
    name: 'Cinesa',
    testDir: './tests/cinesa',
    testIgnore: TESTS_TO_IGNORE,
    use: {
      headless: true,
      ...COMMON_SCREENSHOTS,
      actionTimeout: COMMON_TIMEOUTS.action,
      navigationTimeout: COMMON_TIMEOUTS.navigation,
      storageState: getCinesaStorageStatePath(env),
      launchOptions: {
        args: [...COMMON_BROWSER_ARGS],
      },
    },
  };
}
