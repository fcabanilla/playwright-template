import { test, expect } from '@playwright/test';
import {
  AUTH_TIMEOUTS,
  authUrl,
  getStorageStateFile,
  LOGIN_SUCCESS_SELECTOR,
} from './auth.data';

// This test is LEGACY - only for documenting the manual Cloudflare bypass flow
// The recommended way is now to use CF_ACCESS_CLIENT_ID/SECRET automatically
test.describe('Legacy: Manual Cloudflare Bypass', () => {
  // Configure timeout dynamically from auth.data.ts
  test.setTimeout(AUTH_TIMEOUTS.manualLogin);

  test('manual login and save state (auto-close)', async ({ browser }) => {
    const env = process.env.TEST_ENV || 'production';

    // Create empty context (no cookies/storage initially)
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the configured environment URL
    await page.goto(authUrl);

    console.log(`🌐 Navigating to: ${authUrl} (env=${env})`);
    console.log('👤 Please log in manually and bypass Cloudflare.');
    console.log(
      '⏳ The script will automatically detect when you reach the main page.'
    );
    console.log(
      '⚠️  DO NOT close the browser, it will close automatically when done.'
    );

    // Wait until navbar is visible (timeout configured in auth.data.ts)
    try {
      await expect(page.locator(LOGIN_SUCCESS_SELECTOR)).toBeVisible({
        timeout: AUTH_TIMEOUTS.navbarDetection,
      });

      const stateFile = getStorageStateFile(env);
      console.log(`✅ Main page detected!`);
      console.log(`💾 Saving state to: ${stateFile}`);

      await page.context().storageState({ path: stateFile });
      await browser.close();

      console.log('🎉 State saved successfully. Browser closed.');
    } catch (e) {
      console.log(
        `❌ Navbar not detected within ${AUTH_TIMEOUTS.navbarDetection / 60000} minutes.`
      );
      console.log('   Please check your login or Cloudflare bypass.');
    }
  });
});
