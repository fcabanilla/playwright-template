import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(
  __dirname,
  '../../playwright/.auth/cinesa-user.json'
);

setup('authenticate cinesa', async ({ page }) => {
  // Navegar a la página de inicio de Cinesa
  await page.goto('https://cinesa.es');

  // Esperar a que la página cargue completamente
  await page.waitForLoadState('networkidle');

  // Aquí puedes agregar pasos adicionales de autenticación si es necesario
  // Por ejemplo, aceptar cookies, cerrar modales, etc.

  // Verificar que estamos en la página correcta
  await expect(page).toHaveURL(/cinesa\.es/);

  // Verificar que algún elemento característico de la página esté visible
  // (ajusta este selector según los elementos que veas en cinesa.es)
  await expect(page.locator('body')).toBeVisible();

  console.log('✅ Autenticación en Cinesa completada exitosamente');

  // Guardar el estado de la página (cookies, localStorage, etc.)
  await page.context().storageState({ path: authFile });
});
