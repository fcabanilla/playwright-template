import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import {
  SEAT_PICKER_SELECTORS,
  url as seatPickerUrl,
  expectedLegendItems,
} from './seatPicker.selectors';

/** Tipo de asiento disponible (también definido en selectors) */
export type SeatType = 'normal' | 'vip' | 'wheelchair';

export class SeatPicker {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega a la página del seat picker.
   *
   * @returns Promise que se resuelve cuando la navegación finaliza.
   */
  async navigate(): Promise<void> {
    await allure.test.step('Navigating to seat picker page', async () => {
      await this.page.goto(seatPickerUrl);
    });
  }

  /**
   * Selecciona un asiento basado en el tipo y un identificador único.
   *
   * @param type - Tipo de asiento ('normal', 'vip', 'wheelchair')
   * @param seatIdentifier - Identificador único del asiento (por ejemplo, el valor del atributo data-seat-id)
   */
  async selectSeatByType(
    type: SeatType,
    seatIdentifier: string
  ): Promise<void> {
    await allure.test.step(
      `Selecting seat of type "${type}" with id "${seatIdentifier}"`,
      async () => {
        let selector = '';
        switch (type.toLowerCase()) {
          case 'normal':
            selector = SEAT_PICKER_SELECTORS.seatNormal;
            break;
          case 'vip':
            selector = SEAT_PICKER_SELECTORS.seatVip;
            break;
          case 'wheelchair':
            selector = SEAT_PICKER_SELECTORS.seatWheelchair;
            break;
          default:
            throw new Error(`Unknown seat type: ${type}`);
        }
        // Se utiliza el atributo definido en SEAT_PICKER_SELECTORS.seatAttribute
        const seat = this.page.locator(
          `${selector}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"]`
        );
        await seat.click();
      }
    );
  }

  /**
   * Obtiene el estado actual del asiento.
   *
   * @param seatIdentifier - Identificador único del asiento
   * @returns Estado del asiento (por ejemplo, 'available', 'selected', 'unavailable')
   */
  async getSeatState(seatIdentifier: string): Promise<string> {
    return await allure.test.step(
      `Getting state for seat with id "${seatIdentifier}"`,
      async () => {
        const dynamicSelector =
          `${SEAT_PICKER_SELECTORS.seatNormal}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"], ` +
          `${SEAT_PICKER_SELECTORS.seatVip}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"], ` +
          `${SEAT_PICKER_SELECTORS.seatWheelchair}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"]`;
        const seat = this.page.locator(dynamicSelector);
        return (await seat.getAttribute('aria-pressed')) || 'unknown';
      }
    );
  }

  /**
   * Obtiene las leyendas presentes en el seat picker.
   *
   * @returns Array de textos de las leyendas.
   */
  async getLegendItems(): Promise<string[]> {
    return await allure.test.step(
      'Retrieving seat picker legend items',
      async () => {
        const legend = this.page.locator(SEAT_PICKER_SELECTORS.legend);
        const items = await legend
          .locator('.v-seat-picker-legend-item__label')
          .allTextContents();
        return items;
      }
    );
  }

  /**
   * Navega a la página del ticket picker, en caso de que la selección de asientos la dispare.
   */
  async navigateToTicketPicker(): Promise<void> {
    await allure.test.step('Navigating to ticket picker', async () => {
      await this.page.click(SEAT_PICKER_SELECTORS.ticketPickerButton);
    });
  }

  /**
   * Selecciona múltiples asientos en una sola llamada.
   *
   * @param seats - Array de objetos con type y seatIdentifier.
   */
  async selectMultipleSeats(
    seats: { type: SeatType; seatIdentifier: string }[]
  ): Promise<void> {
    await allure.test.step('Selecting multiple seats', async () => {
      for (const { type, seatIdentifier } of seats) {
        await this.selectSeatByType(type, seatIdentifier);
      }
    });
  }

  /**
   * Deselecciona un asiento haciendo clic nuevamente sobre él.
   *
   * @param seatIdentifier - Identificador único del asiento.
   */
  async deselectSeat(seatIdentifier: string): Promise<void> {
    await allure.test.step(
      `Deselecting seat with id "${seatIdentifier}"`,
      async () => {
        const seat = this.page.locator(
          `[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"]`
        );
        await seat.click();
      }
    );
  }

  /**
   * Verifica si un asiento está disponible (se asume que "false" en aria-pressed indica disponibilidad).
   *
   * @param seatIdentifier - Identificador único del asiento.
   * @returns true si está disponible, false en caso contrario.
   */
  async verifySeatAvailability(seatIdentifier: string): Promise<boolean> {
    return await allure.test.step(
      `Verifying availability for seat with id "${seatIdentifier}"`,
      async () => {
        const state = await this.getSeatState(seatIdentifier);
        return state === 'false';
      }
    );
  }

  /**
   * Espera hasta que un asiento alcance el estado esperado.
   *
   * @param seatIdentifier - Identificador único del asiento.
   * @param expectedState - Estado esperado (por ejemplo, "true" para seleccionado).
   * @param timeout - Tiempo máximo de espera en milisegundos (opcional, por defecto 5000).
   */
  async waitForSeatState(
    seatIdentifier: string,
    expectedState: string,
    timeout: number = 5000
  ): Promise<void> {
    await allure.test.step(
      `Waiting for seat with id "${seatIdentifier}" to be "${expectedState}"`,
      async () => {
        const dynamicSelector =
          `${SEAT_PICKER_SELECTORS.seatNormal}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"], ` +
          `${SEAT_PICKER_SELECTORS.seatVip}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"], ` +
          `${SEAT_PICKER_SELECTORS.seatWheelchair}[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"]`;

        await this.page.waitForFunction(
          (params) => {
            const { selector, expected } = params;
            const el = document.querySelector(selector);
            return el && el.getAttribute('aria-pressed') === expected;
          },
          { selector: dynamicSelector, expected: expectedState },
          { timeout }
        );
      }
    );
  }

  /**
   * Captura un screenshot del asiento indicado.
   *
   * @param seatIdentifier - Identificador único del asiento.
   */
  async screenshotSeat(seatIdentifier: string): Promise<void> {
    await allure.test.step(
      `Taking screenshot for seat with id "${seatIdentifier}"`,
      async () => {
        const seat = this.page.locator(
          `[${SEAT_PICKER_SELECTORS.seatAttribute}="${seatIdentifier}"]`
        );
        await seat.screenshot({ path: `seat-${seatIdentifier}.png` });
      }
    );
  }

  // Se pueden agregar más funciones según se requiera ampliar la interacción con el seat picker.
}
