/**
 * Shared context factory — creates a BrowserContext with Cloudflare bypass,
 * storage state, and consent seeds pre-configured.
 *
 * Used by both Cinesa and Praetor fixture files to eliminate duplication
 * of the context override logic (~40 lines per fixture file).
 *
 * Usage in fixture files:
 * ```ts
 * import { createCinesaContext } from '../shared/contextFactory';
 *
 * export const test = base.extend<MyFixtures>({
 *   context: async ({ browser }, use) => {
 *     const context = await createCinesaContext(browser);
 *     await use(context);
 *     await context.close();
 *   },
 * });
 * ```
 */

import type { Browser, BrowserContext } from '@playwright/test';
import { WebActions } from '../../core/webactions/webActions';
import { getCloudflareHeaders } from '../../core/cloudflare/cloudflareHeaders';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../config/environments';

/**
 * Creates a BrowserContext configured for Cinesa environments:
 * - Cloudflare header + cookie injection (preprod/lab)
 * - Storage state restoration (if available)
 * - Consent seeds (if no storage state)
 * - Native User Agent preservation
 */
export async function createCinesaContext(
  browser: Browser,
): Promise<BrowserContext> {
  const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
  const config = getCinesaConfig(env);
  const headers = getCloudflareHeaders(env);

  // Get storageState path from project configuration
  const { getCinesaStorageStatePath } = await import(
    '../../config/projects/storageState.helper'
  );
  const storageStatePath = getCinesaStorageStatePath(env);

  // Get native User Agent from the current browser
  const tempContext = await browser.newContext();
  const tempPage = await tempContext.newPage();
  const originalUA = await tempPage.evaluate(() => navigator.userAgent);
  await tempContext.close();

  const suffix = process.env.USER_AGENT_SUFFIX
    ? ` ${process.env.USER_AGENT_SUFFIX}`
    : '';
  const finalUserAgent = originalUA + suffix;

  // Create context WITH storageState if available
  const context = await browser.newContext({
    userAgent: finalUserAgent,
    ...(storageStatePath ? { storageState: storageStatePath } : {}),
  });

  // Inject Cloudflare credentials (headers + cookie)
  if (headers) {
    await context.setExtraHTTPHeaders(headers);

    const clientSecret = headers['CF-Access-Client-Secret'];
    if (clientSecret) {
      await context.addCookies([
        {
          name: 'CF-Access-Client-Secret',
          value: clientSecret,
          domain: '.ocgtest.es',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'Lax',
        },
      ]);
    }
  }

  // Apply consent seeds if NO storageState is configured
  const hasStorageState = storageStatePath !== undefined;
  if (!hasStorageState) {
    const page = await context.newPage();
    const webActions = new WebActions(page);
    await webActions.applyConsentSeedsFor(config.baseUrl);
    await page.close();
  }

  return context;
}
