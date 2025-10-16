import { WebActions } from '../../../core/webactions/webActions';
import { TICKET_PICKER_SELECTORS } from './ticketPicker.selectors';
import { assertTicketCount } from '../../../tests/cinesa/ticketPicker/ticketPicker.assertions';

export class TicketPicker {
  private readonly selectors = TICKET_PICKER_SELECTORS;

  constructor(private readonly webActions: WebActions) {}

  /**
   * Closes any modal that might be intercepting clicks
   */
  private async closeInterceptingModal(): Promise<void> {
    try {
      // Wait a bit for modals to appear
      await this.webActions.wait(500);
      
      // Specifically handle the glasses modal that's blocking everything
      const glassesModal = 'aside.v-modal.glasses-modal[role="dialog"]';
      const isGlassesModalVisible = await this.webActions.isVisible(glassesModal);
      
      if (isGlassesModalVisible) {
        // Force click the first button in the glasses modal
        const modal = this.webActions.page.locator(glassesModal);
        
        // Try all possible buttons in the modal
        const buttonSelectors = [
          'button:has-text("Seleccionar")',
          'button:has-text("Select")', 
          'button',  // Any button in the modal
          '.v-button'
        ];
        
        for (const buttonSelector of buttonSelectors) {
          try {
            const button = modal.locator(buttonSelector).first();
            const isButtonVisible = await button.isVisible({ timeout: 1000 });
            
            if (isButtonVisible) {
              await button.click({ force: true, timeout: 5000 });
              await this.webActions.wait(2000); // Wait longer for modal to close and page to update
              
              // Verify the glasses modal is gone
              const stillVisible = await this.webActions.isVisible(glassesModal);
              if (!stillVisible) {
                return; // Modal successfully closed
              }
            }
          } catch (error) {
            // Continue to next button
          }
        }
      }
      
      // Handle any other modals
      const genericModalSelectors = [
        'aside.v-modal[role="dialog"]',
        '.v-modal',
        '[role="dialog"]'
      ];
      
      for (const modalSelector of genericModalSelectors) {
        const isModalVisible = await this.webActions.isVisible(modalSelector);
        
        if (isModalVisible) {
          const modal = this.webActions.page.locator(modalSelector);
          
          // Try to click any button in the modal
          const anyButton = modal.locator('button').first();
          const hasButton = await anyButton.isVisible({ timeout: 1000 });
          
          if (hasButton) {
            await anyButton.click({ force: true });
            await this.webActions.wait(1000);
            return;
          }
        }
      }
      
    } catch (error) {
      // No modal found or error handling modal
    }
  }

  /**
   * Adds a ticket by clicking the increment button.
   * If "seats" is provided, clicks that many times.
   */
  private async addTicket(seats?: number): Promise<void> {
    // Handle glasses modal BEFORE any clicks
    await this.handleGlassesModalImmediately();
    
    // Wait for ticket picker to be fully loaded - use first() to avoid strict mode violation
    await this.webActions.page.locator('.v-ticket-picker-table-row').first().waitFor({ state: 'visible', timeout: 5000 });
    await this.webActions.wait(1000);
    
    const clickCount = typeof seats === 'number' && seats > 0 ? seats : 1;
    
    for (let i = 0; i < clickCount; i++) {
      try {
        // Wait for increment button to be available
        await this.webActions.waitForVisible(this.selectors.incrementButton, 3000);
        
        // Try click with force using page.locator
        const incrementButton = this.webActions.page.locator(this.selectors.incrementButton).first();
        await incrementButton.click({ force: true, timeout: 5000 });
        await this.webActions.wait(500); // Wait between clicks
        
        // Check for modals after each click (3D glasses modal can appear)
        await this.handleGlassesModalImmediately();
        
      } catch (error) {
        // Try alternative strategies
        try {
          // Fallback: try clicking any plus button with force
          const fallbackButton = this.webActions.page.locator('button:has-text("+")').first();
          await fallbackButton.click({ force: true });
          await this.webActions.wait(500);
        } catch (fallbackError) {
          // Continue without logging
        }
      }
    }
  }

  /**
   * Gets the current ticket count from the input field.
   */
  private async getTicketCount(): Promise<number> {
    const value = await this.webActions.page.locator(this.selectors.quantityInput).first().inputValue();
    return parseInt(value, 10);
  }

  /**
   * Confirms the selected tickets by clicking the confirm button.
   */
  private async confirmTickets(): Promise<void> {
    await this.webActions.click(this.selectors.confirmButton);
  }

  /**
   * Handles ticket selection, validation, and confirmation.
   */
  async selectTicket(seats?: number): Promise<void> {
    // IMMEDIATELY handle the glasses modal before doing anything else
    await this.handleGlassesModalImmediately();
    
    await this.addTicket(seats);
    
    // Wait for the confirm button to be enabled after ticket selection
    await this.webActions.page.locator(this.selectors.confirmButton).waitFor({ 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Wait a bit more for the button to be enabled
    await this.webActions.wait(2000);
    
    // Handle any modal before confirming
    await this.handleGlassesModalImmediately();
    
    await this.confirmTickets();
  }

  /**
   * Specifically handles the glasses modal that blocks all interaction
   * Based on actual HTML: <aside class="v-modal glasses-modal" aria-modal="true" aria-hidden="false" tabindex="-1" role="dialog">
   */
  private async handleGlassesModalImmediately(): Promise<void> {
    try {
      const glassesModal = 'aside.v-modal.glasses-modal[role="dialog"]';
      
      // Check multiple times in case modal is still appearing
      for (let attempt = 0; attempt < 5; attempt++) {
        const isVisible = await this.webActions.isVisible(glassesModal);
        
        if (isVisible) {
          // Try multiple strategies to click the "Seleccionar" button
          const strategies = [
            // Strategy 1: Exact button with text
            `${glassesModal} button:has-text("Seleccionar")`,
            // Strategy 2: Button by class hierarchy from actual HTML
            `${glassesModal} .v-modal-footer .v-button--color-primary`,
            // Strategy 3: Any button in the footer
            `${glassesModal} .v-modal-footer button`,
            // Strategy 4: Any v-button in the modal
            `${glassesModal} .v-button`,
            // Strategy 5: Generic button in modal
            `${glassesModal} button`
          ];
          
          for (const buttonSelector of strategies) {
            try {
              const button = this.webActions.page.locator(buttonSelector).first();
              const buttonExists = await button.isVisible({ timeout: 1000 });
              
              if (buttonExists) {
                // Force click to bypass the overlay
                await button.click({ force: true, timeout: 5000 });
                await this.webActions.wait(2000); // Wait for modal to close
                
                // Verify modal is gone
                const stillThere = await this.webActions.isVisible(glassesModal);
                if (!stillThere) {
                  return; // Successfully closed
                }
              }
            } catch (buttonError) {
              // Try next strategy
              continue;
            }
          }
        }
        
        await this.webActions.wait(500); // Wait before next attempt
      }
    } catch (error) {
      // Couldn't handle modal
    }
  }

  /**
   * Retrieves the title/description of each ticket type available in the list.
   * Returns an array of ticket type names.
   */
  async getTicketTypeNames(): Promise<string[]> {
    await this.webActions.waitForVisible(this.selectors.ticketTitle, 7000);
    const count = await this.webActions.getElementCount(this.selectors.ticketRow);
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const selector = `${this.selectors.ticketRow}:nth-child(${i + 1}) ${this.selectors.ticketTitle}`;
      try {
        const name = await this.webActions.getText(selector);
        names.push(name.trim());
      } catch (e) {
        names.push('');
      }
    }
    return names;
  }

  /**
   * Abre el acordeón de código promocional si no está abierto.
   */
  private async openPromoAccordion(): Promise<void> {
    await this.webActions.waitForVisible(this.selectors.promoAccordionHeader, 7000);
    const isContentVisible = await this.webActions.isVisible(this.selectors.promoAccordionContent);
    if (!isContentVisible) {
      await this.webActions.click(this.selectors.promoAccordionHeader);
      await this.webActions.waitForVisible(this.selectors.promoAccordionContent, 3000);
    }
  }

  /**
   * Rellena el input del código promocional.
   */
  private async fillPromoInput(promo: string): Promise<void> {
    await this.webActions.waitForVisible(this.selectors.promoInput, 3000);
    await this.webActions.fill(this.selectors.promoInput, promo);
  }

  /**
   * Selecciona la opción del combo de código promocional.
   */
  private async selectPromoComboOption(optionText: string): Promise<void> {
    await this.webActions.waitForVisible(this.selectors.promoComboButton, 3000);
    await this.webActions.click(this.selectors.promoComboButton);
    const optionSelector = `${this.selectors.promoComboOptionText}:has-text("${optionText}")`;
    await this.webActions.waitForVisible(optionSelector, 3000);
    await this.webActions.click(optionSelector);
  }

  /**
   * Hace click en el botón continuar del formulario promocional.
   */
  private async clickPromoContinue(): Promise<void> {
    await this.webActions.waitForVisible(this.selectors.promoContinueButton, 3000);
    await this.webActions.click(this.selectors.promoContinueButton);
  }

  /**
   * Selecciona un código promocional en el acordeón correspondiente.
   * @param promo Código promocional a ingresar
   */
  async selectPromotionalCode(promo: string): Promise<void> {
    await this.openPromoAccordion();
    await this.fillPromoInput(promo);
    await this.selectPromoComboOption(promo);
    await this.clickPromoContinue();
  }
}
