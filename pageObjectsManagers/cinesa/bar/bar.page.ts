import { allure } from 'allure-playwright';
import { BAR_SELECTORS } from './bar.selectors';
import { WebActions } from '../../../core/webactions/webActions';

/**
 * The Bar Page Object Model.
 * Contains methods to interact with the bar page.
 */
export class BarPage {
  readonly webActions: WebActions;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
  }

  /**
   * Handles the bar modal by clicking the button inside the modal.
   * If the modal does not appear, continues without error.
   * Compatible with all test cases.
   */
  async skipModal(): Promise<void> {
    await allure.step('Handling the bar modal', async () => {
      const modal = this.webActions.getLocator(BAR_SELECTORS.modal);
      const modalButton = this.webActions.getLocator(BAR_SELECTORS.modalButton);

      try {
        await modal.waitFor({ state: 'visible', timeout: 10000 });
        if (await modal.isVisible()) {
          await modalButton.waitFor({ state: 'visible', timeout: 5000 });
          await modalButton.click();
          await modal.waitFor({ state: 'hidden', timeout: 5000 });
        }
      } catch (error) {
        console.log('Bar modal did not appear, continuing...');
      }
    });
  }

  /**
   * Handles the bar modal by clicking the button inside the modal.
   * If the modal does not appear, continues without error.
   * Compatible with all test cases.
   */
  async skipModalGrancasa(): Promise<void> {
    await allure.step('Handling the bar modal', async () => {
      const modal = this.webActions.getLocator(BAR_SELECTORS.modal);
      const modalButton = this.webActions.getLocator(BAR_SELECTORS.modalButton);
      if (
        await modal
          .waitFor({ state: 'visible', timeout: 5000 })
          .catch(() => false)
      ) {
        if (await modal.isVisible()) {
          await modalButton.waitFor({ state: 'visible', timeout: 5000 });
          await modalButton.click();
          await modal.waitFor({ state: 'hidden', timeout: 5000 });
        }
      }
    });
  }

  /**
   * Clicks the main continue button on the bar page.
   */
  async clickContinue(): Promise<void> {
    await allure.step('Click bar continue button', async () => {
      const mainButton = this.webActions.getLocator(
        BAR_SELECTORS.barMainButton
      );
      await mainButton.waitFor({ state: 'visible', timeout: 15000 });
      await mainButton.click();
    });
  }

  /**
   * Selecciona la última opción de cada sección del modal y añade a la compra.
   * Solo selecciona opciones que tengan radio button (no agotadas).
   * Environment-aware: Handles cases where menu sections may be unavailable.
   */
  async selectClassicMenuOptionsAndAddToCart(): Promise<void> {
    await allure.step(
      'Seleccionar última opción de cada sección del modal y añadir a la compra',
      async () => {
        const sections = this.webActions.getLocator(
          BAR_SELECTORS.modalSections
        );
        const sectionCount = await sections.count();
        let selectedAnyOption = false;

        for (let i = 0; i < sectionCount; i++) {
          const section = sections.nth(i);
          const options = section.locator(BAR_SELECTORS.modalSectionOptions);
          const optionCount = await options.count();
          const availableOptionIndexes: number[] = [];

          for (let j = 0; j < optionCount; j++) {
            const option = options.nth(j);
            if ((await option.locator('input[type="radio"]').count()) > 0) {
              availableOptionIndexes.push(j);
            }
          }

          if (availableOptionIndexes.length > 0) {
            await options
              .nth(availableOptionIndexes[availableOptionIndexes.length - 1])
              .click();
            selectedAnyOption = true;
          } else {
            console.log(`Section ${i + 1} has no available options, skipping`);
          }
        }

        if (!selectedAnyOption) {
          throw new Error(
            'No available menu options found in any section. Menu may be unavailable in current environment.'
          );
        }

        // Add to cart - This action may open a new tab or redirect
        const addToCartButton = this.webActions.getLocator(
          BAR_SELECTORS.addToCartButton
        );

        await addToCartButton.click();

        // Wait a moment for any page transitions to complete
        await this.webActions.wait(2000);

        // Try to find the continue button in current page first
        const currentPage = this.webActions.getPage();
        const continueButtonInCurrentPage = currentPage.locator(
          BAR_SELECTORS.barSummaryContinueButton
        );
        const isVisible = await continueButtonInCurrentPage
          .isVisible()
          .catch(() => false);

        if (!isVisible) {
          // Check if there are multiple pages (new tab opened)
          const context = currentPage.context();
          const pages = context.pages();

          if (pages.length > 1) {
            // Switch to the new page (usually the last one)
            const newPage = pages[pages.length - 1];
            await newPage.waitForLoadState('domcontentloaded');
            this.webActions.updatePage(newPage);
          }
        }
      }
    );
  }

  /**
   * Selects the "MENUS" tab and clicks on the menu item containing "CLASICO".
   */
  async selectClassicMenu(): Promise<void> {
    await allure.step(
      'Select MENUS tab and click on CLASICO menu item',
      async () => {
        // Click on second tab (MENUS) using position-based selector
        await this.webActions.click(BAR_SELECTORS.menusTab);
        const menuItems = this.webActions.getLocator(BAR_SELECTORS.menuItems);
        await menuItems.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await menuItems.count();

        if (count === 0) {
          throw new Error('No menu items found');
        }

        // Find and click the menu item that contains "CLASICO" text
        let clasicoFound = false;
        for (let i = 0; i < count; i++) {
          const menuItem = menuItems.nth(i);
          const menuItemName = menuItem.locator(BAR_SELECTORS.menuItemName);
          const itemText = await menuItemName.textContent();

          if (itemText && itemText.toUpperCase().includes('CLASICO')) {
            await menuItem.locator(BAR_SELECTORS.menuItemButton).click();
            clasicoFound = true;
            break;
          }
        }

        if (!clasicoFound) {
          throw new Error(
            'CLASICO menu item not found in available menu items'
          );
        }
      }
    );

    await this.selectClassicMenuOptionsAndAddToCart();
  }

  /**
   * Handles the bar page by skipping the modal and clicking the main button.
   */
  async skipBar(): Promise<void> {
    await allure.step('Skip bar (modal + continue)', async () => {
      await this.skipModal();
      await this.clickContinue();
    });
  }

  async buyClassicMenuOasiz(): Promise<void> {
    await allure.step('Buy classic menu (Oasiz)', async () => {
      await this.skipModal();
      await this.selectClassicMenu();
      await this.clickBarSummaryContinue();
    });
  }

  async buyClassicMenuGrancasa(): Promise<void> {
    await allure.step('Buy classic menu (Grancasa)', async () => {
      await this.skipModalGrancasa();
      await this.selectClassicMenu();
      await this.clickBarSummaryContinue();
    });
  }

  /**
   * Hace clic en el botón "Continuar" del resumen de compra del bar.
   */
  async clickBarSummaryContinue(): Promise<void> {
    await allure.step('Click bar summary continue button', async () => {
      const summaryContinueButton = this.webActions.getLocator(
        BAR_SELECTORS.barSummaryContinueButton
      );
      await summaryContinueButton.waitFor({ state: 'visible', timeout: 10000 });
      while (!(await summaryContinueButton.isEnabled())) {
        await this.webActions.wait(100);
      }
      await summaryContinueButton.click();
    });
  }
}
