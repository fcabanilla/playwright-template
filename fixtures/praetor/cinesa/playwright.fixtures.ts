import { test as base } from '@playwright/test';
import { WebActions } from '../../../core/webactions/webActions';
import { getCloudflareHeaders } from '../../../core/cloudflare/cloudflareHeaders';
import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

/**
 * PRAETOR fixtures — Cinesa España checkout flow.
 *
 * Reuses shared core (WebActions, config, Cloudflare) with checkout-specific POMs.
 * New POMs will be added as each wave is implemented.
 */

type PraetorFixtures = {
  webActions: WebActions;
};

export const test = base.extend<PraetorFixtures>({
  // Override context to auto-inject Cloudflare headers + consent seeds
  context: async ({ browser }, use) => {
    const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
    const config = getCinesaConfig(env);
    const headers = getCloudflareHeaders(env);

    // Get storageState path from project configuration
    const { getCinesaStorageStatePath } = await import(
      '../../../config/projects/storageState.helper'
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

    await use(context);
    await context.close();
  },

  // Shared WebActions instance
  webActions: async ({ page }, use) => {
    const webActions = new WebActions(page);
    await use(webActions);
  },
});

export { expect } from '@playwright/test';
