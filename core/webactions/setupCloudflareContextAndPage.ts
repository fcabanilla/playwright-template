import type { Browser } from '@playwright/test';
import * as fs from 'node:fs';

/**
 * Inicializa un contexto y página sorteando Cloudflare y restaurando sesión según el ambiente.
 * Centraliza la lógica de storageState, navegación y aceptación de cookies.
 * Devuelve { context, page } listos para usar en los tests.
 */
export async function setupCloudflareContextAndPage(browser: Browser) {
  const env = process.env.TEST_ENV || 'production';
  let stateFile = 'loggedInState.json';
  if (env === 'preprod') stateFile = 'loggedInState.preprod.json';
  else if (env === 'staging') stateFile = 'loggedInState.staging.json';
  else if (env === 'development') stateFile = 'loggedInState.dev.json';

  // Only use storageState if the file exists. Many environments do not commit
  // session files (`loggedInState*.json`) and Playwright will throw ENOENT
  // otherwise. Guarding prevents failing the whole run when state is absent.
  const contextOptions: any = {};
  if (fs.existsSync(stateFile)) {
    contextOptions.storageState = stateFile;
  }
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto('https://preprod-web.ocgtest.es/');

  // Aceptar cookies si es necesario
  try {
    const acceptCookiesBtn = await page.$('button:has-text("Aceptar")');
    if (acceptCookiesBtn) await acceptCookiesBtn.click();
  } catch {}

  return { context, page };
}
