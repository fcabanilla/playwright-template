import type { Browser } from '@playwright/test';

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

  const context = await browser.newContext({ storageState: stateFile });
  const page = await context.newPage();
  await page.goto('https://preprod-web.ocgtest.es/');

  // Aceptar cookies si es necesario
  try {
    const acceptCookiesBtn = await page.$('button:has-text("Aceptar")');
    if (acceptCookiesBtn) await acceptCookiesBtn.click();
  } catch {}

  return { context, page };
}
