import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { paymentPageSelectors } from './paymentPage.selectors';

export class PaymentPage {
  private readonly selectors = paymentPageSelectors;

  constructor(private readonly webActions: WebActions) {}

  /**
   * Expands the Gift Card accordion only if it is currently collapsed.
   * This makes the test idempotent regarding the initial state.
   */
  async expandGiftCardAccordionIfCollapsed(): Promise<void> {
    await allure.step('Expand Gift Card accordion if collapsed', async () => {
      // Check if the content is already visible
      const isVisible = await this.webActions.isVisible(
        this.selectors.giftCard.content
      );

      if (!isVisible) {
        await allure.step(
          'Accordion is collapsed, clicking header',
          async () => {
            await this.webActions.click(
              this.selectors.giftCard.header,
              'Gift Card Accordion Header'
            );
            await this.webActions.expectVisible(
              this.selectors.giftCard.cardNumberInput
            );
          }
        );
      } else {
        await allure.step('Accordion is already expanded', async () => {});
      }
    });
  }

  async enterCardData(cardNumber: string, pin: string): Promise<void> {
    await allure.step('Entering card data (card number & PIN)', async () => {
      await this.webActions.fill(
        this.selectors.giftCard.cardNumberInput,
        cardNumber,
        'Gift Card Number'
      );
      await this.webActions.expectVisible(this.selectors.giftCard.pinInput);
      await this.webActions.fill(
        this.selectors.giftCard.pinInput,
        pin,
        'Gift Card PIN'
      );
    });
  }

  /**
   * Clicks the "Add Gift Card" button (inside the accordion).
   * Do NOT confuse with the main "Pay" button.
   */
  async clickAddGiftCard(): Promise<void> {
    await allure.step('Clicking Add Gift Card button', async () => {
      await this.webActions.click(
        this.selectors.giftCard.addButton,
        'Add Gift Card Button'
      );
    });
  }

  /**
   * Clicks the main payment button (e.g., Pay with Credit Card).
   */
  async clickMainPay(): Promise<void> {
    await allure.step('Clicking Main Pay button', async () => {
      await this.webActions.click(
        this.selectors.mainPayment.payButtonFallback,
        'Main Payment Button'
      );
    });
  }

  /**
   * Adds a gift card to the order without clicking the final pay button.
   * Use this when the gift card may NOT cover the full amount and a
   * secondary payment method is still required.
   *
   * @param cardNumber - Gift Card number (defaults to env var)
   * @param pin - Gift Card PIN (defaults to env var)
   */
  async completePayment(cardNumber: string, pin: string): Promise<void> {
    await this.expandGiftCardAccordionIfCollapsed();
    await this.enterCardData(cardNumber, pin);
    await this.clickAddGiftCard();
  }

  /**
   * Detects whether the gift card covered the full order amount.
   * When coverage is 100%, the dedicated "Pagar ahora" button becomes visible.
   * Polls every 500ms for up to 10s to handle variable processing times.
   */
  async isGiftCardCoveringFullAmount(): Promise<boolean> {
    return await allure.step(
      'Checking whether Gift Card covers the full order amount',
      async () => {
        const maxWait = 10000;
        const pollInterval = 500;
        const startTime = Date.now();

        while (Date.now() - startTime < maxWait) {
          const isVisible = await this.webActions.isVisible(
            this.selectors.mainPayment.completeOrderButton
          );
          if (isVisible) return true;
          await this.webActions.wait(pollInterval);
        }

        return false;
      }
    );
  }

  /**
   * Full gift card payment: adds the card AND clicks "Pagar ahora".
   * Use only when the gift card covers 100% of the order amount.
   *
   * @param cardNumber - Gift Card number (defaults to env var)
   * @param pin - Gift Card PIN (defaults to env var)
   */
  async completeGiftCardPayment(
    cardNumber: string,
    pin: string
  ): Promise<void> {
    await this.completePayment(cardNumber, pin);
    // The blue "Pagar" button inside the gift card form processes the payment.
    // When the gift card covers 100%, the system redirects to booking confirmation.
    // No additional button click is needed — do NOT click the external credit card button.
  }

  /**
   * Clicks the "Pagar ahora" button that appears after a gift card
   * covers the full order amount (Coste restante: 0,00 €).
   */
  async clickCompleteOrder(): Promise<void> {
    await allure.step(
      'Clicking Complete Order button (Pagar ahora)',
      async () => {
        await this.webActions.waitForVisible(
          this.selectors.mainPayment.completeOrderButton,
          15000,
          'Complete Order Button (Pagar ahora)'
        );
        await this.webActions.click(
          this.selectors.mainPayment.completeOrderButton,
          'Complete Order Button (Pagar ahora)'
        );
      }
    );
  }

  /**
   * Explicitly pays with the Credit Card / Main Payment method.
   * Use this for tests that verify the Redsys/Bank connection.
   */
  async payWithCreditCard(): Promise<void> {
    await this.clickMainPay();
  }
}
