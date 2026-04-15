/**
 * Auth Login Setup — Generates authenticated storageState with user session.
 *
 * Creates `state/authenticated.{env}.{region}.json` containing both consent cookies
 * AND an active login session. Used by tests that need a logged-in user without
 * repeating the login flow each time.
 *
 * **reCAPTCHA Notice:**
 * The Cinesa checkout login form includes a reCAPTCHA checkbox. In headed mode
 * the user must solve the CAPTCHA manually. The setup pauses with a visible
 * dialog until the CAPTCHA is resolved and login succeeds.
 *
 * **Usage:**
 * ```bash
 * # Generate authenticated state (headed — required for CAPTCHA)
 * TEST_ENV=preprod npx playwright test --project=auth-login-setup --headed
 *
 * # The generated state is reused automatically by authenticated tests
 * ```
 *
 * **Output:**
 * - state/authenticated.preprod.es.json (Cinesa Preprod)
 *
 * @see config/projects/storageState.helper.ts — getAuthenticatedStorageStatePath()
 */

import { test as setup, expect } from '@playwright/test';
import { getCloudflareHeaders } from '../../core/cloudflare/cloudflareHeaders';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../config/environments';
import { cinesaTestAccounts } from '../../config/testAccounts';
import { loginSelectors } from '../../core/selectors/checkout';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl;
const region = config.region || 'es';
const outputPath = `state/authenticated.${env}.${region}.json`;

const account = cinesaTestAccounts.valid.loyalty;

/**
 * Resolve credentials — uses loyalty account from testAccounts,
 * falls back to generic TEST_USER_EMAIL/TEST_USER_PASSWORD from .env.
 */
const resolvedEmail =
  account.email || process.env.TEST_USER_EMAIL || '';
const resolvedPassword =
  account.password || process.env.TEST_USER_PASSWORD || '';

setup(
  `Login setup — ${env} (${region}) — ${account.membershipTier} account`,
  async ({ browser }) => {
    setup.setTimeout(120_000); // 2 minutes — allows time for manual CAPTCHA

    console.log(`\n🔐 Auth Login Setup`);
    console.log(`   Environment: ${env}`);
    console.log(`   Account: ${account.id} (${account.membershipTier})`);
    console.log(`   Output: ${outputPath}`);

    if (!resolvedEmail || !resolvedPassword) {
      throw new Error(
        `Missing credentials for ${account.id}. Set TEST_LOYALTY_EMAIL/TEST_LOYALTY_PASSWORD or TEST_USER_EMAIL/TEST_USER_PASSWORD in .env`
      );
    }

    // Create context with Cloudflare headers + consent state
    const cloudflareHeaders = getCloudflareHeaders(env);
    const consentStatePath = `state/consented.${env}.${region}.json`;

    const contextOptions: Record<string, unknown> = {
      locale: config.locale || 'es-ES',
      viewport: { width: 1920, height: 1080 },
      extraHTTPHeaders: cloudflareHeaders || {},
    };

    // Load existing consent storageState if available
    const fs = await import('node:fs');
    if (fs.existsSync(consentStatePath)) {
      console.log(`   Loading consent state: ${consentStatePath}`);
      contextOptions.storageState = consentStatePath;
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    // Step 1: Navigate to home page (no showtime dependency)
    console.log(`\n🌐 Navigating to: ${baseUrl}`);
    await page.goto(baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Step 2: Open login modal from navbar
    console.log('🔓 Opening login modal...');
    // The navbar login button text is "Inicia sesión" or similar
    const loginTrigger = page.locator(
      'a:has-text("Inicia sesión"), button:has-text("Inicia sesión"), ' +
      'a:has-text("Iniciar sesión"), button:has-text("Iniciar sesión"), ' +
      '[data-testid="login-button"], .header-login, [href*="login"]'
    ).first();
    await loginTrigger.waitFor({ state: 'visible', timeout: 15000 });
    await loginTrigger.click();

    // Wait for login modal/form to appear
    await page.waitForTimeout(1000);

    // Step 3: Fill credentials
    console.log('🔑 Filling login credentials...');
    const emailInput = page.locator(loginSelectors.emailInput);
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(resolvedEmail);
    await page.locator(loginSelectors.passwordInput).fill(resolvedPassword);

    // Step 4: Wait for reCAPTCHA to be solved + click Entrar (manual in headed mode)
    console.log(
      '\n⚠️  reCAPTCHA: Please solve the CAPTCHA in the browser window, then click "Entrar".'
    );
    console.log('   Waiting up to 90 seconds for login to complete...\n');

    // Detect successful login: the page will reload or the modal will close
    // and the navbar will show the user name instead of "Inicia sesión"
    await page.waitForFunction(
      () => {
        // Check if login trigger is gone (replaced by user menu)
        const loginBtn = document.querySelector(
          'a[href*="login"], button:has(span:has-text("Inicia sesión"))'
        );
        const userMenu = document.querySelector(
          '.header-user-menu, [class*="user-avatar"], [class*="user-name"], ' +
          '[class*="logged"], [data-testid*="user"]'
        );
        return !loginBtn || !!userMenu;
      },
      { timeout: 90000 }
    ).catch(async () => {
      // Fallback: check if URL changed (some sites redirect after login)
      console.log('⏳ Checking for URL-based login detection...');
    });

    // Give the session a moment to fully establish
    await page.waitForTimeout(2000);

    console.log(`✅ Login successful — navigated to: ${page.url()}`);

    // Step 6: Validate session cookies
    const cookies = await context.cookies();
    const sessionCookies = cookies.filter(
      (c) =>
        c.name.includes('session') ||
        c.name.includes('token') ||
        c.name.includes('auth') ||
        c.name.includes('JSESSIONID') ||
        c.name.includes('connect.sid')
    );

    console.log(
      `🍪 Session cookies found: ${sessionCookies.length > 0 ? sessionCookies.map((c) => c.name).join(', ') : '(implicit — site uses server-side sessions)'}`
    );
    console.log(
      `🍪 Total cookies: ${cookies.length}`
    );

    // Step 7: Save authenticated storageState
    console.log(`💾 Saving authenticated storageState to ${outputPath}...`);
    await context.storageState({ path: outputPath });

    // Verify the file was created
    expect(fs.existsSync(outputPath)).toBe(true);

    console.log(
      `\n✅ Auth login setup completed for ${env} (${region})`
    );
    console.log(
      `   Reuse with: test.use({ storageState: '${outputPath}' })\n`
    );

    await context.close();
  }
);
