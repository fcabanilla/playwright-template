import { test } from '../../fixtures/cinesa/playwright.fixtures';

// This test uses the official Cinesa fixtures which automatically inject:
// - HTTP Headers: CF-Access-Client-Id + CF-Access-Client-Secret (from .env)
// - Cookie: CF-Access-Client-Secret (from .env)
// No need for custom fixture override

test('Diagnostic: Check Cloudflare Bypass Cookie + Headers', async ({
  page,
  context,
}) => {
  console.log('\n========================================');
  console.log('CLOUDFLARE BYPASS COOKIE DIAGNOSTIC');
  console.log('========================================\n');

  // Get current timestamp in GMT+0
  const now = new Date();
  const timestamp = now.toISOString(); // Already in GMT+0
  const timestampReadable = now.toUTCString();

  console.log('⏰ Request Timestamp (GMT+0):');
  console.log(`  ISO Format: ${timestamp}`);
  console.log(`  Readable:   ${timestampReadable}`);
  console.log('');

  // Check if cookie was injected
  console.log('🍪 Cookies BEFORE navigation:');
  const cookiesBefore = await context.cookies();
  const cfBypassCookie = cookiesBefore.find(
    (c) => c.name === 'CF-Access-Client-Secret'
  );

  if (cfBypassCookie) {
    console.log(`  ✅ CF-Access-Client-Secret found`);
    console.log(`     Domain: ${cfBypassCookie.domain}`);
    console.log(`     Value: ${cfBypassCookie.value}`);
    console.log(`     Secure: ${cfBypassCookie.secure}`);
    console.log(`     HttpOnly: ${cfBypassCookie.httpOnly}`);
    console.log(`     SameSite: ${cfBypassCookie.sameSite}`);
  } else {
    console.log(`  ❌ CF-Access-Client-Secret NOT FOUND`);
    console.log(
      `  Available cookies: ${cookiesBefore.map((c) => `${c.name} (${c.domain})`).join(', ')}`
    );
  }
  console.log('');

  // Get request headers that will be sent
  console.log('📨 Request Configuration:');
  const targetUrl =
    process.env.TEST_ENV === 'preprod'
      ? 'https://preprod-web.ocgtest.es'
      : 'https://www.cinesa.es';
  console.log(`  Target URL: ${targetUrl}`);
  console.log(`  Environment: ${process.env.TEST_ENV || 'production'}`);
  console.log(`  Test Runner: Azure Playwright Workspaces (West Europe)`);
  console.log('');

  // Try to navigate and capture request details
  console.log('🌐 Executing Navigation...');
  console.log('');

  let responseStatus: number | undefined;
  let responseHeaders: { [key: string]: string } = {};
  let requestHeaders: { [key: string]: string } = {};

  // Capture request details
  page.on('request', (request) => {
    if (request.url() === targetUrl || request.url().startsWith(targetUrl)) {
      requestHeaders = request.headers();
      console.log('📤 Outgoing Request Headers:');
      Object.entries(requestHeaders).forEach(([key, value]) => {
        // Mask sensitive values
        const displayValue =
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('token')
            ? value.substring(0, 20) + '...'
            : value;
        console.log(`     ${key}: ${displayValue}`);
      });
      console.log('');
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
    console.log(`  ✅ Navigation completed`);
  } catch (error: any) {
    console.log(`  ❌ Navigation failed: ${error.message}`);
  }

  await page.waitForTimeout(3000);

  // Response information
  console.log('📥 Response Information:');
  console.log(`  Status Code: ${responseStatus || 'N/A'}`);
  console.log(`  Final URL: ${page.url()}`);
  console.log('');

  // Take screenshot of final page
  const screenshotPath = `diagnostic-final-page-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot saved: ${screenshotPath}`);
  console.log('');

  // Check page content
  const pageTitle = await page.title();
  const bodyText = await page.evaluate(
    () => document.body.textContent?.substring(0, 300) || ''
  );

  console.log(`📄 Page Content:`);
  console.log(`  Title: ${pageTitle}`);
  console.log(`  Body preview (first 300 chars):`);
  console.log(`  ${bodyText.replace(/\n/g, ' ').trim()}`);
  console.log('');

  // Cloudflare block detection
  const isBlocked =
    pageTitle.toLowerCase().includes('blocked') ||
    bodyText.toLowerCase().includes('cloudflare') ||
    page.url().includes('cloudflareaccess.com');

  if (isBlocked) {
    console.log(`  ❌ CLOUDFLARE BLOCK/REDIRECT DETECTED`);
    if (page.url().includes('cloudflareaccess.com')) {
      console.log(`  Redirected to Cloudflare Access login page`);
    }
  } else {
    console.log(`  ✅ Page loaded successfully (no block detected)`);
  }
  console.log('');

  // Check cookies AFTER navigation
  console.log(`🍪 Cookies AFTER navigation:`);
  const cookiesAfter = await context.cookies();
  const cfBypassCookieAfter = cookiesAfter.find(
    (c) => c.name === 'CF-Access-Client-Secret'
  );

  if (cfBypassCookieAfter) {
    console.log(`  ✅ CF-Access-Client-Secret still present`);
  } else {
    console.log(`  ❌ CF-Access-Client-Secret was removed`);
  }
  console.log('');

  // Summary for DevOps - Easy to copy/paste
  console.log('========================================');
  console.log('📋 SUMMARY FOR DEVOPS (Copy/Paste Ready)');
  console.log('========================================');
  console.log('');
  console.log(`Timestamp (GMT+0): ${timestamp}`);
  console.log(`Environment: ${process.env.TEST_ENV || 'production'}`);
  console.log(`Target URL: ${targetUrl}`);
  console.log(`Source: Azure Playwright Workspaces (West Europe)`);
  console.log(
    `Cookie Injected: CF-Access-Client-Secret = ${cfBypassCookie?.value || 'NOT FOUND'}`
  );
  console.log(`Response Status: ${responseStatus || 'N/A'}`);
  console.log(`Final URL: ${page.url()}`);
  console.log(
    `Result: ${isBlocked ? 'BLOCKED/REDIRECTED by Cloudflare' : 'SUCCESS'}`
  );
  console.log('');
  console.log('Request Headers (sample):');
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
      console.log(`  ${header}: ${displayValue}`);
    }
  });

  console.log('\n========================================');
  console.log('END OF DIAGNOSTIC');
  console.log('========================================\n');
});
