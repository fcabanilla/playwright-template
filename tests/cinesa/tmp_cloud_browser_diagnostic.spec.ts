import { test } from '../../fixtures/cinesa/playwright.fixtures';

test('Extract Azure Cloud Browser Metadata', async ({
  page,
  context,
}, testInfo) => {
  console.log('\n========================================');
  console.log('AZURE PLAYWRIGHT WORKSPACES - BROWSER METADATA');
  console.log('========================================\n');

  // Test Info
  console.log('📋 Test Information:');
  console.log(`  Project: ${testInfo.project.name}`);
  console.log(`  Test ID: ${testInfo.testId}`);
  console.log('');

  // Check if Cloudflare bypass cookie was injected
  console.log('🍪 Checking Cloudflare Bypass Cookie:');
  const cookies = await context.cookies();
  const cfBypassCookie = cookies.find(
    (c) => c.name === 'CF-Access-Client-Secret'
  );

  if (cfBypassCookie) {
    console.log(`  ✅ CF-Access-Client-Secret found`);
    console.log(`     Domain: ${cfBypassCookie.domain}`);
    console.log(`     Value: ${cfBypassCookie.value.substring(0, 20)}...`);
    console.log(`     Secure: ${cfBypassCookie.secure}`);
    console.log(`     HttpOnly: ${cfBypassCookie.httpOnly}`);
  } else {
    console.log(`  ❌ CF-Access-Client-Secret NOT FOUND`);
    console.log(
      `  Available cookies: ${cookies.map((c) => c.name).join(', ')}`
    );
  }
  console.log('');

  // Navigate to a diagnostic page first
  const targetUrl =
    process.env.TEST_ENV === 'preprod'
      ? 'https://preprod-web.ocgtest.es'
      : 'https://www.cinesa.es';

  console.log(`🌐 Navigating to: ${targetUrl}`);
  await page.goto(targetUrl);

  // Wait a bit for page to load
  await page.waitForTimeout(3000);

  // Check page title and URL to see if Cloudflare blocked us
  const pageTitle = await page.title();
  const currentUrl = page.url();
  console.log(`  Page Title: ${pageTitle}`);
  console.log(`  Current URL: ${currentUrl}`);

  if (pageTitle.includes('blocked') || pageTitle.includes('Cloudflare')) {
    console.log(`  ❌ CLOUDFLARE BLOCK DETECTED`);
  } else {
    console.log(`  ✅ Page loaded successfully (not blocked)`);
  }
  console.log('');

  // Extract client-side information
  const clientInfo = await page.evaluate(() => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      vendor: navigator.vendor,
      vendorSub: navigator.vendorSub,
      productSub: navigator.productSub,
      appVersion: navigator.appVersion,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      documentURL: document.URL,
    };
  });

  console.log('🌐 Client-Side Information:');
  console.log(`  User-Agent: ${clientInfo.userAgent}`);
  console.log(`  Platform: ${clientInfo.platform}`);
  console.log(`  Language: ${clientInfo.language}`);
  console.log(`  Languages: ${clientInfo.languages.join(', ')}`);
  console.log(`  Hardware Concurrency: ${clientInfo.hardwareConcurrency}`);
  console.log(`  Device Memory: ${clientInfo.deviceMemory || 'N/A'}`);
  console.log(`  Screen Resolution: ${clientInfo.screenResolution}`);
  console.log(`  Color Depth: ${clientInfo.colorDepth}`);
  console.log(`  Timezone: ${clientInfo.timezone}`);
  console.log(`  Cookies Enabled: ${clientInfo.cookieEnabled}`);
  console.log(`  Do Not Track: ${clientInfo.doNotTrack || 'N/A'}`);
  console.log(`  Vendor: ${clientInfo.vendor}`);
  console.log(`  Window Size: ${clientInfo.windowSize}`);
  console.log('');

  // Try to get IP address via external service
  console.log('🔍 Attempting to get public IP information...');

  try {
    await page.goto('https://api.ipify.org?format=json', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });
    const ipData = await page.evaluate(() => document.body.textContent);
    console.log(`  IP Data (ipify.org): ${ipData}`);
  } catch (error: any) {
    console.log(`  ❌ Failed to get IP from ipify: ${error.message}`);
  }

  // Try httpbin for more detailed info
  try {
    await page.goto('https://httpbin.org/headers', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });
    const headersData = await page.evaluate(() => document.body.textContent);
    console.log(`\n📨 Request Headers (from httpbin.org):`);
    console.log(headersData);
  } catch (error: any) {
    console.log(`  ❌ Failed to get headers from httpbin: ${error.message}`);
  }

  // Try another IP service
  try {
    await page.goto('https://ifconfig.me/all.json', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });
    const ifconfigData = await page.evaluate(() => document.body.textContent);
    console.log(`\n🌍 Network Information (from ifconfig.me):`);
    console.log(ifconfigData);
  } catch (error: any) {
    console.log(`  ❌ Failed to get info from ifconfig.me: ${error.message}`);
  }

  // Try AWS IP check
  try {
    await page.goto('https://checkip.amazonaws.com/', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });
    const awsIP = await page.evaluate(() => document.body.textContent?.trim());
    console.log(`\n📍 Public IP (AWS checkip): ${awsIP}`);
  } catch (error: any) {
    console.log(`  ❌ Failed to get IP from AWS: ${error.message}`);
  }

  // Get DNS info
  try {
    await page.goto('https://dns.google/resolve?name=www.cinesa.es&type=A', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });
    const dnsData = await page.evaluate(() => document.body.textContent);
    console.log(`\n🔍 DNS Resolution for cinesa.es (Google DNS):`);
    console.log(dnsData);
  } catch (error: any) {
    console.log(`  ❌ Failed to get DNS info: ${error.message}`);
  }

  console.log('\n========================================');
  console.log('END OF METADATA EXTRACTION');
  console.log('========================================\n');
});
