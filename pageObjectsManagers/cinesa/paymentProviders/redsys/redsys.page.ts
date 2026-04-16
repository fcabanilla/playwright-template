import { WebActions } from '../../../../core/webactions/webActions';
import { redsysSelectors } from './redsys.selectors';
import { RedsysCreditCard } from './redsys.types';
import { RedsysTestData } from './redsys.data';
import { allure } from 'allure-playwright';

export class RedsysPage {
  constructor(private readonly webActions: WebActions) {}

  private readonly selectors = redsysSelectors;

  /**
   * Fills the credit card form on the Redsys payment gateway
   * @param card Credit card details (optional - defaults to valid VISA unless specified)
   */
  async fillCreditCardDetails(card?: RedsysCreditCard): Promise<void> {
    const cardData = card ?? RedsysTestData.getValidVisa();

    await allure.step('Fill Redsys credit card details', async () => {
      await this.webActions.fill(
        this.selectors.cardNumber,
        cardData.number,
        'Card Number'
      );

      // Wait for card validation/masking
      await this.webActions.wait(1000);

      // Expiration Date — Redsys uses a masked input (MMYY) that:
      //   - Rejects pressSequentially (synthetic keystrokes ignored by mask)
      //   - Accepts fill() momentarily, but mask clears value on blur
      // Solution: Use native value setter + input/change events to bypass
      // React's controlled input and satisfy the mask's validation.
      const expirationValue =
        cardData.expirationMonth + cardData.expirationYear;
      await allure.step(
        `[ACT] Fill masked input | Field=Expiration Date | Value=${expirationValue}`,
        async () => {
          const locator = this.webActions.page.locator(
            this.selectors.expirationDate
          );
          await locator.click();
          await locator.evaluate((el: HTMLInputElement, value: string) => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            )?.set;
            nativeInputValueSetter?.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, expirationValue);
        }
      );

      // Brief wait to let mask process the value before moving focus to CVV
      await this.webActions.wait(500);

      await this.webActions.fill(this.selectors.cvv, cardData.cvv, 'CVV');
    });
  }

  /**
   * Submits the payment form
   */
  async submitPayment(): Promise<void> {
    await allure.step('Submit Redsys payment', async () => {
      await this.webActions.wait(1500);
      // Ensure the button is enabled before clicking, as Redsys validates fields first
      // The HTML shows a class change to "validColor" when ready
      await this.webActions.waitForVisible(
        this.selectors.submitButton,
        15000,
        'Pay Button'
      );
      await this.webActions.click(this.selectors.submitButton, 'Pay Button');
    });
  }

  /**
   * Complete full payment flow (defaults to accepting 3DS)
   */
  async completePayment(
    card?: RedsysCreditCard,
    authAction: 'accept' | 'deny' | 'cancel' = 'accept'
  ): Promise<void> {
    await this.fillCreditCardDetails(card);
    await this.submitPayment();

    switch (authAction) {
      case 'deny':
        await this.deny3DSSimulator();
        break;
      case 'cancel':
        await this.cancel3DSSimulator();
        break;
      case 'accept':
      default:
        await this.accept3DSSimulator();
        break;
    }

    await this.waitFor3DSSimulatorExit();
  }

  /**
   * Accept 3DS Simulator authentication
   */
  async accept3DSSimulator(): Promise<void> {
    await this.handle3DSSimulator('accept');
  }

  /**
   * Deny 3DS Simulator authentication
   */
  async deny3DSSimulator(): Promise<void> {
    await this.handle3DSSimulator('deny');
  }

  /**
   * Cancel 3DS Simulator authentication
   */
  async cancel3DSSimulator(): Promise<void> {
    await this.handle3DSSimulator('cancel');
  }

  /**
   * Private handler for Redsys 3DS Simulator logic
   */
  private async handle3DSSimulator(
    action: 'accept' | 'deny' | 'cancel'
  ): Promise<void> {
    try {
      const simulatorUrlPattern =
        /sis-simulador-web\/authenticationRequest\.jsp/i;

      await this.webActions.page
        .waitForURL((url) => simulatorUrlPattern.test(url.toString()), {
          timeout: 15000,
        })
        .catch(() => {});

      await this.webActions.page
        .waitForLoadState('domcontentloaded')
        .catch(() => {});

      const isSimulator =
        simulatorUrlPattern.test(this.webActions.page.url()) ||
        (await this.webActions.page
          .locator(this.selectors.threeDSSimulator.successRadio)
          .isVisible({ timeout: 2000 })
          .catch(() => false));

      if (isSimulator) {
        await allure.step(
          `Handle Redsys 3DS Simulator: ${action}`,
          async () => {
            let radioSelector: string;
            switch (action) {
              case 'deny':
                radioSelector = this.selectors.threeDSSimulator.denyRadio;
                break;
              case 'cancel':
                radioSelector = this.selectors.threeDSSimulator.cancelRadio;
                break;
              case 'accept':
              default:
                radioSelector = this.selectors.threeDSSimulator.successRadio;
                break;
            }

            const radioVisible = await this.webActions.page
              .locator(radioSelector)
              .isVisible()
              .catch(() => false);

            if (radioVisible) {
              await this.webActions.click(
                radioSelector,
                `Select 3DS action: ${action}`
              );
            }

            const initialUrl = this.webActions.page.url();
            await this.submit3DSSimulatorWithFallbacks(initialUrl);
          }
        );
      } else {
        console.log('[Redsys][3DS] Simulator not detected after wait');
      }
    } catch (e) {
      console.log('Redsys 3DS Simulator not detected or handled automatically');
    }
  }

  private async submit3DSSimulatorWithFallbacks(
    initialUrl: string
  ): Promise<void> {
    let lastError: unknown;

    try {
      await this.webActions.click(
        this.selectors.threeDSSimulator.submitButton,
        'Click Submit 3DS'
      );

      const progressedByClick = await this.waitFor3DSSimulatorProgress(
        initialUrl,
        6000
      );
      if (progressedByClick) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    const triggeredViaSubmitOK = await this.webActions.evaluate(() => {
      const windowWithSubmitOk = window as Window & {
        submitOK?: () => void;
      };

      if (typeof windowWithSubmitOk.submitOK === 'function') {
        windowWithSubmitOk.submitOK();
        return true;
      }

      return false;
    });

    if (triggeredViaSubmitOK) {
      const progressedBySubmitOk = await this.waitFor3DSSimulatorProgress(
        initialUrl,
        6000
      );
      if (progressedBySubmitOk) {
        return;
      }
    }

    const submittedClassicForm = await this.webActions.evaluate(() => {
      const classicForm = document.forms.namedItem('clasico');
      if (classicForm) {
        classicForm.submit();
        return true;
      }

      return false;
    });

    if (submittedClassicForm) {
      const progressedByFormSubmit = await this.waitFor3DSSimulatorProgress(
        initialUrl,
        8000
      );
      if (progressedByFormSubmit) {
        return;
      }
    }

    throw new Error(
      `Failed to submit Redsys 3DS simulator using click, submitOK(), and form submit fallbacks. Last error: ${String(lastError)}`
    );
  }

  private async waitFor3DSSimulatorProgress(
    initialUrl: string,
    timeoutMs = 12000
  ): Promise<boolean> {
    const startedAt = Date.now();
    const page = this.webActions.page;

    while (Date.now() - startedAt < timeoutMs) {
      if (page.url() !== initialUrl) {
        return true;
      }

      const loadingVisible = await page
        .locator(this.selectors.threeDSSimulator.loading)
        .isVisible()
        .catch(() => false);

      if (loadingVisible) {
        const remainingTime = Math.max(
          1000,
          timeoutMs - (Date.now() - startedAt)
        );
        await page
          .locator(this.selectors.threeDSSimulator.loading)
          .waitFor({ state: 'hidden', timeout: remainingTime })
          .catch(() => {});

        if (page.url() !== initialUrl) {
          return true;
        }
      }

      const simulatorHeaderVisible = await page
        .locator(this.selectors.threeDSSimulator.header)
        .isVisible()
        .catch(() => false);

      if (!simulatorHeaderVisible) {
        return true;
      }

      await page.waitForTimeout(300);
    }

    console.log(
      'Redsys 3DS simulator did not expose a clear progress signal before timeout'
    );
    return false;
  }

  private async waitFor3DSSimulatorExit(timeoutMs = 30000): Promise<void> {
    const startedAt = Date.now();
    const page = this.webActions.page;
    const simulatorUrlPattern =
      /sis-simulador-web\/authenticationRequest\.jsp/i;

    while (Date.now() - startedAt < timeoutMs) {
      if (page.isClosed()) {
        return;
      }

      const currentUrl = page.url();
      const simulatorHeaderVisible = await page
        .locator(this.selectors.threeDSSimulator.header)
        .isVisible()
        .catch(() => false);
      const simulatorSubmitVisible = await page
        .locator(this.selectors.threeDSSimulator.submitButton)
        .first()
        .isVisible()
        .catch(() => false);

      const stillOnSimulator =
        simulatorUrlPattern.test(currentUrl) ||
        simulatorHeaderVisible ||
        simulatorSubmitVisible;

      if (!stillOnSimulator) {
        await page.waitForLoadState('domcontentloaded').catch(() => {});
        return;
      }

      await page.waitForTimeout(500);
    }

    throw new Error(
      'Redsys 3DS simulator did not exit within the expected timeout'
    );
  }
}
