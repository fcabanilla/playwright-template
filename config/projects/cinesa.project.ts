import type { Project } from '@playwright/test';
import {
  COMMON_TIMEOUTS,
  COMMON_SCREENSHOTS,
  COMMON_BROWSER_ARGS,
} from './common.config';
import { getCinesaStorageStatePath } from './storageState.helper';

export function getCinesaProject(): Project {
  const env = process.env.TEST_ENV;

  return {
    name: 'Cinesa',
    testDir: './tests/cinesa',
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
