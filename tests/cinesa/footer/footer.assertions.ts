import { Page, expect } from '@playwright/test';
import { FooterSelectors } from '../../../pageObjectsManagers/cinesa/footer/footer.selectors'
import * as allure from 'allure-playwright';
import { baseUrl } from './footer.data';

/**
 * Asserts that all footer elements are visible on the page.
 *
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterElementsVisible(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.test.step('Verifying footer elements visibility', async () => {
    await allure.test.step("Verify 'quienesSomosLink' element", async () => {
      await expect(page.locator(selectors.quienesSomosLink)).toBeVisible();
    });
    await allure.test.step("Verify 'trabajaConNosotrosLink' element", async () => {
      await expect(page.locator(selectors.trabajaConNosotrosLink)).toBeVisible();
    });
    await allure.test.step("Verify 'cinesaBusinessLink' element", async () => {
      await expect(page.locator(selectors.cinesaBusinessLink)).toBeVisible();
    });
    await allure.test.step("Verify 'atencionAlClienteLink' element", async () => {
      await expect(page.locator(selectors.atencionAlClienteLink)).toBeVisible();
    });
    await allure.test.step("Verify 'apoyoInstitucionalLink' element", async () => {
      await expect(page.locator(selectors.apoyoInstitucionalLink)).toBeVisible();
    });
    await allure.test.step("Verify 'transparenciaLink' element", async () => {
      await expect(page.locator(selectors.transparenciaLink)).toBeVisible();
    });
    await allure.test.step("Verify 'eventosLink' element", async () => {
      await expect(page.locator(selectors.eventosLink)).toBeVisible();
    });
    await allure.test.step("Verify 'cinesaLuxeLink' element", async () => {
      await expect(page.locator(selectors.cinesaLuxeLink)).toBeVisible();
    });
    await allure.test.step("Verify 'salasPremiumLink' element", async () => {
      await expect(page.locator(selectors.salasPremiumLink)).toBeVisible();
    });
    await allure.test.step("Verify 'infantilYColegiosLink' element", async () => {
      await expect(page.locator(selectors.infantilYColegiosLink)).toBeVisible();
    });
    await allure.test.step("Verify 'ciclosLink' element", async () => {
      await expect(page.locator(selectors.ciclosLink)).toBeVisible();
    });
    await allure.test.step("Verify 'blogDeCinesaLink' element", async () => {
      await expect(page.locator(selectors.blogDeCinesaLink)).toBeVisible();
    });
    await allure.test.step("Verify 'avisoLegalLink' element", async () => {
      await expect(page.locator(selectors.avisoLegalLink)).toBeVisible();
    });
    await allure.test.step("Verify 'condicionesCompraLink' element", async () => {
      await expect(page.locator(selectors.condicionesCompraLink)).toBeVisible();
    });
    await allure.test.step("Verify 'condicionesUnlimitedLink' element", async () => {
      await expect(page.locator(selectors.condicionesUnlimitedLink)).toBeVisible();
    });
    await allure.test.step("Verify 'politicaPrivacidadLink' element", async () => {
      await expect(page.locator(selectors.politicaPrivacidadLink)).toBeVisible();
    });
    await allure.test.step("Verify 'politicaCookiesLink' element", async () => {
      await expect(page.locator(selectors.politicaCookiesLink)).toBeVisible();
    });
    await allure.test.step("Verify 'esclavitudModernaLink' element", async () => {
      await expect(page.locator(selectors.esclavitudModernaLink)).toBeVisible();
    });
    await allure.test.step("Verify 'codigoConductaLink' element", async () => {
      await expect(page.locator(selectors.codigoConductaLink)).toBeVisible();
    });
    await allure.test.step("Verify 'politicaDenunciaLink' element", async () => {
      await expect(page.locator(selectors.politicaDenunciaLink)).toBeVisible();
    });
    await allure.test.step("Verify 'androidAppLink' element", async () => {
      await expect(page.locator(selectors.androidAppLink)).toBeVisible();
    });
    await allure.test.step("Verify 'appleAppLink' element", async () => {
      await expect(page.locator(selectors.appleAppLink)).toBeVisible();
    });
    await allure.test.step("Verify 'facebookLink' element", async () => {
      await expect(page.locator(selectors.facebookLink)).toBeVisible();
    });
    await allure.test.step("Verify 'twitterLink' element", async () => {
      await expect(page.locator(selectors.twitterLink)).toBeVisible();
    });
    await allure.test.step("Verify 'instagramLink' element", async () => {
      await expect(page.locator(selectors.instagramLink)).toBeVisible();
    });
    await allure.test.step("Verify 'linkedinLink' element", async () => {
      await expect(page.locator(selectors.linkedinLink)).toBeVisible();
    });
    await allure.test.step("Verify 'tiktokLink' element", async () => {
      await expect(page.locator(selectors.tiktokLink)).toBeVisible();
    });
    await allure.test.step("Verify 'youtubeLink' element", async () => {
      await expect(page.locator(selectors.youtubeLink)).toBeVisible();
    });
  });
}

/**
 * Clicks on a footer navigation element and verifies navigation to the expected URL.
 * Used for internal navigation that happens in the same tab.
 *
 * @param page - The Playwright page object to interact with
 * @param selector - The selector string for the navigation element to click
 * @param expectedUrl - The expected destination URL after navigation
 * @returns A Promise that resolves when navigation and assertion are complete
 */
export async function assertFooterNavClick(
  page: Page,
  selector: string,
  expectedUrl: string
): Promise<void> {
  await allure.test.step(
    `Clicking on footer nav element and verifying navigation to ${expectedUrl}`,
    async () => {
      await page.click(selector);
      await expect(page).toHaveURL(expectedUrl);
    }
  );
}

/**
 * Clicks on an external footer navigation element that opens in a new tab and verifies the URL.
 * Handles the popup event and validates the URL in the new tab before closing it.
 *
 * @param page - The Playwright page object to interact with
 * @param selector - The selector string for the external navigation element to click
 * @param expectedUrl - The expected URL in the new tab after clicking
 * @returns A Promise that resolves when navigation, assertion, and tab closure are complete
 */
export async function assertFooterExternalNavClick(
  page: Page,
  selector: string,
  expectedUrl: string
): Promise<void> {
  await allure.test.step(
    `Clicking on external footer nav element and verifying navigation to ${expectedUrl} in new tab`,
    async () => {
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click(selector),
      ]);
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL(expectedUrl);
      await newPage.close();
    }
  );
}

/**
 * Asserts that clicking on the Blog de Cinesa link navigates to the correct URL.
 *
 * @param page - The Playwright page object to interact with
 * @param footer - The Footer object containing all footer element selectors
 * @returns A Promise that resolves when navigation and assertion are complete
 */
export async function assertNavigateToBlog(page: Page, footer: FooterSelectors): Promise<void> {
  await allure.test.step('Navigating to Cinesa blog page and validating URL', async () => {
    await page.click(footer.blogDeCinesaLink);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(`${baseUrl}/blog-cinesa/`);
  });
}
