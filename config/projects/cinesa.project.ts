import type { Project } from '@playwright/test';
import { COMMON_TIMEOUTS, COMMON_BROWSER_ARGS } from './common.config';
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
    // 'login/**',
    // 'signup/**',  // ✅ Signup tests now included
    'mail/**', // por si existiera
    'mailing/**', // carpeta real según tu árbol

    // Files (por si quedan sueltos fuera de esas carpetas)
    '**/*auth.saveState*.spec.ts',
    '**/*auth-save*.spec.ts',
    '**/*authSave*.spec.ts',
  ];

  return {
    name: 'Cinesa',
    testDir: './tests/cinesa',
    testIgnore: TESTS_TO_IGNORE,
    outputDir: '.allure/playwright-artifacts', // Explicitly set output directory for this project
    use: {
      headless: true,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure', // Changed from 'on' - only retains video if test fails
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
