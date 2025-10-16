/**
 * Test simple para verificar que el storageState de LAB funciona
 */
import { test } from '@playwright/test';

test('Verify LAB storage state works', async ({ page }) => {
  console.log('🌍 Environment:', process.env.TEST_ENV);
  console.log('📍 Navigating to LAB home...');
  
  await page.goto('https://lab-web.ocgtest.es/');
  
  console.log('⏳ Waiting 5 seconds to see if page loads...');
  await page.waitForTimeout(5000);
  
  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);
  
  // Check if we're still on LAB or redirected to Cloudflare
  if (currentUrl.includes('cloudflare')) {
    console.log('❌ FAIL: Redirected to Cloudflare');
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
