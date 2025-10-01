import { test, expect } from '@playwright/test';

test.describe('Cinesa - Test básico con autenticación', () => {
  test('Debe cargar la página de Cinesa correctamente', async ({ page }) => {
    // Navegar a Cinesa - el estado de autenticación ya está cargado
    await page.goto('https://cinesa.es');

    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/cinesa\.es/);

    // Verificar que el título de la página contiene "Cinesa"
    await expect(page).toHaveTitle(/cinesa/i);

    // Tomar una captura de pantalla para verificar visualmente
    await page.screenshot({
      path: './test-results/cinesa-homepage.png',
      fullPage: true,
    });

    console.log('✅ Test completado - La página de Cinesa carga correctamente');
  });
});
