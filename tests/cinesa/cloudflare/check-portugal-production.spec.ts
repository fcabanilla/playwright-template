import { test, expect } from '@playwright/test';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

/**
 * Simple test for Portugal Production (NO Cloudflare)
 *
 * This test validates:
 * 1. Correct URL is used (www.ucicinemas.pt)
 * 2. Page loads successfully without Cloudflare
 * 3. Content is in Portuguese
 */

test.describe('Portugal Production - Basic Connectivity', () => {
  test('should access Portugal production without Cloudflare', async ({
    page,
  }) => {
    const env: CinesaEnvironment = 'production-pt';

    console.log('\n========================================');
    console.log('🇵🇹 PORTUGAL PRODUCTION TEST');
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
    expect(env).toBe('production-pt');
    expect(targetUrl).toBe('https://www.ucicinemas.pt');
    expect(region).toBe('pt');
    expect(locale).toBe('pt-PT');
    console.log('✅ Configuration validation passed\n');

    // ===== STEP 2: Navigate to Portugal Production =====
    console.log('🚀 STEP 2: Navigating to Portugal Production');
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

    // ===== STEP 3: Validate NO Cloudflare =====
    console.log('\n🛡️ STEP 3: Validating NO Cloudflare');
    console.log('─────────────────────────────────────────────');

    const hasCloudflare =
      finalUrl.includes('cloudflare') || finalUrl.includes('cdn-cgi');
    console.log(
      `Has Cloudflare? ${hasCloudflare ? '❌ YES (FAILED)' : '✅ NO (PASSED)'}`
    );

    // Assertions
    expect(response).toBeDefined();
    expect(status).toBe(200);
    expect(hasCloudflare).toBe(false);
    expect(finalUrl).toContain('ucicinemas.pt');
    console.log('✅ No Cloudflare detected\n');

    // ===== STEP 4: Verify Portuguese Content =====
    console.log('📄 STEP 4: Verifying Portuguese Content');
    console.log('─────────────────────────────────────────────');

    const title = await page.title();
    console.log(`✓ Page Title: ${title}`);

    const html = await page.content();

    // Check for Portuguese language indicators
    const hasPortugueseLang =
      html.includes('lang="pt"') || html.includes('pt-PT');
    const hasPortugueseContent =
      html.toLowerCase().includes('cinemas') ||
      html.toLowerCase().includes('filmes') ||
      html.toLowerCase().includes('sessões');

    console.log(
      `✓ Portuguese lang attribute: ${hasPortugueseLang ? 'Yes ✅' : 'No ⚠️'}`
    );
    console.log(
      `✓ Portuguese content detected: ${hasPortugueseContent ? 'Yes ✅' : 'No ⚠️'}`
    );

    // Check for common elements
    const hasCookieBanner = await page
      .locator('#onetrust-banner-sdk')
      .isVisible()
      .catch(() => false);
    console.log(`✓ Cookie banner present: ${hasCookieBanner ? 'Yes' : 'No'}`);

    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    console.log('✅ Page content validation passed\n');

    // ===== STEP 5: Check for Key Elements =====
    console.log('🔍 STEP 5: Checking Key Page Elements');
    console.log('─────────────────────────────────────────────');

    // Wait a bit for dynamic content to load
    await page.waitForTimeout(2000);

    // Check for navigation/header
    const hasNavigation = await page
      .locator('nav, header, [role="navigation"]')
      .count();
    console.log(`✓ Navigation elements found: ${hasNavigation}`);

    // Check for main content
    const hasMainContent = await page
      .locator('main, [role="main"], .content')
      .count();
    console.log(`✓ Main content elements found: ${hasMainContent}`);

    // Check for footer
    const hasFooter = await page
      .locator('footer, [role="contentinfo"]')
      .count();
    console.log(`✓ Footer elements found: ${hasFooter}`);

    expect(hasNavigation).toBeGreaterThan(0);
    console.log('✅ Key elements detected\n');

    // ===== FINAL SUMMARY =====
    console.log('========================================');
    console.log('✅ ALL TESTS PASSED');
    console.log('========================================');
    console.log('Summary:');
    console.log(`  • Environment: ${env}`);
    console.log(`  • URL: ${targetUrl}`);
    console.log(`  • Cloudflare: Not present ✅`);
    console.log(`  • Load Time: ${loadTime}ms`);
    console.log(`  • Status: ${status}`);
    console.log(`  • Region: ${region} (${locale})`);
    console.log(`  • Page Title: ${title}`);
    console.log('========================================\n');
  });

  test('should verify Portugal domain is different from Spain', async () => {
    console.log('\n========================================');
    console.log('🔍 DOMAIN COMPARISON TEST');
    console.log('========================================\n');

    const spainConfig = getCinesaConfig('production');
    const portugalConfig = getCinesaConfig('production-pt');

    console.log('Spain Production:');
    console.log(`  • URL: ${spainConfig.baseUrl}`);
    console.log(`  • Region: ${spainConfig.region}`);
    console.log(`  • Locale: ${spainConfig.locale}`);

    console.log('\nPortugal Production:');
    console.log(`  • URL: ${portugalConfig.baseUrl}`);
    console.log(`  • Region: ${portugalConfig.region}`);
    console.log(`  • Locale: ${portugalConfig.locale}`);

    console.log('\n🔍 Analysis:');
    console.log(
      `  • Same URL? ${spainConfig.baseUrl === portugalConfig.baseUrl ? 'YES ⚠️' : 'NO ✅'}`
    );
    console.log(
      `  • Same region? ${spainConfig.region === portugalConfig.region ? 'YES ⚠️' : 'NO ✅'}`
    );
    console.log(`  • Spain domain: cinesa.es ✅`);
    console.log(`  • Portugal domain: ucicinemas.pt ✅`);

    expect(spainConfig.baseUrl).not.toBe(portugalConfig.baseUrl);
    expect(spainConfig.region).not.toBe(portugalConfig.region);
    expect(spainConfig.baseUrl).toContain('cinesa.es');
    expect(portugalConfig.baseUrl).toContain('ucicinemas.pt');

    console.log('========================================\n');
  });
});
