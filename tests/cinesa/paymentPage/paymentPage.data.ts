export interface PaymentData {
  cardNumber: string;
  pin: string;
}

export const paymentTestData: PaymentData = {
  cardNumber: '1234567890123456',
  pin: '1234'
};
