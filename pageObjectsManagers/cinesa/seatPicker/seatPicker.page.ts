import { Page, Locator } from '@playwright/test';
import * as allure from 'allure-playwright';
import { SEAT_PICKER_SELECTORS } from './seatPicker.selectors';

/**
 * Possible seat types.
 */
export type SeatType =
  | 'normal'
  | 'vip'
  | 'wheelchair'
  | 'companion'
  | 'recliner';

/**
 * Possible seat states.
 */
export type SeatState = 'available' | 'selected' | 'unavailable' | 'unknown';

/**
 * Interface representing a seat in the seat map.
 */
export interface Seat {
  row: number;
  seatNumber: number;
  seatType: SeatType;
  seatState: SeatState;
  ariaLabel: string;
  locator: Locator;
}

/**
 * Maximum number of seats that can be selected.
 */
const maxSeatSelection = 9;

/**
 * The SeatPicker Page Object Model.
 * Contains methods to interact with the seat picker page.
 */
export class SeatPicker {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the seat picker container to be visible.
   */
  async waitForSeatPicker(): Promise<void> {
    await allure.test.step('Waiting for seat picker container', async () => {
      await this.page.waitForSelector(SEAT_PICKER_SELECTORS.container, {
        state: 'visible',
        timeout: 10000,
      });
    });
  }

  /**
   * Retrieves all seats from the DOM by parsing their aria-label.
   */
  async getAllSeats(): Promise<Seat[]> {
    return await allure.test.step(
      'Retrieving all seats from the DOM',
      async () => {
        await this.waitForSeatPicker();

        const seatLocators = this.page.locator(
          SEAT_PICKER_SELECTORS.seatGeneric
        );
        const count = await seatLocators.count();
        console.log(`Found ${count} seats`);
        const seats: Seat[] = [];

        for (let i = 0; i < count; i++) {
          const seatLocator = seatLocators.nth(i);
          const ariaLabel =
            (await seatLocator.getAttribute('aria-label')) || '';
          const className = (await seatLocator.getAttribute('class')) || '';
          const pressed = await seatLocator.getAttribute('aria-pressed');

          const { row, seatNumber } = this.parseRowAndSeat(ariaLabel);
          const seatIdentifier = `${row}-${seatNumber}`;

          const seatType = this.getSeatType(className, ariaLabel);
          const seatState = await this.getSeatState(seatLocator, className, pressed);

          seats.push({
            row,
            seatNumber,
            seatType,
            seatState,
            ariaLabel,
            locator: seatLocator,
          });
        }

        return seats;
      }
    );
  }

  /**
   * Filters the seats to only those available.
   */
  async getAvailableSeats(): Promise<Seat[]> {
    const allSeats = await this.getAllSeats();
    return allSeats.filter((s) => s.seatState === 'available');
  }

  /**
   * Selects a given seat (click on it).
   */
  async selectSeat(seat: Seat): Promise<void> {
    await allure.test.step(
      `Selecting seat [Row ${seat.row}, Seat ${seat.seatNumber}]`,
      async () => {
        await seat.locator.click();
      }
    );
  }

  /**
   * Selects multiple seats given an array of Seat objects.
   */
  async selectMultipleSeats(seats: Seat[]): Promise<void> {
    await allure.test.step(`Selecting ${seats.length} seats`, async () => {
      for (const seat of seats) {
        await this.selectSeat(seat);
      }
    });
  }

  /**
   * Selects a random available seat.
   * Returns the chosen seat.
   */
  async selectRandomSeat(): Promise<Seat> {
    return await allure.test.step(
      'Selecting a random available seat',
      async () => {
        await this.page.waitForResponse((response) =>
          response.url().includes('/seat-availability') && response.status() === 200
        );

        const availableSeats = await this.getAvailableSeats();
        if (availableSeats.length === 0) {
          throw new Error('No available seats found');
        }
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        const chosenSeat = availableSeats[randomIndex];
        await this.selectSeat(chosenSeat);
        return chosenSeat;
      }
    );
  }

  /**
   * Selects the last available seat (first available seat from the back).
   * Returns the chosen seat.
   */
  async selectLastAvailableSeat(): Promise<Seat> {
    return await allure.test.step('Selecting last available seat from back', async () => {
      await this.page.waitForResponse((response) =>
        response.url().includes('/seat-availability') && response.status() === 200
      );
      const availableSeats = await this.getAvailableSeats();
      if (availableSeats.length === 0) {
        throw new Error('No available seats found');
      }
      const sortedSeats = availableSeats.sort((a, b) => {
        if (a.row !== b.row) return b.row - a.row;
        return b.seatNumber - a.seatNumber;
      });
      const chosenSeat = sortedSeats[0];
      await this.selectSeat(chosenSeat);
      return chosenSeat;
    });
  }

  /**
   * Selects the specified number of available seats from the back to the front.
   * Skips unavailable seats. Maximum number of seats is capped at maxSeatSelection.
   * @param seatCount Number of seats to select.
   * Returns the list of chosen seats.
   */
  async selectLastAvailableSeats(seatCount: number): Promise<Seat[]> {
    return await allure.test.step(
      `Selecting ${seatCount} seats from back to front`,
      async () => {
        if (seatCount > maxSeatSelection) {
          throw new Error(`Cannot select more than ${maxSeatSelection} seats`);
        }

        await this.page.waitForResponse((response) =>
          response.url().includes('/seat-availability') && response.status() === 200
        );

        const availableSeats = await this.getAvailableSeats();
        if (availableSeats.length < seatCount) {
          throw new Error(
            `Not enough available seats. Needed ${seatCount}, found ${availableSeats.length}`
          );
        }

        const sortedSeats = availableSeats.sort((a, b) => {
          if (a.row !== b.row) return b.row - a.row;
          return b.seatNumber - a.seatNumber;
        });

        const chosenSeats = sortedSeats.slice(0, seatCount);
        for (const seat of chosenSeats) {
          await this.selectSeat(seat);
          await this.page.waitForTimeout(300);
        }

        return chosenSeats;
      }
    );
  }

  /**
   * Selects multiple random available seats.
   * @param count Number of seats to select.
   * Returns the list of chosen seats.
   */
  async selectRandomSeats(count: number): Promise<Seat[]> {
    return await allure.test.step(
      `Selecting ${count} random seats`,
      async () => {
        const availableSeats = await this.getAvailableSeats();
        if (availableSeats.length < count) {
          throw new Error(
            `Not enough available seats. Needed ${count}, found ${availableSeats.length}`
          );
        }
        const shuffled = this.shuffleArray(availableSeats);
        const chosenSeats = shuffled.slice(0, count);
        for (const seat of chosenSeats) {
          await this.selectSeat(seat);
        }
        return chosenSeats;
      }
    );
  }

  /**
   * Confirms the selected seats by clicking the confirm/continue button.
   */
  async confirmSeats(): Promise<void> {
    await allure.test.step('Confirming selected seats', async () => {
      await this.page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton).click();
    });
  }

  /**
   * Deselects a seat by clicking on it if it's selected.
   */
  async deselectSeat(seat: Seat): Promise<void> {
    await allure.test.step(
      `Deselecting seat [Row ${seat.row}, Seat ${seat.seatNumber}]`,
      async () => {
        if (seat.seatState === 'selected') {
          await seat.locator.click();
        }
      }
    );
  }

  // ────────────────────────── Helpers ──────────────────────────

  /**
   * Parses row and seat number from an aria-label.
   * Expects a format like "Normal seat 5-9" or "Wheelchair space 1-14".
   */
  private parseRowAndSeat(ariaLabel: string): {
    row: number;
    seatNumber: number;
  } {
    const match = ariaLabel.match(/(\d+)[\s-]+(\d+)/);
    if (!match) {
      return { row: 0, seatNumber: 0 };
    }
    return {
      row: parseInt(match[1], 10),
      seatNumber: parseInt(match[2], 10),
    };
  }

  /**
   * Determines the seat type based on the class names or aria-label.
   */
  private getSeatType(className: string, ariaLabel: string): SeatType {
    if (className.includes('wheelchair')) {
      return 'wheelchair';
    }
    if (className.includes('companion')) {
      return 'companion';
    }
    if (className.includes('vip')) {
      return 'vip';
    }
    if (className.includes('recliner')) {
      return 'recliner';
    }

    return 'normal';
  }

  /**
   * Determines the seat state from class names or the aria-pressed attribute.
   */
  private async getSeatState(seatLocator: Locator, className: string, pressed: string | null): Promise<SeatState> {
    const useLocator = seatLocator.locator('use');
    if (await useLocator.count() > 0) {
      const href = await useLocator.first().getAttribute('href');
      if (href?.includes('selected')) return 'selected';
      if (href?.includes('available')) return 'available';
    }
    
    if (className.includes('--unavailable') || className.includes('--house')) return 'unavailable';
    if (pressed === 'true' || className.includes('--selected')) return 'selected';
    if (pressed === 'false' || className.includes('--available')) return 'available';
    return 'unknown';
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   */
  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
