import type { Browser } from '@playwright/test';
import * as fs from 'node:fs';
import { getCloudflareHeaders } from '../cloudflare/cloudflareHeaders';
import { getCinesaConfig, CinesaEnvironment } from '../../config/environments';

/**
 * Inicializa un contexto y página sorteando Cloudflare y restaurando sesión según el ambiente.
 * Centraliza la lógica de storageState, navegación, inyección de headers de Cloudflare y aceptación de cookies.
 * Devuelve { context, page } listos para usar en los tests.
 */
export async function setupCloudflareContextAndPage(browser: Browser) {
  const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';

  // Get environment configuration
  const config = getCinesaConfig(env);
  const baseUrl = config.baseUrl;

  // Determine storage state file based on environment
  let stateFile = 'loggedInState.json';
  if (env === 'preprod') stateFile = 'loggedInState.preprod.json';
  else if (env === 'lab') stateFile = 'loggedInState.lab.json';
  else if (env === 'staging') stateFile = 'loggedInState.staging.json';

  // Only use storageState if the file exists. Many environments do not commit
  // session files (`loggedInState*.json`) and Playwright will throw ENOENT
  // otherwise. Guarding prevents failing the whole run when state is absent.
  const contextOptions: any = {};
  if (fs.existsSync(stateFile)) {
    contextOptions.storageState = stateFile;
    console.log(`✅ [Storage] Using storage state: ${stateFile}`);
  } else {
    console.log(`ℹ️  [Storage] No storage state file found: ${stateFile}`);
  }

  // Get Cloudflare headers for this environment
  const cloudflareHeaders = getCloudflareHeaders(env);

  // Add Cloudflare headers to context options if available
  if (cloudflareHeaders) {
    contextOptions.extraHTTPHeaders = cloudflareHeaders;
    console.log(`✅ [Cloudflare] Headers configured for env=${env}`);
    console.log(
      `   CF-Access-Client-Id: ${cloudflareHeaders['CF-Access-Client-Id']?.substring(0, 20)}...`
    );
  } else {
    console.log(
      `⚠️  [Cloudflare] No credentials found for env=${env}, may hit Cloudflare challenge`
    );
  }

  // Create context with Cloudflare headers in options (applied from first request)
  const context = await browser.newContext(contextOptions);

  const page = await context.newPage();

  // Navigate to the environment-specific URL
  console.log(`🌍 [Navigation] Navigating to ${baseUrl} (env=${env})`);
  await page.goto(baseUrl);

  // Aceptar cookies si es necesario
  try {
    const acceptCookiesBtn = await page.$('button:has-text("Aceptar")');
    if (acceptCookiesBtn) {
      await acceptCookiesBtn.click();
      console.log('✅ [Cookies] Accepted cookie banner');
    }
  } catch (error) {
    // Silently fail if cookie banner is not present
  }

  return { context, page };
}
