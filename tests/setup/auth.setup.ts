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

import { test as setup } from '@playwright/test';
import { WebActions } from '../../core/webactions/webActions';
import { CookieBanner } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner.page';
import { getAuthSetupConfigs } from './auth.data';

const configs = getAuthSetupConfigs();

for (const config of configs) {
  setup(
    `Accept cookies - ${config.platform} ${config.environment} (${config.region})`,
    async ({ browser }) => {
      console.log(
        `\n🚀 Setting up consent for ${config.platform} ${config.environment}`
      );
      console.log(`   URL: ${config.baseUrl}`);
      console.log(`   Output: ${config.outputPath}\n`);

      const context = await browser.newContext({
        locale: config.locale,
        viewport: { width: 1920, height: 1080 },
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

      // Wait for page to stabilize
      console.log('⏳ Waiting for page to stabilize...');
      await page.waitForTimeout(3000);

      // Accept cookies using existing Page Object
      console.log('🍪 Accepting cookies via CookieBanner...');
      await cookieBanner.acceptAllCookies();

      // Wait for OneTrust banner to disappear (confirmation that consent was accepted)
      console.log('⏳ Waiting for OneTrust banner to disappear...');
      try {
        await page.waitForSelector('#onetrust-banner-sdk', {
          state: 'hidden',
          timeout: 5000,
        });
        console.log('✅ OneTrust banner disappeared');
      } catch (error) {
        console.log("⚠️  Banner didn't disappear, but continuing...");
      }

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
