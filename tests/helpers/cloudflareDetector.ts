import { Page } from '@playwright/test';

/**
 * Cloudflare Detection Helper
 * Detects if the current page is blocked by Cloudflare protection
 */

export interface CloudflareDetectionResult {
  isBlocked: boolean;
  reason?: string;
  detectedAt?: string;
}

/**
 * Verifica si la página actual está bloqueada por Cloudflare
 * @param page - Instancia de Playwright Page
 * @returns Resultado de la detección con detalles
 */
export async function detectCloudflareProtection(
  page: Page
): Promise<CloudflareDetectionResult> {
  try {
    // Indicadores comunes de Cloudflare
    const cloudflareIndicators = [
      // Título de la página
      page.locator('title:has-text("Just a moment")'),
      page.locator('title:has-text("Attention Required")'),

      // Elementos específicos de Cloudflare
      page.locator('#challenge-running'),
      page.locator('.cf-browser-verification'),
      page.locator('[data-translate="checking_browser"]'),

      // Ray ID (identificador único de Cloudflare)
      page.locator('text=/Ray ID: [a-f0-9]+/i'),
      page.locator('.ray-id'),

      // Mensajes de Cloudflare
      page.locator('text=/Checking if the site connection is secure/i'),
      page.locator('text=/This process is automatic/i'),
      page.locator('text=/cloudflare/i').first(),
    ];

    // Verificar cada indicador
    for (const indicator of cloudflareIndicators) {
      const isVisible = await indicator
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      if (isVisible) {
        const text = await indicator.textContent().catch(() => 'N/A');
        return {
          isBlocked: true,
          reason: `Cloudflare protection detected: ${text?.substring(0, 100) || 'Challenge page'}`,
          detectedAt: new Date().toISOString(),
        };
      }
    }

    // Verificar URL que contenga cloudflare
    const url = page.url();
    if (url.includes('cloudflare') || url.includes('challenge')) {
      return {
        isBlocked: true,
        reason: `Cloudflare challenge URL detected: ${url}`,
        detectedAt: new Date().toISOString(),
      };
    }

    // No se detectó Cloudflare
    return { isBlocked: false };
  } catch (error) {
    // Si hay error en la detección, asumimos que no está bloqueado
    return { isBlocked: false };
  }
}

/**
 * Verifica y lanza un error claro si Cloudflare está bloqueando
 * @param page - Instancia de Playwright Page
 * @param context - Contexto adicional para el mensaje de error
 * @throws Error si Cloudflare está bloqueando
 */
export async function assertNoCloudflareProtection(
  page: Page,
  context = 'navigation'
): Promise<void> {
  const detection = await detectCloudflareProtection(page);

  if (detection.isBlocked) {
    // Tomar screenshot del bloqueo para el reporte
    await page.screenshot({
      path: `.allure/playwright-artifacts/cloudflare-block-${Date.now()}.png`,
      fullPage: true,
    });

    // Lanzar error claro y categorizable
    throw new Error(
      `🔒 CLOUDFLARE PROTECTION DETECTED during ${context}\n\n` +
        `Reason: ${detection.reason}\n` +
        `URL: ${page.url()}\n` +
        `Time: ${detection.detectedAt}\n\n` +
        `⚠️ This test requires VPN access to bypass Cloudflare protection.\n` +
        `⚠️ Run with --headed --workers=1 or connect to VPN and retry.\n\n` +
        `For Cloudflare-specific tests, use:\n` +
        `  npm run test:cinesa:cloudflare\n` +
        `  TEST_ENV=preprod npx playwright test --headed --workers=1`
    );
  }
}

/**
 * Espera a que Cloudflare termine el challenge (si aplica)
 * @param page - Instancia de Playwright Page
 * @param timeout - Tiempo máximo de espera en ms (default: 30000)
 */
export async function waitForCloudflareChallenge(
  page: Page,
  timeout = 30000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const detection = await detectCloudflareProtection(page);

    if (!detection.isBlocked) {
      return;
    }

    // Esperar 1 segundo antes de volver a verificar
    await page.waitForTimeout(1000);
  }

  // Si llegamos aquí, el timeout expiró
  throw new Error(
    `🔒 CLOUDFLARE CHALLENGE TIMEOUT\n\n` +
      `Cloudflare protection did not resolve after ${timeout}ms.\n` +
      `URL: ${page.url()}\n\n` +
      `This usually means:\n` +
      `  - VPN is required but not connected\n` +
      `  - Environment requires headed mode (--headed --workers=1)\n` +
      `  - Cloudflare is blocking automated browsers\n\n` +
      `Try: npm run test:cinesa:cloudflare`
  );
}
