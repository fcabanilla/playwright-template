import { RedsysCreditCard } from './redsys.types';

export class RedsysTestData {
  /**
   * Returns a valid VISA card for testing.
   * Reads from environment variables or throws an error if not configured.
   */
  static getValidVisa(): RedsysCreditCard {
    return {
      number: this.getEnvVar('CREDIT_CARD_VISA'),
      expirationMonth: this.getEnvVar('CREDIT_CARD_EXP_MONTH'),
      expirationYear: this.getEnvVar('CREDIT_CARD_EXP_YEAR'),
      cvv: this.getEnvVar('CREDIT_CARD_CVV'),
      holderName: 'Valid Visa User',
    };
  }

  /**
   * Returns a valid Mastercard for testing.
   * Reads from environment variables or throws an error if not configured.
   */
  static getValidMastercard(): RedsysCreditCard {
    return {
      number: this.getEnvVar('CREDIT_CARD_MASTERCARD'),
      expirationMonth: this.getEnvVar('CREDIT_CARD_EXP_MONTH'),
      expirationYear: this.getEnvVar('CREDIT_CARD_EXP_YEAR'),
      cvv: this.getEnvVar('CREDIT_CARD_CVV'),
      holderName: 'Valid Mastercard User',
    };
  }

  /**
   * Returns a card with an invalid number for negative testing.
   */
  static getInvalidCard(): RedsysCreditCard {
    return {
      number: '4000000000000002', // Luhn check fail usually
      expirationMonth: '12',
      expirationYear: '30',
      cvv: '123',
      holderName: 'Invalid Card User',
    };
  }

  /**
   * Returns an expired card for negative testing.
   */
  static getExpiredCard(): RedsysCreditCard {
    return {
      number: this.getEnvVar('CREDIT_CARD_VISA'),
      expirationMonth: '01',
      expirationYear: '20', // Expired year
      cvv: '123',
      holderName: 'Expired Card User',
    };
  }

  private static getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(
        `Missing required environment variable for Redsys test data: ${key}`
      );
    }
    return value;
  }
}
