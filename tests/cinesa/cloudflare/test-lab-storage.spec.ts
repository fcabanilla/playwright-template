/**
 * Test simple para verificar que el storageState de LAB funciona
 */
import { test, expect } from '@playwright/test';
import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

// Helpers shared inside this file
function isCloudflareUrl(url: string) {
  return /cloudflare|cloudflareaccess|cdn-cgi\/access/i.test(url);
}

test('Verify LAB storage state works', async ({ page }) => {
  const env = ((process.env.TEST_ENV as CinesaEnvironment) ||
    'production') as CinesaEnvironment;
  console.log('🌍 Environment:', env);

  const config = getCinesaConfig(env);
  const targetUrl = config.baseUrl;
  console.log('📍 Navigating to', targetUrl);

  await page.goto(targetUrl);

  console.log('⏳ Waiting 5 seconds to see if page loads...');
  await page.waitForTimeout(5000);

  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);

  // Assertion: we expect NOT to be redirected to Cloudflare for LAB when storageState works
  expect(isCloudflareUrl(currentUrl)).toBeFalsy();

  // Try to find the navbar and assert it's visible
  const navbar = page.locator('nav.header-nav');
  await expect(navbar).toBeVisible();
});
