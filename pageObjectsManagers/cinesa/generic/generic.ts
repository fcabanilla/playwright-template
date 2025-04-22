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
