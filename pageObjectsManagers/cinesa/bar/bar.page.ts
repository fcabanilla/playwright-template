import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { BAR_SELECTORS } from './bar.selectors';
import { WebActions } from '../../../core/webactions/webActions';

/**
 * The Bar Page Object Model.
 * Contains methods to interact with the bar page.
 */
export class BarPage {
  readonly webActions: WebActions;

  constructor(page: Page) {
    this.webActions = new WebActions(page);
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
    const mainButton = this.webActions.getLocator(BAR_SELECTORS.barMainButton);
    await mainButton.waitFor({ state: 'visible', timeout: 5000 });
    await mainButton.click();
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
        
        for (let i = 0; i < Math.min(2, sectionCount); i++) {
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
        
        // Add to cart
        const addToCartButton = this.webActions.getLocator(
          'button.v-item-modal-footer__action-button'
        );
        await addToCartButton.click();
      }
    );
  }

  /**
   * Selects the "MENUS" tab and clicks on the first available menu item.
   */
  async selectClassicMenu(): Promise<void> {
    await allure.step(
      'Select MENUS tab and click on first available menu item',
      async () => {
        await this.webActions.click(BAR_SELECTORS.menusTab);
        const menuItems = this.webActions.getLocator(BAR_SELECTORS.menuItems);
        await menuItems.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await menuItems.count();

        if (count === 0) {
          throw new Error('No menu items found');
        }

        // Get the first menu item and click it
        const firstItem = menuItems.first();
        await firstItem.locator(BAR_SELECTORS.menuItemButton).click();
      }
    );

    await this.selectClassicMenuOptionsAndAddToCart();
  }

  /**
   * Handles the bar page by skipping the modal and clicking the main button.
   */
  async skipBar(): Promise<void> {
    await this.skipModal();
    await this.clickContinue();
  }

  async buyClassicMenuOasiz(): Promise<void> {
    await this.skipModal();
    await this.selectClassicMenu();
    await this.clickBarSummaryContinue();
  }

  async buyClassicMenuGrancasa(): Promise<void> {
    await this.skipModalGrancasa();
    await this.selectClassicMenu();
    await this.clickBarSummaryContinue();
  }

  /**
   * Hace clic en el botón "Continuar" del resumen de compra del bar.
   */
  async clickBarSummaryContinue(): Promise<void> {
    const summaryContinueButton = this.webActions.getLocator(
      BAR_SELECTORS.barSummaryContinueButton
    );
    await summaryContinueButton.waitFor({ state: 'visible', timeout: 10000 });
    while (!(await summaryContinueButton.isEnabled())) {
      await this.webActions.wait(100);
    }
    await summaryContinueButton.click();
  }
}
