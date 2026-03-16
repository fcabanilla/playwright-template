import type { Project } from '@playwright/test';
import getCloudflareHeaders from '../../core/cloudflare/cloudflareHeaders';

export function getCloudflareOnlyProject(): Project {
  const env = process.env.TEST_ENV;

  return {
    name: 'cloudflare-only',
    testDir: './tests/cinesa/cloudflare',
    use: {
      headless: true,
      extraHTTPHeaders: getCloudflareHeaders(env),
    },
  };
}
