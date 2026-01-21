/**
 * Auth Setup Tests
 *
 * Generates storageState files with cookie consent for all platforms/environments.
 * These tests run BEFORE main test execution (via project dependencies).
 *
 * **How it works:**
 * 1. Navigates to baseUrl per platform/environment
 * 2. Waits for OneTrust banner to appear
 * 3. Accepts cookies using CookieBanner Page Object
 * 4. Saves context.storageState() to state/ directory
 * 5. Main test projects load storageState automatically
 *
 * **Usage:**
 * ```bash
 * # Run setup for all platforms
 * npx playwright test --project=setup
 *
 * # Run setup for specific environment
 * TEST_ENV=preprod npx playwright test --project=setup
 *
 * # Run setup for specific platform
 * PLATFORM=cinesa npx playwright test --project=setup
 * ```
 *
 * **Output:**
 * - state/consented.production.es.json (Cinesa Spain)
 * - state/consented.production.it.json (UCI Italy)
 * - state/consented.preprod.es.json (Cinesa Preprod)
 * - ... (one per environment/platform)
 *
 * @see docs/adrs/0014-cookie-consent-persistence-with-storage-state.md
 * @since 1.0.0
 */

import { test as setup, Page, BrowserContext } from '@playwright/test';
import { WebActions } from '../../core/webactions/webActions';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner.page';
import { getAuthSetupConfigs } from './auth.data';
import { getCloudflareHeaders } from '../../core/cloudflare/cloudflareHeaders';

const configs = getAuthSetupConfigs();

const REQUIRED_CONSENT_COOKIES = ['OptanonConsent', 'OptanonAlertBoxClosed'];

async function waitForOneTrustReady(page: Page, timeoutMs: number = 15000): Promise<void> {
  const candidates = ['#onetrust-banner-sdk', '#onetrust-consent-sdk'];
  const deadline = Date.now() + timeoutMs;

  // Poll asynchronously instead of using a fixed sleep
  while (Date.now() < deadline) {
    for (const selector of candidates) {
      const locator = page.locator(selector);
      if (await locator.isVisible({ timeout: 250 }).catch(() => false)) {
        return;
      }
    }
    await page.waitForTimeout(250);
  }

  throw new Error('OneTrust banner/sdk did not appear within timeout');
}

async function validateConsentCookies(
  context: BrowserContext,
  platform: string,
  environment: string
): Promise<void> {
  const cookies = await context.cookies();
  const optanonCookies = cookies.filter((cookie) =>
    REQUIRED_CONSENT_COOKIES.includes(cookie.name)
  );

  const missing = REQUIRED_CONSENT_COOKIES.filter(
    (name) => !optanonCookies.some((cookie: any) => cookie.name === name)
  );

  if (missing.length > 0) {
    throw new Error(
      `[Consent] Missing cookies for ${platform}/${environment}: ${missing.join(', ')}`
    );
  }

  console.log(
    `✅ [Consent] Captured cookies for ${platform}/${environment}: ${optanonCookies
      .map((cookie: any) => cookie.name)
      .join(', ')}`
  );
}

for (const config of configs) {
  setup(
    `Accept cookies - ${config.platform} ${config.environment} (${config.region})`,
    async ({ browser }) => {
      console.log(
        `\n🚀 Setting up consent for ${config.platform} ${config.environment}`
      );
      console.log(`   Base URL: ${config.baseUrl}`);
      console.log(`   Output: ${config.outputPath}`);

      const cloudflareHeaders = getCloudflareHeaders(config.environment);
      if (cloudflareHeaders) {
        console.log(
          `   Cloudflare headers applied: ${Object.keys(cloudflareHeaders).join(', ')}`
        );
      } else {
        console.log('   Cloudflare headers applied: none');
      }
      console.log('');

      const context = await browser.newContext({
        locale: config.locale,
        viewport: { width: 1920, height: 1080 },
        extraHTTPHeaders: cloudflareHeaders,
      });

      const page = await context.newPage();
      const webActions = new WebActions(page);
      const cookieBanner = new CookieBanner(webActions);

      // Navigate to base URL
      console.log('🌐 Navigating to baseUrl...');
      await page.goto(config.baseUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for OneTrust to be ready (async polling)
      console.log('⏳ Waiting for OneTrust banner/SDK to be ready...');
      await waitForOneTrustReady(page).catch((error: unknown) => {
        console.warn(`⚠️  OneTrust wait warning: ${String(error)}`);
      });

      // Accept cookies using existing Page Object (includes waiting for banner to disappear)
      console.log(
        '🍪 Accepting cookies and waiting for banner to disappear...'
      );
      await cookieBanner.acceptAllCookies();

      // Validate captured consent cookies before saving
      await validateConsentCookies(context, config.platform, config.environment);

      // Save storage state
      console.log(`💾 Saving storageState to ${config.outputPath}...`);
      await context.storageState({ path: config.outputPath });

      console.log(
        `✅ Setup completed for ${config.platform} ${config.environment}\n`
      );

      await context.close();
    }
  );
}
