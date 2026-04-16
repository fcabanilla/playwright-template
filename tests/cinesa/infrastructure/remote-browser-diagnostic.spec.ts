/* eslint-disable no-console */
import { test } from '../../../fixtures/cinesa/playwright.fixtures';

// This test uses the official Cinesa fixtures which automatically inject:
// - HTTP Headers: CF-Access-Client-Id + CF-Access-Client-Secret (from .env)
// - Cookie: CF-Access-Client-Secret (from .env)
// No need for custom fixture override

test('Diagnostic: Check Cloudflare Bypass Cookie + Headers + IP', async ({
  page,
  context,
}, testInfo) => {
  // Capture logs for report attachment
  const logs: string[] = [];
  const log = (message: string) => {
    console.log(message);
    logs.push(message);
  };

  log('\n========================================');
  log('CLOUDFLARE BYPASS COOKIE DIAGNOSTIC');
  log('========================================\n');

  // Get current timestamp in GMT+0
  const now = new Date();
  const timestamp = now.toISOString(); // Already in GMT+0
  const timestampReadable = now.toUTCString();

  log('⏰ Request Timestamp (GMT+0):');
  log(`  ISO Format: ${timestamp}`);
  log(`  Readable:   ${timestampReadable}`);
  log('');

  // Check if cookie was injected
  log('🍪 Cookies BEFORE navigation:');
  const cookiesBefore = await context.cookies();
  const cfBypassCookie = cookiesBefore.find(
    (c) => c.name === 'CF-Access-Client-Secret'
  );

  if (cfBypassCookie) {
    log(`  ✅ CF-Access-Client-Secret found`);
    log(`     Domain: ${cfBypassCookie.domain}`);
    log(`     Value: ${cfBypassCookie.value}`);
    log(`     Secure: ${cfBypassCookie.secure}`);
    log(`     HttpOnly: ${cfBypassCookie.httpOnly}`);
    log(`     SameSite: ${cfBypassCookie.sameSite}`);
  } else {
    log(`  ❌ CF-Access-Client-Secret NOT FOUND`);
    log(
      `  Available cookies: ${cookiesBefore.map((c) => `${c.name} (${c.domain})`).join(', ')}`
    );
  }
  log('');

  // Get request headers that will be sent
  log('📨 Request Configuration:');
  const targetUrl =
    process.env.TEST_ENV === 'preprod'
      ? 'https://preprod-web.ocgtest.es'
      : 'https://www.cinesa.es';
  log(`  Target URL: ${targetUrl}`);
  log(`  Environment: ${process.env.TEST_ENV || 'production'}`);
  log(`  Test Runner: Azure Playwright Workspaces (West Europe)`);
  log('');

  // 1. IP DETECTION STEP for DevOps
  log('🌍 DETECTING REMOTE BROWSER IP...');
  try {
    const ipResponse = await page.request.get(
      'https://api.ipify.org?format=json'
    );
    const ipData = await ipResponse.json();
    log(`\n============== REMOTE IP: ${ipData.ip} ==============\n`);
  } catch (error) {
    log(`  Unable to fetch public IP: ${error}`);
  }

  // Try to navigate and capture request details
  log('🌐 Executing Navigation...');
  log('');

  let responseStatus: number | undefined;
  let responseHeaders: { [key: string]: string } = {};
  let requestHeaders: { [key: string]: string } = {};

  // Capture request details
  page.on('request', (request) => {
    if (request.url() === targetUrl || request.url().startsWith(targetUrl)) {
      requestHeaders = request.headers();
      log('📤 Outgoing Request Headers:');
      Object.entries(requestHeaders).forEach(([key, value]) => {
        // Mask sensitive values
        const displayValue =
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('token')
            ? value.substring(0, 20) + '...'
            : value;
        log(`     ${key}: ${displayValue}`);
      });
      log('');
    }
  });

  // Capture response details
  page.on('response', (response) => {
    if (response.url() === targetUrl || response.url().startsWith(targetUrl)) {
      responseStatus = response.status();
      responseHeaders = response.headers();
    }
  });

  try {
    await page.goto(targetUrl, {
      timeout: 30000,
      waitUntil: 'domcontentloaded',
    });
    log(`  ✅ Navigation completed`);
  } catch (error: any) {
    log(`  ❌ Navigation failed: ${error.message}`);
  }

  await page.waitForTimeout(3000);

  // Response information
  log('📥 Response Information:');
  log(`  Status Code: ${responseStatus || 'N/A'}`);
  log(`  Final URL: ${page.url()}`);
  log('');

  // Specific request: Click "Your IP" button if present to reveal public IP
  try {
    const ipRevealButton = page.locator('text=Your IP Click to reveal');
    if (await ipRevealButton.isVisible()) {
      log('🔍 Found "Your IP Click to reveal" button. Clicking...');
      await ipRevealButton.click();
      await page.waitForTimeout(2000); // Allow animation/fetch
      log('  ✅ Button clicked. IP should be visible in screenshot.');
    }
  } catch (e) {
    log(`  ℹ️ Note: "Your IP" button not found or click failed.`);
  }

  // Take screenshot of final page
  const screenshotPath = `diagnostic-final-page-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  log(`📸 Screenshot saved: ${screenshotPath}`);
  log('');

  // Check page content
  const pageTitle = await page.title();
  const bodyText = await page.evaluate(
    () => document.body.textContent?.substring(0, 300) || ''
  );

  log(`📄 Page Content:`);
  log(`  Title: ${pageTitle}`);
  log(`  Body preview (first 300 chars):`);
  log(`  ${bodyText.replace(/\n/g, ' ').trim()}`);
  log('');

  // Cloudflare block detection
  const isBlocked =
    pageTitle.toLowerCase().includes('blocked') ||
    bodyText.toLowerCase().includes('cloudflare') ||
    page.url().includes('cloudflareaccess.com');

  if (isBlocked) {
    log(`  ❌ CLOUDFLARE BLOCK/REDIRECT DETECTED`);
    if (page.url().includes('cloudflareaccess.com')) {
      log(`  Redirected to Cloudflare Access login page`);
    }

    // Extract Cloudflare Ray ID if present
    const rayIdMatch = bodyText.match(/Ray ID:\s*([0-9a-f]+)/i);
    if (rayIdMatch && rayIdMatch[1]) {
      log(`  🔍 Cloudflare Ray ID: ${rayIdMatch[1]}`);
    }
  } else {
    log(`  ✅ Page loaded successfully (no block detected)`);
  }
  log('');

  // Check cookies AFTER navigation
  log(`🍪 Cookies AFTER navigation:`);
  const cookiesAfter = await context.cookies();
  const cfBypassCookieAfter = cookiesAfter.find(
    (c) => c.name === 'CF-Access-Client-Secret'
  );

  if (cfBypassCookieAfter) {
    log(`  ✅ CF-Access-Client-Secret still present`);
  } else {
    log(`  ❌ CF-Access-Client-Secret was removed`);
  }
  log('');

  // Summary for DevOps - Easy to copy/paste
  log('========================================');
  log('📋 SUMMARY FOR DEVOPS (Copy/Paste Ready)');
  log('========================================');
  log('');
  log(`Timestamp (GMT+0): ${timestamp}`);
  log(`Environment: ${process.env.TEST_ENV || 'production'}`);
  log(`Target URL: ${targetUrl}`);
  log(`Source: Azure Playwright Workspaces (West Europe)`);
  log(
    `Cookie Injected: CF-Access-Client-Secret = ${cfBypassCookie?.value || 'NOT FOUND'}`
  );
  log(`Response Status: ${responseStatus || 'N/A'}`);
  log(`Final URL: ${page.url()}`);
  log(`Result: ${isBlocked ? 'BLOCKED/REDIRECTED by Cloudflare' : 'SUCCESS'}`);
  log('');
  log('Request Headers (sample):');
  const sampleHeaders = [
    'user-agent',
    'accept',
    'cf-access-client-id',
    'cf-access-client-secret',
  ];
  sampleHeaders.forEach((header) => {
    const value =
      requestHeaders[header] || requestHeaders[header.toLowerCase()];
    if (value) {
      const displayValue =
        header.includes('secret') || header.includes('token')
          ? value.substring(0, 30) + '...'
          : value;
      log(`  ${header}: ${displayValue}`);
    }
  });

  log('\n========================================');
  log('END OF DIAGNOSTIC');
  log('========================================\n');

  // Attach logs to the test report
  await testInfo.attach('DevOps Diagnostic Log', {
    body: logs.join('\n'),
    contentType: 'text/plain',
  });
});
