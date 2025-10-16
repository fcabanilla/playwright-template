import type { Project } from '@playwright/test';
import {
  COMMON_TIMEOUTS,
  COMMON_SCREENSHOTS,
  COMMON_BROWSER_ARGS,
} from './common.config';
import { getUCIStorageStatePath } from './storageState.helper';

export function getUCICinemasProject(): Project {
  const env = process.env.TEST_ENV;

  return {
    name: 'UCI Cinemas',
    testDir: './tests/uci',
    use: {
      headless: true,
      ...COMMON_SCREENSHOTS,
      actionTimeout: COMMON_TIMEOUTS.action,
      navigationTimeout: COMMON_TIMEOUTS.navigation,
      storageState: getUCIStorageStatePath(env),
      launchOptions: {
        args: [...COMMON_BROWSER_ARGS],
      },
    },
  };
}
