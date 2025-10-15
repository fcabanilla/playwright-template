/**
 * Test simple para verificar que el storageState de LAB funciona
 */
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Verify LAB storage state works', async ({ page }) => {
  const env = (process.env.TEST_ENV || 'production').toLowerCase();
  console.log('🌍 Environment:', env);

  const urls: Record<string, string> = {
    production: 'https://www.cinesa.es/',
    preprod: 'https://preprod-web.ocgtest.es/',
    lab: 'https://lab-web.ocgtest.es/',
    staging: 'https://staging.cinesa.es/',
    development: 'https://dev.cinesa.es/'
  };

  const targetUrl = urls[env] || urls.production;
  console.log('📍 Navigating to', targetUrl);

  await page.goto(targetUrl);

  console.log('⏳ Waiting 5 seconds to see if page loads...');
  await page.waitForTimeout(5000);

  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);

  // Prepare artifact dir
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const artifactDir = path.join(process.cwd(), 'artifacts', 'cloudflare');
  try {
    fs.mkdirSync(artifactDir, { recursive: true });
  } catch (e) {
    // ignore
  }

  // Check if we're still on LAB or redirected to Cloudflare
  if (currentUrl.includes('cloudflare')) {
    console.log('❌ FAIL: Redirected to Cloudflare');
    // Save screenshot and HTML for diagnosis
    try {
      const screenshotPath = path.join(
        artifactDir,
        `cloudflare-redirect-${ts}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Saved screenshot: ${screenshotPath}`);

      const html = await page.content();
      const htmlPath = path.join(artifactDir, `cloudflare-redirect-${ts}.html`);
      fs.writeFileSync(htmlPath, html, { encoding: 'utf8' });
      console.log(`💾 Saved page HTML: ${htmlPath}`);
    } catch (err) {
      console.log('⚠️ Error saving artifacts:', err);
    }

    throw new Error('Cloudflare redirect detected - storageState not working');
  } else {
    console.log('✅ SUCCESS: On LAB site without Cloudflare');
  }

  // Try to find the navbar
  const navbar = page.locator('nav.header-nav');
  const isNavbarVisible = await navbar.isVisible().catch(() => false);

  if (isNavbarVisible) {
    console.log('✅ Navbar is visible - fully loaded');
  } else {
    console.log('⚠️  Navbar not visible - page may not be fully loaded');
  }
});
