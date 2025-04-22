import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { PaymentPage } from '../../../pageObjectsManagers/cinesa/paymentPage/paymentPage.page';

test.describe('Payment Page', () => {
  test('Completar pago usando tarjeta regalo', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await page.goto('https://www.example.com/payment');
    await paymentPage.completePayment();
  });
});
