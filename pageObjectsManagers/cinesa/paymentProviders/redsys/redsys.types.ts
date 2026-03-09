export interface RedsysCreditCard {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  holderName?: string;
}

export interface RedsysPaymentResult {
  success: boolean;
  message?: string;
}
