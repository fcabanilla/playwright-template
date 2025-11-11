/**
 * Bootstrap Consent Script
 *
 * Generates storageState files with cookie consent for multiple environments/platforms.
 * These files eliminate the need for UI interaction with cookie banners in tests.
 *
 * **What it does:**
 * 1. Launches browser (headless=false for debugging)
 * 2. Navigates to baseUrl per environment/platform
 * 3. Executes CookieBannerPage.acceptAllCookies()
 * 4. Waits for OneTrust SDK to finalize
 * 5. Saves context.storageState({ path: 'state/consented.<env>.<region>.json' })
 * 6. Logs relevant cookies (OptanonConsent, etc.) for manual extraction
 *
 * **Usage:**
 * ```bash
 * # Bootstrap all environments
 * npx ts-node scripts/bootstrap-consent.ts
 *
 * # Bootstrap specific platform
 * PLATFORM=cinesa npx ts-node scripts/bootstrap-consent.ts
 *
 * # Bootstrap specific environment
 * ENV=production npx ts-node scripts/bootstrap-consent.ts
 * ```
 *
 * **Output:**
 * - state/consented.production.es.json (Cinesa Spain Production)
 * - state/consented.preprod.es.json (Cinesa Spain Preprod)
 * - state/consented.lab.es.json (Cinesa Spain Lab)
 * - state/consented.production.it.json (UCI Italy Production)
 * - state/consented.production.pt.json (Cinesa Portugal Production)
 *
 * @see docs/adrs/0014-cookie-consent-persistence-with-storage-state.md
 * @since 1.0.0
 */

import { chromium, BrowserContext, Page } from '@playwright/test';
import { WebActions } from '../core/webactions/webActions';
import { CookieBanner } from '../pageObjectsManagers/cinesa/cookies/cookieBanner.page';
import {
  cinesaEnvironments,
  uciEnvironments,
  EnvironmentConfig,
} from '../config/environments';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration for a single consent bootstrap operation
 */
interface ConsentConfig {
  /** Platform identifier (cinesa, uci) */
  platform: 'cinesa' | 'uci';

  /** Environment identifier (production, preprod, lab, etc.) */
  env: string;

  /** Full environment configuration */
  config: EnvironmentConfig;

  /** Output path for storageState file */
  outputPath: string;

  /** Display name for logging */
  displayName: string;
}

/**
 * Build array of consent configurations to bootstrap.
 * Filters by PLATFORM and ENV environment variables if provided.
 */
function buildConsentConfigs(): ConsentConfig[] {
  const platformFilter = process.env.PLATFORM?.toLowerCase();
  const envFilter = process.env.ENV?.toLowerCase();

  const configs: ConsentConfig[] = [];

  // Cinesa environments (España)
  if (!platformFilter || platformFilter === 'cinesa') {
    const cinesaEnvs = ['production', 'preprod', 'lab', 'staging'] as const;

    for (const env of cinesaEnvs) {
      if (envFilter && env !== envFilter) continue;

      const config = cinesaEnvironments[env];
      if (!config) continue;

      const region = config.region || 'es';
      configs.push({
        platform: 'cinesa',
        env,
        config,
        outputPath: `state/consented.${env}.${region}.json`,
        displayName: `Cinesa ${env.toUpperCase()} (${region.toUpperCase()})`,
      });
    }

    // Cinesa Portugal
    if (
      !envFilter ||
      envFilter === 'production-pt' ||
      envFilter === 'production'
    ) {
      const configPt = cinesaEnvironments['production-pt'];
      if (configPt) {
        configs.push({
          platform: 'cinesa',
          env: 'production-pt',
          config: configPt,
          outputPath: 'state/consented.production.pt.json',
          displayName: 'Cinesa Production (PT)',
        });
      }
    }
  }

  // UCI environments (Italy)
  if (!platformFilter || platformFilter === 'uci') {
    const uciEnvs = ['production', 'staging'] as const;

    for (const env of uciEnvs) {
      if (envFilter && env !== envFilter) continue;

      const config = uciEnvironments[env];
      if (!config) continue;

      const region = config.region || 'it';
      configs.push({
        platform: 'uci',
        env,
        config,
        outputPath: `state/consented.${env}.${region}.json`,
        displayName: `UCI ${env.toUpperCase()} (${region.toUpperCase()})`,
      });
    }
  }

  return configs;
}

/**
 * Bootstrap consent for a single environment configuration
 */
async function bootstrapConsent(config: ConsentConfig): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Bootstrapping: ${config.displayName}`);
  console.log(`   URL: ${config.config.baseUrl}`);
  console.log(`   Output: ${config.outputPath}`);
  console.log(`${'='.repeat(60)}\n`);

  const browser = await chromium.launch({
    headless: false, // Visual debugging
    slowMo: 500, // Slow down for visibility
  });

  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    // Create new context
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: config.config.locale,
    });

    page = await context.newPage();
    const webActions = new WebActions(page);
    const cookieBanner = new CookieBanner(webActions);

    // Navigate to base URL
    console.log(`🌐 Navigating to ${config.config.baseUrl}...`);
    await page.goto(config.config.baseUrl, {
      waitUntil: 'networkidle',
      timeout: config.config.timeouts.pageLoad,
    });

    // Wait for page to stabilize
    console.log('⏳ Waiting for page to stabilize...');
    await page.waitForTimeout(3000);

    // Accept cookies using existing Page Object
    console.log('🍪 Accepting cookies...');
    await cookieBanner.acceptAllCookies();

    // Wait for OneTrust SDK to finalize (critical!)
    console.log('⏳ Waiting for OneTrust SDK to finalize (2s)...');
    await page.waitForTimeout(2000);

    // Additional wait for network to settle
    await page.waitForLoadState('networkidle').catch(() => {
      console.warn(
        '⚠️  Network did not reach idle state, continuing anyway...'
      );
    });

    // Ensure state directory exists
    const stateDir = path.dirname(config.outputPath);
    if (!fs.existsSync(stateDir)) {
      console.log(`📁 Creating directory: ${stateDir}`);
      fs.mkdirSync(stateDir, { recursive: true });
    }

    // Save storageState
    console.log(`💾 Saving storageState to ${config.outputPath}...`);
    await context.storageState({ path: config.outputPath });

    // Verify file was created
    if (fs.existsSync(config.outputPath)) {
      const stats = fs.statSync(config.outputPath);
      console.log(`✅ StorageState saved successfully (${stats.size} bytes)`);
    } else {
      throw new Error('StorageState file was not created');
    }

    // Extract and log relevant cookies for manual seed extraction
    const cookies = await context.cookies();
    const relevantCookies = cookies.filter(
      (c) =>
        c.name.includes('Optanon') ||
        c.name.includes('consent') ||
        c.name.includes('Consent') ||
        c.name.includes('GDPR')
    );

    console.log(`\n📋 Relevant cookies found (${relevantCookies.length}):`);
    if (relevantCookies.length === 0) {
      console.warn(
        '⚠️  WARNING: No consent cookies found! Banner may not have been accepted properly.'
      );
    } else {
      relevantCookies.forEach((cookie) => {
        console.log(`\n   Cookie: ${cookie.name}`);
        console.log(`   Domain: ${cookie.domain}`);
        console.log(`   Path: ${cookie.path}`);
        console.log(
          `   Value (first 100 chars): ${cookie.value.substring(0, 100)}...`
        );
        console.log(
          `   Expires: ${new Date(cookie.expires * 1000).toISOString()}`
        );
        console.log(
          `   Secure: ${cookie.secure}, HttpOnly: ${cookie.httpOnly}, SameSite: ${cookie.sameSite}`
        );
      });
    }

    // Extract localStorage for completeness
    const localStorageData = await page.evaluate(() => {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key) || '';
        }
      }
      return data;
    });

    const consentLocalStorage = Object.entries(localStorageData).filter(
      ([key]) =>
        key.includes('Optanon') ||
        key.includes('consent') ||
        key.includes('Consent') ||
        key.includes('GDPR')
    );

    if (consentLocalStorage.length > 0) {
      console.log(
        `\n📦 Relevant localStorage items (${consentLocalStorage.length}):`
      );
      consentLocalStorage.forEach(([key, value]) => {
        console.log(`   ${key}: ${value.substring(0, 100)}...`);
      });
    }

    console.log(
      `\n✅ Bootstrap completed successfully for ${config.displayName}`
    );
  } catch (error) {
    console.error(`\n❌ Failed to bootstrap ${config.displayName}:`);
    console.error(error);

    // Take screenshot for debugging
    if (page) {
      const screenshotPath = `state/error-${config.platform}-${config.env}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`📸 Screenshot saved to ${screenshotPath}`);
    }

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Cookie Consent Bootstrap Script');
  console.log('====================================\n');

  const configs = buildConsentConfigs();

  if (configs.length === 0) {
    console.error('❌ No configurations to bootstrap!');
    console.error('   Check PLATFORM and ENV environment variables.');
    process.exit(1);
  }

  console.log(`📋 Configurations to bootstrap: ${configs.length}`);
  configs.forEach((config, index) => {
    console.log(
      `   ${index + 1}. ${config.displayName} → ${config.outputPath}`
    );
  });

  let successCount = 0;
  let failureCount = 0;
  const failures: Array<{ config: ConsentConfig; error: any }> = [];

  for (const config of configs) {
    try {
      await bootstrapConsent(config);
      successCount++;

      // Cool-down period between environments to avoid rate limiting
      if (configs.indexOf(config) < configs.length - 1) {
        console.log('\n⏳ Cool-down period (3s)...');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      failureCount++;
      failures.push({ config, error });
      console.error(`❌ Skipping to next environment due to error\n`);
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Bootstrap Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${configs.length}`);
  console.log(`❌ Failed: ${failureCount}/${configs.length}`);

  if (failures.length > 0) {
    console.log('\n❌ Failed configurations:');
    failures.forEach(({ config, error }) => {
      console.log(`   - ${config.displayName}: ${error.message}`);
    });
  }

  // List generated files
  console.log('\n📁 Generated storageState files:');
  const stateDir = 'state';
  if (fs.existsSync(stateDir)) {
    const files = fs
      .readdirSync(stateDir)
      .filter((f) => f.startsWith('consented.'));
    if (files.length > 0) {
      files.forEach((file) => {
        const filePath = path.join(stateDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   ✓ ${file} (${stats.size} bytes)`);
      });
    } else {
      console.log('   (none)');
    }
  } else {
    console.log('   (state directory does not exist)');
  }

  // Next steps
  console.log('\n📝 Next steps:');
  console.log('   1. Review generated storageState files in state/');
  console.log(
    '   2. Extract cookie values and update core/consent/consentSeeds.ts'
  );
  console.log('   3. Configure playwright.config.ts to use storageState files');
  console.log('   4. Run tests to validate consent persistence');

  console.log('\n✨ Done!\n');

  // Exit with error code if any failures
  process.exit(failureCount > 0 ? 1 : 0);
}

// Execute main function
main().catch((error) => {
  console.error('💥 Fatal error:');
  console.error(error);
  process.exit(1);
});
