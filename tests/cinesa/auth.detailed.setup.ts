import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(
  __dirname,
  '../../playwright/.auth/cinesa-user.json'
);

setup('authenticate cinesa - paso a paso', async ({ page }) => {
  console.log('🚀 PASO 1: Iniciando navegación a Cinesa...');

  // Navegar a la página de inicio de Cinesa
  await page.goto('https://cinesa.es');
  console.log('✅ Navegación completada');

  console.log('🚀 PASO 2: Esperando a que la página cargue...');
  // Esperar a que la página cargue completamente
  await page.waitForLoadState('networkidle');
  console.log('✅ Página cargada completamente');

  console.log('🚀 PASO 3: Verificando URL...');
  // Verificar que estamos en la página correcta
  await expect(page).toHaveURL(/cinesa\.es/);
  console.log('✅ URL verificada');

  console.log('🚀 PASO 4: Verificando que la página sea visible...');
  // Verificar que algún elemento característico de la página esté visible
  await expect(page.locator('body')).toBeVisible();
  console.log('✅ Página visible');

  console.log('🚀 PASO 5: Tomando captura de pantalla...');
  await page.screenshot({
    path: './test-results/auth-setup-screenshot.png',
    fullPage: true,
  });
  console.log(
    '✅ Captura guardada en ./test-results/auth-setup-screenshot.png'
  );

  console.log('🚀 PASO 6: Verificando título de la página...');
  const title = await page.title();
  console.log(`📄 Título de la página: "${title}"`);

  console.log('🚀 PASO 7: Obteniendo información de cookies...');
  const cookies = await page.context().cookies();
  console.log(`🍪 Se encontraron ${cookies.length} cookies`);

  console.log('🚀 PASO 8: Guardando estado de autenticación...');
  // Guardar el estado de la página (cookies, localStorage, etc.)
  await page.context().storageState({ path: authFile });
  console.log('✅ Estado guardado en:', authFile);

  console.log(
    '🎉 PROCESO COMPLETADO: Autenticación en Cinesa terminada exitosamente'
  );
});
