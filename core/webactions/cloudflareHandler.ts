import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export class CloudflareHandler {
  constructor(private page: Page) {}

  /**
   * Detecta si la página actual está mostrando un desafío de Cloudflare
   */
  async isCloudflareChallenge(): Promise<boolean> {
    const cloudflareSelectors = [
      '.cf-wrapper',
      '.cf-challenge-running',
      '#cf-wrapper',
      '[data-ray]',
      'title:has-text("Just a moment")',
      'title:has-text("Please wait")',
      'body:has-text("Checking your browser")',
      'body:has-text("Please stand by")',
      '.cf-browser-verification',
      '.cf-im-under-attack',
    ];

    for (const selector of cloudflareSelectors) {
      try {
        const element = await this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          return true;
        }
      } catch {
        // Continuar con el siguiente selector
      }
    }

    return false;
  }

  /**
   * Espera a que el desafío de Cloudflare se complete
   */
  async waitForCloudflareResolution(
    maxWaitTime: number = 30000
  ): Promise<boolean> {
    let resolved = false;

    await allure.step(
      'Waiting for Cloudflare challenge resolution',
      async () => {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
          if (!(await this.isCloudflareChallenge())) {
            // Esperar un poco más para asegurar que la página se ha cargado completamente
            await this.page.waitForTimeout(2000);
            resolved = true;
            return;
          }

          // Esperar un poco antes de verificar de nuevo
          await this.page.waitForTimeout(1000);
        }
      }
    );

    return resolved;
  }

  /**
   * Navega a una URL y maneja automáticamente los desafíos de Cloudflare
   */
  async navigateWithCloudflareHandling(url: string): Promise<boolean> {
    let success = false;

    await allure.step(
      `Navigating to ${url} with Cloudflare handling`,
      async () => {
        // Navegar a la URL
        await this.page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 60000,
        });

        // Verificar si hay un desafío de Cloudflare
        if (await this.isCloudflareChallenge()) {
          console.log(
            'Cloudflare challenge detected, waiting for resolution...'
          );

          const resolved = await this.waitForCloudflareResolution(45000);

          if (!resolved) {
            console.log('Cloudflare challenge not resolved within timeout');
            success = false;
            return;
          }

          console.log('Cloudflare challenge resolved successfully');
        }

        success = true;
      }
    );

    return success;
  }

  /**
   * Configura el navegador para ser menos detectable por Cloudflare
   */
  async setupAntiDetection(): Promise<void> {
    await allure.step('Setting up anti-detection measures', async () => {
      // Eliminar propiedades que indican automatización
      await this.page.addInitScript(() => {
        // Eliminar la propiedad webdriver
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });

        // Sobrescribir la propiedad plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });

        // Sobrescribir la propiedad languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['es-ES', 'es', 'en'],
        });

        // Eliminar automation flag de Chrome
        if ((window as any).chrome) {
          Object.defineProperty((window as any).chrome, 'runtime', {
            get: () => ({
              onConnect: undefined,
              onMessage: undefined,
            }),
          });
        }

        // Simular que no es un headless browser
        Object.defineProperty(navigator, 'headless', {
          get: () => false,
        });
      });

      // Simular movimiento humano del mouse
      await this.page.mouse.move(100, 100);
      await this.page.waitForTimeout(1000);
      await this.page.mouse.move(200, 200);
    });
  }
}
