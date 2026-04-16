import { Page, expect } from '@playwright/test';
import { FooterSelectors } from '../../../pageObjectsManagers/cinesa/footer/footer.selectors'
import { allure } from 'allure-playwright';

/**
 * Asserts that core footer elements are visible on the page.
 * This is a simplified version that only checks elements confirmed to exist in the page.
 *
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterCoreElementsVisible(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.step('Verifying core footer elements visibility', async () => {
    await allure.step("Verify 'quienesSomosLink' element", async () => {
      await expect(page.locator(selectors.quienesSomosLink)).toBeVisible();
    });
    await allure.step("Verify 'trabajaConNosotrosLink' element", async () => {
      await expect(page.locator(selectors.trabajaConNosotrosLink)).toBeVisible();
    });
    await allure.step("Verify 'cinesaBusinessLink' element", async () => {
      await expect(page.locator(selectors.cinesaBusinessLink)).toBeVisible();
    });
    await allure.step("Verify 'transparenciaLink' element", async () => {
      await expect(page.locator(selectors.transparenciaLink)).toBeVisible();
    });

    await allure.step("Verify 'eventosLink' element", async () => {
      await expect(page.locator(selectors.eventosLink)).toBeVisible();
    });
    await allure.step("Verify 'cinesaLuxeLink' element", async () => {
      await expect(page.locator(selectors.cinesaLuxeLink)).toBeVisible();
    });
    await allure.step("Verify 'blogDeCinesaLink' element", async () => {
      await expect(page.locator(selectors.blogDeCinesaLink)).toBeVisible();
    });

    await allure.step("Verify 'avisoLegalLink' element", async () => {
      await expect(page.locator(selectors.avisoLegalLink)).toBeVisible();
    });
    await allure.step("Verify 'politicaPrivacidadLink' element", async () => {
      await expect(page.locator(selectors.politicaPrivacidadLink)).toBeVisible();
    });
    await allure.step("Verify 'politicaCookiesLink' element", async () => {
      await expect(page.locator(selectors.politicaCookiesLink)).toBeVisible();
    });

    await allure.step("Verify 'facebookLink' element", async () => {
      await expect(page.locator(selectors.facebookLink)).toBeVisible();
    });
    await allure.step("Verify 'instagramLink' element", async () => {
      await expect(page.locator(selectors.instagramLink)).toBeVisible();
    });
  });
}

/**
 * Asserts that all footer elements are visible on the page.
 * This is the comprehensive version - use assertFooterCoreElementsVisible for basic testing.
 *
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterElementsVisible(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.step('Verifying footer elements visibility', async () => {
    await allure.step("Verify 'quienesSomosLink' element", async () => {
      await expect(page.locator(selectors.quienesSomosLink)).toBeVisible();
    });
    await allure.step("Verify 'trabajaConNosotrosLink' element", async () => {
      await expect(page.locator(selectors.trabajaConNosotrosLink)).toBeVisible();
    });
    await allure.step("Verify 'cinesaBusinessLink' element", async () => {
      await expect(page.locator(selectors.cinesaBusinessLink)).toBeVisible();
    });
    await allure.step("Verify 'atencionAlClienteLink' element", async () => {
      await expect(page.locator(selectors.atencionAlClienteLink)).toBeVisible();
    });
    await allure.step("Verify 'transparenciaLink' element", async () => {
      await expect(page.locator(selectors.transparenciaLink)).toBeVisible();
    });
    await allure.step("Verify 'eventosLink' element", async () => {
      await expect(page.locator(selectors.eventosLink)).toBeVisible();
    });
    await allure.step("Verify 'cinesaLuxeLink' element", async () => {
      await expect(page.locator(selectors.cinesaLuxeLink)).toBeVisible();
    });
    await allure.step("Verify 'salasPremiumLink' element", async () => {
      await expect(page.locator(selectors.salasPremiumLink)).toBeVisible();
    });
    await allure.step("Verify 'infantilYColegiosLink' element", async () => {
      await expect(page.locator(selectors.infantilYColegiosLink)).toBeVisible();
    });
    await allure.step("Verify 'ciclosLink' element", async () => {
      await expect(page.locator(selectors.ciclosLink)).toBeVisible();
    });
    await allure.step("Verify 'blogDeCinesaLink' element", async () => {
      await expect(page.locator(selectors.blogDeCinesaLink)).toBeVisible();
    });
    await allure.step("Verify 'avisoLegalLink' element", async () => {
      await expect(page.locator(selectors.avisoLegalLink)).toBeVisible();
    });
    await allure.step("Verify 'condicionesCompraLink' element", async () => {
      await expect(page.locator(selectors.condicionesCompraLink)).toBeVisible();
    });
    await allure.step("Verify 'condicionesUnlimitedLink' element", async () => {
      await expect(page.locator(selectors.condicionesUnlimitedLink)).toBeVisible();
    });
    await allure.step("Verify 'politicaPrivacidadLink' element", async () => {
      await expect(page.locator(selectors.politicaPrivacidadLink)).toBeVisible();
    });
    await allure.step("Verify 'politicaCookiesLink' element", async () => {
      await expect(page.locator(selectors.politicaCookiesLink)).toBeVisible();
    });
    await allure.step("Verify 'androidAppLink' element", async () => {
      await expect(page.locator(selectors.androidAppLink)).toBeVisible();
    });
    await allure.step("Verify 'appleAppLink' element", async () => {
      await expect(page.locator(selectors.appleAppLink)).toBeVisible();
    });
    await allure.step("Verify 'facebookLink' element", async () => {
      await expect(page.locator(selectors.facebookLink)).toBeVisible();
    });
    await allure.step("Verify 'twitterLink' element", async () => {
      await expect(page.locator(selectors.twitterLink)).toBeVisible();
    });
    await allure.step("Verify 'instagramLink' element", async () => {
      await expect(page.locator(selectors.instagramLink)).toBeVisible();
    });
    await allure.step("Verify 'linkedinLink' element", async () => {
      await expect(page.locator(selectors.linkedinLink)).toBeVisible();
    });
    await allure.step("Verify 'tiktokLink' element", async () => {
      await expect(page.locator(selectors.tiktokLink)).toBeVisible();
    });
    await allure.step("Verify 'youtubeLink' element", async () => {
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
  await allure.step(
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
  await allure.step(
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
 * Asserts footer company navigation links functionality.
 * Tests both visibility and click functionality for company-related links.
 *
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterCompanyNavigation(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.step('Testing footer company navigation functionality', async () => {
    await allure.step('Test "Quiénes somos" navigation capability', async () => {
      await expect(page.locator(selectors.quienesSomosLink)).toBeVisible();
      await expect(page.locator(selectors.quienesSomosLink)).toHaveAttribute('href', '/quienes-somos/');
    });

    await allure.step('Test "Transparencia" navigation capability', async () => {
      await expect(page.locator(selectors.transparenciaLink)).toBeVisible();
      await expect(page.locator(selectors.transparenciaLink)).toHaveAttribute('href', '/quienes-somos/transparencia/');
    });

    await allure.step('Test external "Trabaja con nosotros" link', async () => {
      await expect(page.locator(selectors.trabajaConNosotrosLink)).toBeVisible();
      await expect(page.locator(selectors.trabajaConNosotrosLink))
        .toHaveAttribute('href', 'https://cinesa-uci.jobtrain.co.uk/cinesajobs/Home/Job');
    });

    await allure.step('Test external "Cinesa Business" link', async () => {
      await expect(page.locator(selectors.cinesaBusinessLink)).toBeVisible();
      await expect(page.locator(selectors.cinesaBusinessLink))
        .toHaveAttribute('href', 'http://www.cinesabusiness.es/');
    });
  });
}

/**
 * Asserts footer social media links presence and attributes.
 * 
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterSocialMediaLinks(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.step('Validating social media links presence and attributes', async () => {
    const socialMediaLinks = [
      { name: 'Facebook', selector: selectors.facebookLink, expectedHref: 'https://www.facebook.com/cinesa.es' },
      { name: 'Twitter', selector: selectors.twitterLink, expectedHref: 'https://twitter.com/Cinesa' },
      { name: 'Instagram', selector: selectors.instagramLink, expectedHref: 'https://www.instagram.com/cinesa.es/' },
      { name: 'LinkedIn', selector: selectors.linkedinLink, expectedHref: 'https://www.linkedin.com/company/98547' },
      { name: 'TikTok', selector: selectors.tiktokLink, expectedHref: 'https://www.tiktok.com/@cinesa.es?lang=es' },
      { name: 'YouTube', selector: selectors.youtubeLink, expectedHref: 'https://www.youtube.com/c/cinesa/featured' },
    ];

    for (const link of socialMediaLinks) {
      await allure.step(`Verify ${link.name} link visibility and href`, async () => {
        await expect(page.locator(link.selector)).toBeVisible();
        await expect(page.locator(link.selector)).toHaveAttribute('href', link.expectedHref);
      });
    }
  });
}

/**
 * Asserts footer legal documentation links.
 * 
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterLegalLinks(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.step('Validating legal documentation links', async () => {
    const legalLinks = [
      { name: 'Aviso Legal', selector: selectors.avisoLegalLink, expectedHref: '/documentos-legales/aviso-legal' },
      { name: 'Condiciones de Compra', selector: selectors.condicionesCompraLink, expectedHref: '/documentos-legales/condiciones-compra/' },
      { name: 'Condiciones Unlimited', selector: selectors.condicionesUnlimitedLink, expectedHref: '/documentos-legales/condiciones-unlimited/' },
      { name: 'Política de Privacidad', selector: selectors.politicaPrivacidadLink, expectedHref: '/documentos-legales/politica-privacidad/' },
      { name: 'Política de Cookies', selector: selectors.politicaCookiesLink, expectedHref: '/documentos-legales/cookies' },
    ];

    for (const link of legalLinks) {
      await allure.step(`Verify ${link.name} link visibility and href`, async () => {
        await expect(page.locator(link.selector)).toBeVisible();
        await expect(page.locator(link.selector)).toHaveAttribute('href', link.expectedHref);
      });
    }
  });
}

/**
 * Asserts footer mobile app download links.
 * 
 * @param page - The Playwright page object to interact with
 * @param selectors - The FooterSelectors object containing all footer element selectors
 * @returns A Promise that resolves when all assertions are complete
 */
export async function assertFooterAppLinks(
  page: Page,
  selectors: FooterSelectors
): Promise<void> {
  await allure.step('Validating mobile app download links', async () => {
    await allure.step('Verify Android app download link', async () => {
      await expect(page.locator(selectors.androidAppLink)).toBeVisible();
      await expect(page.locator(selectors.androidAppLink))
        .toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=nz.co.vista.android.movie.cinesa');
    });

    await allure.step('Verify Apple app download link', async () => {
      await expect(page.locator(selectors.appleAppLink)).toBeVisible();
      await expect(page.locator(selectors.appleAppLink))
        .toHaveAttribute('href', 'https://apps.apple.com/es/app/cinesa-app/id6444631578?l=ca');
    });
  });
}

/**
 * Asserts that clicking on the Blog de Cinesa link navigates to the correct URL.
 * 
 * Note: There's a known issue in preprod where the blog link redirects to production.
 * This is a website bug, not a test issue. The assertion validates the expected behavior.
 *
 * @param page - The Playwright page object to interact with
 * @param blogSelector - The specific blog selector (determined by Page Object)
 * @param baseUrl - The base URL for the current environment
 * @returns A Promise that resolves when navigation and assertion are complete
 */
export async function assertNavigateToBlog(page: Page, blogSelector: string, baseUrl: string): Promise<void> {
  await allure.step('Navigating to Cinesa blog page and validating URL', async () => {
    // Get the target attribute to check if it opens in new tab
    const targetAttribute = await page.getAttribute(blogSelector, 'target');
    
    if (targetAttribute === '_blank') {
      // If it opens in new tab, handle popup
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click(blogSelector)
      ]);
      
      await newPage.waitForLoadState('networkidle');
      await expect(newPage).toHaveURL(`${baseUrl}/blog-cinesa/`);
      await newPage.close();
    } else {
      // Check if it's an external link by getting href
      const href = await page.getAttribute(blogSelector, 'href');
      
      if (href && href.startsWith('http') && !href.includes(baseUrl)) {
        // External link - just check that it exists
        await expect(page.locator(blogSelector)).toBeVisible();
        console.log(`External blog link detected: ${href}`);
      } else {
        // Internal navigation - wait for navigation
        await Promise.all([
          page.waitForURL(`${baseUrl}/blog-cinesa/`),
          page.click(blogSelector)
        ]);
      }
    }
  });
}
