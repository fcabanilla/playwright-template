import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { PAYMENT_SELECTORS } from './paymentPage.selectors';
import { paymentTestData } from '../../../tests/cinesa/paymentPage/paymentPage.data';

export class PaymentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expandAccordion(): Promise<void> {
    await allure.test.step('Expanding payment accordion', async () => {
      await this.page.click(PAYMENT_SELECTORS.accordionHeader);
      await this.page.waitForSelector(PAYMENT_SELECTORS.cardNumberInput, { state: 'visible' });
    });
  }

  async enterCardData(cardNumber: string = paymentTestData.cardNumber, pin: string = paymentTestData.pin): Promise<void> {
    await allure.test.step('Entering card data (card number & PIN)', async () => {
      await this.page.fill(PAYMENT_SELECTORS.cardNumberInput, cardNumber);
      await this.page.fill(PAYMENT_SELECTORS.pinInput, pin);
    });
  }

  async clickPay(): Promise<void> {
    await allure.test.step('Clicking pay button', async () => {
      await this.page.click(PAYMENT_SELECTORS.payButton);
    });
  }

  async completePayment(cardNumber?: string, pin?: string): Promise<void> {
    await this.expandAccordion();
    await this.enterCardData(cardNumber, pin);
    await this.clickPay();
  }
}
