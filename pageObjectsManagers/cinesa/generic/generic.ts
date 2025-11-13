import { Page, TestInfo } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function takeScreenshot(
  page: Page,
  testInfo: TestInfo,
  name = 'Captura de pantalla'
): Promise<void> {
  await allure.step('Taking screenshot', async () => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await allure.attachment(name, screenshotBuffer, 'image/png');
  });
}

export async function takeScreenshotForModal(
  page: Page,
  testInfo: TestInfo,
  modalSelector: string,
  name = 'Modal Screen Capture'
): Promise<void> {
  await allure.step('Taking screenshot of modal', async () => {
    let modal;
    try {
      modal = await page.waitForSelector(modalSelector, {
        state: 'visible',
        timeout: 5000,
      });
    } catch (e) {
      console.warn(
        `No se pudo tomar screenshot: el modal '${modalSelector}' no está visible.`
      );
      return;
    }
    await page.evaluate((selector) => {
      const modalEl = document.querySelector(selector);
      if (modalEl) modalEl.scrollTop = 0;
    }, modalSelector);
    await page.waitForTimeout(500);
    const screenshotBuffer = await modal.screenshot();
    await allure.attachment(name, screenshotBuffer, 'image/png');
  });
}

/**
 * Takes a screenshot of a specific element by selector.
 * Useful for capturing individual components like cards, buttons, sections, etc.
 *
 * @param page - Playwright Page object
 * @param testInfo - Playwright TestInfo object for attaching screenshots
 * @param elementSelector - CSS selector or XPath of the element to capture
 * @param name - Name for the screenshot attachment (default: 'Element Screenshot')
 * @returns Promise that resolves when screenshot is attached
 */
export async function takeScreenshotOfElement(
  page: Page,
  testInfo: TestInfo,
  elementSelector: string,
  name = 'Element Screenshot'
): Promise<void> {
  await allure.step(
    `Taking screenshot of element: ${elementSelector}`,
    async () => {
      let element;
      try {
        element = await page.waitForSelector(elementSelector, {
          state: 'visible',
          timeout: 5000,
        });
      } catch (e) {
        console.warn(
          `No se pudo tomar screenshot: el elemento '${elementSelector}' no está visible.`
        );
        return;
      }

      // Scroll element into view if needed
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const screenshotBuffer = await element.screenshot();
      await allure.attachment(name, screenshotBuffer, 'image/png');
    }
  );
}

/**
 * Takes a screenshot of a Playwright Locator element.
 * Useful for capturing elements that are already located and ready to interact with.
 *
 * @param locator - Playwright Locator object
 * @param testInfo - Playwright TestInfo object for attaching screenshots
 * @param name - Name for the screenshot attachment (default: 'Element Screenshot')
 * @returns Promise that resolves when screenshot is attached
 */
export async function takeScreenshotOfLocator(
  locator: any, // Locator type from Playwright
  testInfo: TestInfo,
  name = 'Element Screenshot'
): Promise<void> {
  await allure.step(`Taking screenshot of locator: ${name}`, async () => {
    try {
      // Wait for element to be visible
      await locator.waitFor({ state: 'visible', timeout: 5000 });

      // Scroll element into view if needed
      await locator.scrollIntoViewIfNeeded();
      await locator.page().waitForTimeout(300);

      const screenshotBuffer = await locator.screenshot();
      await allure.attachment(name, screenshotBuffer, 'image/png');
    } catch (e) {
      console.warn(`No se pudo tomar screenshot del locator '${name}': ${e}`);
    }
  });
}
