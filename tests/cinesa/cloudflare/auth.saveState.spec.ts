import { test, expect } from '@playwright/test';

// Configuración de URLs por ambiente
const urls: Record<string, string> = {
  production: 'https://www.cinesa.es/',
  preprod: 'https://preprod-web.ocgtest.es/',
  lab: 'https://lab-web.ocgtest.es/',
  staging: 'https://staging.cinesa.es/',
  development: 'https://dev.cinesa.es/'
};

test('login manual y guarda estado (auto-close)', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'notLoggedInState.json'
  });
  const page = await context.newPage();

  const env = process.env.TEST_ENV || 'production';
  const url = urls[env] || urls.production;
  await page.goto(url);
  console.log('Logueate manualmente y pasa Cloudflare. El script detectará automáticamente cuando entres a la página principal.');
  console.log('NO cierres el navegador, se cerrará solo cuando termine.');

  // Espera hasta que el navbar esté visible (máx 30 minutos)
  try {
    await expect(page.locator('nav.header-nav')).toBeVisible({ timeout: 1800000 });
    console.log('¡Página principal detectada! Guardando estado y cerrando navegador...');
    let stateFile = 'loggedInState.json';
    if (env === 'preprod') stateFile = 'loggedInState.preprod.json';
    else if (env === 'lab') stateFile = 'loggedInState.lab.json';
    else if (env === 'staging') stateFile = 'loggedInState.staging.json';
    else if (env === 'development') stateFile = 'loggedInState.dev.json';
    await page.context().storageState({ path: stateFile });
    await browser.close();
  } catch (e) {
    console.log('No se detectó el navbar en 60 minutos. Revisa el login o Cloudflare.');
  }
});
