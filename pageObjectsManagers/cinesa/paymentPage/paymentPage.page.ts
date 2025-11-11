import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { PAYMENT_SELECTORS } from './paymentPage.selectors';
import { paymentTestData } from '../../../tests/cinesa/paymentPage/paymentPage.data';

export class PaymentPage {
  readonly webActions: WebActions;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
  }

  async expandAccordion(): Promise<void> {
    await allure.step('Expanding payment accordion', async () => {
      await this.webActions.click(PAYMENT_SELECTORS.accordionHeader, 'Expand payment accordion');
      await this.webActions.expectVisible(PAYMENT_SELECTORS.cardNumberInput);
    });
  }

  async enterCardData(cardNumber: string = paymentTestData.cardNumber, pin: string = paymentTestData.pin): Promise<void> {
    await allure.step('Entering card data (card number & PIN)', async () => {
      const page = this.webActions.getPage();
      await page.fill(PAYMENT_SELECTORS.cardNumberInput, cardNumber);
      await this.webActions.expectVisible(PAYMENT_SELECTORS.pinInput);
      await page.fill(PAYMENT_SELECTORS.pinInput, pin);
    });
  }

  async clickPay(): Promise<void> {
    await allure.step('Clicking pay button', async () => {
      await this.webActions.click(PAYMENT_SELECTORS.payButton, 'Click pay button');
    });
  }

  async completePayment(cardNumber?: string, pin?: string): Promise<void> {
    await this.expandAccordion();
    await this.enterCardData(cardNumber, pin);
    await this.clickPay();
  }
}
