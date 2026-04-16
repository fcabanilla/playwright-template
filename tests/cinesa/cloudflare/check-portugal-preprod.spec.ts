import { test, expect } from '@playwright/test';
import { getCloudflareCredentials } from '../../../core/cloudflare/envValidator';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

/**
 * Comprehensive test for Portugal Preprod Cloudflare configuration
 *
 * This test validates:
 * 1. Correct URL is used (preprod-web.ocgtest.pt)
 * 2. Correct Cloudflare credentials are loaded (CF_ACCESS_CLIENT_ID_PREPROD_PT)
 * 3. Headers are properly injected
 * 4. Cloudflare challenge is bypassed
 * 5. Final destination URL is correct (no Cloudflare redirect)
 */

function isCloudflareUrl(url: string): boolean {
  return /cloudflare|cloudflareaccess|cdn-cgi\/access/i.test(url);
}

test.describe('Portugal Preprod - Cloudflare Configuration', () => {
  test('should bypass Cloudflare with correct headers for preprod-pt', async ({
    browser,
  }) => {
    const env: CinesaEnvironment = 'preprod-pt';

    console.log('\n========================================');
    console.log('🇵🇹 PORTUGAL PREPROD CLOUDFLARE TEST');
    console.log('========================================\n');

    // ===== STEP 1: Validate Environment Configuration =====
    console.log('📋 STEP 1: Validating Environment Configuration');
    console.log('─────────────────────────────────────────────');

    const config = getCinesaConfig(env);
    const targetUrl = config.baseUrl;
    const region = config.region;
    const locale = config.locale;

    console.log(`✓ Environment: ${env}`);
    console.log(`✓ Target URL: ${targetUrl}`);
    console.log(`✓ Region: ${region}`);
    console.log(`✓ Locale: ${locale}`);

    // Assertions for configuration
    expect(env).toBe('preprod-pt');
    expect(targetUrl).toBe('https://preprod-web.ocgtest.pt');
    expect(region).toBe('pt');
    expect(locale).toBe('pt-PT');
    console.log('✅ Configuration validation passed\n');

    // ===== STEP 2: Load Cloudflare Credentials =====
    console.log('🔐 STEP 2: Loading Cloudflare Credentials');
    console.log('─────────────────────────────────────────────');

    let creds: { clientId: string; clientSecret: string; envKeyUsed: string };

    try {
      creds = getCloudflareCredentials(env, 'cinesa_pt');
      console.log(`✓ Credentials found using key: ${creds.envKeyUsed}`);
      console.log(`✓ Client ID: ${creds.clientId.substring(0, 20)}...`);
      console.log(`✓ Client Secret: ${creds.clientSecret.substring(0, 20)}...`);

      // Assertions for credentials
      expect(creds).toBeDefined();
      expect(creds.clientId).toBeTruthy();
      expect(creds.clientSecret).toBeTruthy();
      expect(creds.envKeyUsed).toContain('PREPROD_PT');
      console.log('✅ Credentials loaded successfully\n');
    } catch (err: any) {
      console.error(
        `❌ ERROR: Failed to load credentials: ${err?.message || err}`
      );
      throw new Error(
        `Cloudflare credentials not found for ${env}. ` +
          `Expected CF_ACCESS_CLIENT_ID_PREPROD_PT and CF_ACCESS_CLIENT_SECRET_PREPROD_PT in .env file`
      );
    }

    // ===== STEP 3: Create Browser Context with Headers =====
    console.log('🌐 STEP 3: Creating Browser Context with CF Headers');
    console.log('─────────────────────────────────────────────');

    const context = await browser.newContext({
      extraHTTPHeaders: {
        'CF-Access-Client-Id': creds.clientId,
        'CF-Access-Client-Secret': creds.clientSecret,
      },
    });
    console.log('✓ Browser context created');
    console.log('✓ CF-Access-Client-Id header injected');
    console.log('✓ CF-Access-Client-Secret header injected');
    console.log('✅ Headers configured successfully\n');

    const page = await context.newPage();

    try {
      // ===== STEP 4: Navigate to Target URL =====
      console.log('🚀 STEP 4: Navigating to Target URL');
      console.log('─────────────────────────────────────────────');
      console.log(`Navigating to: ${targetUrl}`);

      const startTime = Date.now();
      const response = await page.goto(targetUrl, {
        waitUntil: 'networkidle',
        timeout: 60000,
      });
      const loadTime = Date.now() - startTime;

      const finalUrl = page.url();
      const status = response?.status();
      const statusText = response?.statusText();

      console.log(`✓ Navigation completed in ${loadTime}ms`);
      console.log(`✓ HTTP Status: ${status} ${statusText}`);
      console.log(`✓ Final URL: ${finalUrl}`);

      // ===== STEP 5: Validate Cloudflare Bypass =====
      console.log('\n🛡️ STEP 5: Validating Cloudflare Bypass');
      console.log('─────────────────────────────────────────────');

      const isCloudflare = isCloudflareUrl(finalUrl);
      console.log(
        `Is Cloudflare URL? ${isCloudflare ? '❌ YES (FAILED)' : '✅ NO (PASSED)'}`
      );

      // Assertions for successful bypass
      expect(response).toBeDefined();
      expect(status).toBe(200);
      expect(isCloudflare).toBe(false);
      expect(finalUrl).toContain('ocgtest.pt');
      expect(finalUrl).not.toContain('cloudflare');
      expect(finalUrl).not.toContain('cdn-cgi');
      console.log('✅ Cloudflare bypass successful\n');

      // ===== STEP 6: Verify Page Content =====
      console.log('📄 STEP 6: Verifying Page Content');
      console.log('─────────────────────────────────────────────');

      const title = await page.title();
      console.log(`✓ Page Title: ${title}`);

      // Check for Portugal-specific content indicators
      const html = await page.content();
      const hasPortugueseContent =
        html.includes('pt-PT') || html.includes('lang="pt"');
      console.log(
        `✓ Portuguese content detected: ${hasPortugueseContent ? 'Yes' : 'No'}`
      );

      // Check that we're not on an error page
      const hasErrorIndicators =
        html.toLowerCase().includes('error') ||
        html.toLowerCase().includes('404') ||
        html.toLowerCase().includes('503');
      console.log(
        `✓ Error page detected: ${hasErrorIndicators ? 'Yes ⚠️' : 'No ✅'}`
      );

      expect(title).toBeTruthy();
      expect(title).not.toContain('Error');
      expect(hasErrorIndicators).toBe(false);
      console.log('✅ Page content validation passed\n');

      // ===== FINAL SUMMARY =====
      console.log('========================================');
      console.log('✅ ALL TESTS PASSED');
      console.log('========================================');
      console.log('Summary:');
      console.log(`  • Environment: ${env}`);
      console.log(`  • URL: ${targetUrl}`);
      console.log(`  • Cloudflare: Bypassed successfully`);
      console.log(`  • Load Time: ${loadTime}ms`);
      console.log(`  • Status: ${status}`);
      console.log(`  • Region: ${region} (${locale})`);
      console.log('========================================\n');
    } catch (err: any) {
      console.error('\n❌ TEST FAILED');
      console.error('========================================');
      console.error(`Error: ${err?.message || err}`);
      console.error('========================================\n');
      throw err;
    } finally {
      await context.close();
    }
  });

  test('should compare Spain vs Portugal credentials', async () => {
    console.log('\n========================================');
    console.log('🔍 CREDENTIAL COMPARISON TEST');
    console.log('========================================\n');

    // Load Spain preprod credentials
    let spainCreds: {
      clientId: string;
      clientSecret: string;
      envKeyUsed: string;
    } | null = null;
    try {
      spainCreds = getCloudflareCredentials('preprod', 'cinesa_es');
      console.log('Spain Preprod:');
      console.log(`  • Key Used: ${spainCreds.envKeyUsed}`);
      console.log(`  • Client ID: ${spainCreds.clientId.substring(0, 20)}...`);
    } catch (err) {
      console.log('Spain Preprod: No credentials found');
    }

    // Load Portugal preprod credentials
    let portugalCreds: {
      clientId: string;
      clientSecret: string;
      envKeyUsed: string;
    } | null = null;
    try {
      portugalCreds = getCloudflareCredentials('preprod-pt', 'cinesa_pt');
      console.log('\nPortugal Preprod:');
      console.log(`  • Key Used: ${portugalCreds.envKeyUsed}`);
      console.log(
        `  • Client ID: ${portugalCreds.clientId.substring(0, 20)}...`
      );
    } catch (err) {
      console.log('\nPortugal Preprod: No credentials found');
    }

    console.log('\n🔍 Analysis:');
    if (spainCreds && portugalCreds) {
      const sameCredentials =
        spainCreds.clientId === portugalCreds.clientId &&
        spainCreds.clientSecret === portugalCreds.clientSecret;

      console.log(
        `  • Same credentials? ${sameCredentials ? 'YES ⚠️' : 'NO ✅'}`
      );
      console.log(
        `  • Different keys used? ${spainCreds.envKeyUsed !== portugalCreds.envKeyUsed ? 'YES ✅' : 'NO ⚠️'}`
      );

      expect(sameCredentials).toBe(false); // Should be different credentials
      expect(spainCreds.envKeyUsed).not.toBe(portugalCreds.envKeyUsed);
    } else {
      console.log('  • Cannot compare - missing credentials');
    }

    console.log('========================================\n');
  });
});
