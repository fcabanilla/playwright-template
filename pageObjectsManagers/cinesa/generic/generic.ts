import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';

export async function takeScreenshot(page: Page, testInfo: any, name = 'Captura de pantalla'): Promise<void> {
  await allure.test.step('Taking screenshot', async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await testInfo.attach(name, {
      body: screenshotBuffer,
      contentType: 'image/png'
    });
  });
}

export async function takeScreenshotForModal(
  page: Page,
  testInfo: any,
  modalSelector: string,
  name = 'Modal Screen Capture'
): Promise<void> {
  await allure.test.step('Taking screenshot of modal', async () => {
    let modal;
    try {
      modal = await page.waitForSelector(modalSelector, { state: 'visible', timeout: 5000 });
    } catch (e) {
      console.warn(`No se pudo tomar screenshot: el modal '${modalSelector}' no está visible.`);
      return;
    }
    await page.evaluate((selector) => {
      const modalEl = document.querySelector(selector);
      if (modalEl) modalEl.scrollTop = 0;
    }, modalSelector);
    await page.waitForTimeout(500);
    const screenshotBuffer = await modal.screenshot();
    await testInfo.attach(name, {
      body: screenshotBuffer,
      contentType: 'image/png'
    });
  });
}
