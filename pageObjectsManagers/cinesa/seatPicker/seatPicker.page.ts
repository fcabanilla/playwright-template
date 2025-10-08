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
   * Waits for the seats to load and ensures they are visible and interactable.
   */
  private async waitForSeatsToBeReady(): Promise<void> {
    await allure.test.step('Waiting for seats to be ready', async () => {
      const seatLocators = this.page.locator(SEAT_PICKER_SELECTORS.seatGeneric);

      // Wait for at least one seat to be visible
      await seatLocators.first().waitFor({ state: 'visible', timeout: 10000 });

      // Ensure all seats have loaded by checking their count
      const count = await seatLocators.count();
      if (count === 0) {
        throw new Error('No seats found after waiting for them to load');
      }

      // Wait for all seats to have their aria-pressed attribute set
      await this.page.waitForFunction(
        (selector) => {
          const seats = Array.from(document.querySelectorAll(selector));
          return seats.every((seat) => seat.getAttribute('aria-pressed') !== null);
        },
        SEAT_PICKER_SELECTORS.seatGeneric
      );
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
   * Retrieves all sofa seats from the sofa section in the DOM as a matrix.
   * Each sublist represents a row, and each element in the sublist is a seat.
   */
  async getAllSofaSeats(): Promise<Seat[][]> {
    return await allure.test.step('Retrieving all sofa seats from the sofa section as a matrix', async () => {
      await this.waitForSeatPicker();

      // Locate the sofa section
      const sofaSectionLocator = this.page.locator(SEAT_PICKER_SELECTORS.sofaSection);
      await sofaSectionLocator.waitFor({ state: 'visible', timeout: 10000 });

      const seatLocators = sofaSectionLocator.locator(SEAT_PICKER_SELECTORS.seatGeneric);
      const count = await seatLocators.count();
      console.log(`Found ${count} seats in the sofa section`);

      if (count === 0) {
        throw new Error('No seats found in the sofa section after waiting for them to load');
      }

      const sofaSeats: Seat[] = [];

      for (let i = 0; i < count; i++) {
        const seatLocator = seatLocators.nth(i);
        await seatLocator.waitFor({ state: 'visible', timeout: 5000 });

        const ariaLabel = (await seatLocator.getAttribute('aria-label')) || '';
        const className = (await seatLocator.getAttribute('class')) || '';

        // Filter for sofa seats based on specific class or aria-label patterns
        if (className.includes('v-seat-picker-seat--normal') && ariaLabel.toLowerCase().includes('normal seat')) {
          const { row, seatNumber } = this.parseRowAndSeat(ariaLabel);
          const seatType = this.getSeatType(className, ariaLabel);
          const seatState = await this.getSeatState(seatLocator, className, null);

          sofaSeats.push({
            row,
            seatNumber,
            seatType,
            seatState,
            ariaLabel,
            locator: seatLocator,
          });
        }
      }

      // Group seats into a matrix by row
      const seatsMatrix: Seat[][] = [];
      let currentRow: number | null = null;
      let currentRowSeats: Seat[] = [];

      for (const seat of sofaSeats.sort((a, b) => a.row - b.row || a.seatNumber - b.seatNumber)) {
        if (currentRow === null || seat.row !== currentRow) {
          if (currentRowSeats.length > 0) {
            seatsMatrix.push(currentRowSeats);
          }
          currentRow = seat.row;
          currentRowSeats = [];
        }
        currentRowSeats.push(seat);
      }

      if (currentRowSeats.length > 0) {
        seatsMatrix.push(currentRowSeats);
      }

      return seatsMatrix;
    });
  }

  /**
   * Filters the seats to only those available.
   */
  async getAvailableSeats(): Promise<Seat[]> {
    await this.waitForSeatsToBeReady();
    const allSeats = await this.getAllSeats();
    return allSeats.filter((s) => s.seatState === 'available');
  }

  /**
   * Retrieves available seats organized as a matrix (list of lists).
   * Each sublist represents a row, and each element in the sublist is a seat.
   */
  async getAvailableSeatsMatrix(): Promise<Seat[][]> {
    return await allure.test.step(
      'Retrieving available seats as a matrix',
      async () => {
        const availableSeats = await this.getAvailableSeats();
        const seatsMatrix: Seat[][] = [];
        let currentRow: number | null = null;
        let currentRowSeats: Seat[] = [];
        for (const seat of availableSeats) {
          if (currentRow === null || seat.row !== currentRow) {
            if (currentRowSeats.length > 0) {
              seatsMatrix.push(currentRowSeats);
            }
            currentRow = seat.row;
            currentRowSeats = [];
          }
          currentRowSeats.push(seat);
        }
        if (currentRowSeats.length > 0) {
          seatsMatrix.push(currentRowSeats);
        }
        return seatsMatrix;
      }
    );
  }

  /**
   * Selects a given seat (click on it) and waits for its state to change.
   */
  async selectSeat(seat: Seat): Promise<void> {
    await allure.test.step(
      `Selecting seat [Row ${seat.row}, Seat ${seat.seatNumber}]`,
      async () => {
        // First attempt to click the seat
        try {
          await seat.locator.click({ timeout: 3000 });
        } catch (error) {
          // If click fails (likely due to modal), handle modal and try again
          await this.handleShowtimeAttributeModal();
          await seat.locator.click();
        }
        
        const elementHandle = await seat.locator.elementHandle();
        await this.page.waitForFunction(
          (element) => element?.getAttribute('aria-pressed') === 'true',
          elementHandle
        );
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
      await this.waitForSeatsToBeReady();
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
   * Selecciona el último sofá disponible (de atrás hacia adelante) y devuelve el objeto Seat completo.
   */
  async selectLastAvailableSofaSeat(): Promise<Seat> {
    return await allure.test.step('Selecting last available sofa seat from back', async () => {
      await this.waitForSeatsToBeReady();
      const sofaMatrix = await this.getAllSofaSeats();
      const allSofas = sofaMatrix.flat();
      const availableSofas = allSofas.filter(seat => seat.seatState === 'available');
      if (availableSofas.length === 0) {
        throw new Error('No available sofa seats found');
      }
      const sortedSofas = availableSofas.sort((a, b) => {
        if (a.row !== b.row) return b.row - a.row;
        return b.seatNumber - a.seatNumber;
      });
      const chosenSofa = sortedSofas[0];
      await this.selectSeat(chosenSofa);
      return chosenSofa;
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
        await this.waitForSeatsToBeReady();
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
   * Selects seats with an empty space between them.
   * Ensures there are three contiguous available seats in the same row.
   * Selects the first and third seats, leaving the second seat empty.
   * Returns the list of chosen seats.
   */
  async selectSeatsWithEmptySpaceBetween(): Promise<Seat[]> {
    return await allure.test.step(
      'Selecting seats with an empty space between them',
      async () => {
        await this.page.waitForResponse((response) =>
          response.url().includes('/seat-availability') && response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const availableSeats = await this.getAvailableSeats();

        const seatsByRow = availableSeats.reduce((acc, seat) => {
          acc[seat.row] = acc[seat.row] || [];
          acc[seat.row].push(seat);
          return acc;
        }, {} as Record<number, Seat[]>);

        for (const row in seatsByRow) {
          const rowSeats = seatsByRow[row].sort((a, b) => a.seatNumber - b.seatNumber);

          for (let i = 0; i < rowSeats.length - 2; i++) {
            const firstSeat = rowSeats[i];
            const secondSeat = rowSeats[i + 1];
            const thirdSeat = rowSeats[i + 2];

            if (
              secondSeat.seatNumber === firstSeat.seatNumber + 1 &&
              thirdSeat.seatNumber === secondSeat.seatNumber + 1
            ) {
              await this.selectSeat(firstSeat);
              await this.selectSeat(thirdSeat);
              return [firstSeat, thirdSeat];
            }
          }
        }

        throw new Error('No suitable seats found with an empty space between them');
      }
    );
  }

  /**
   * Selects seats by separating a group in the same row.
   * Starts searching from the back rows and the first available seat in each row.
   * Returns the list of chosen seats.
   */
  async selectSeatsSeparatingGroupInSameRow(): Promise<Seat[]> {
    return await allure.test.step(
      'Selecting seats separating group in the same row',
      async () => {
        await this.page.waitForResponse((response) =>
          response.url().includes('/seat-availability') && response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const availableSeats = await this.getAvailableSeats();

        const seatsByRow = availableSeats.reduce((acc, seat) => {
          acc[seat.row] = acc[seat.row] || [];
          acc[seat.row].push(seat);
          return acc;
        }, {} as Record<number, Seat[]>);

        const sortedRows = Object.keys(seatsByRow)
          .map(Number)
          .sort((a, b) => b - a);

        for (const row of sortedRows) {
          const rowSeats = seatsByRow[row].sort((a, b) => a.seatNumber - b.seatNumber);

          for (let i = 0; i < rowSeats.length - 4; i++) {
            const firstSeat = rowSeats[i];
            const secondSeat = rowSeats[i + 1];
            const thirdSeat = rowSeats[i + 4];

            if (
              secondSeat.seatNumber === firstSeat.seatNumber + 1 &&
              thirdSeat.seatNumber === firstSeat.seatNumber + 4
            ) {
              await this.selectSeat(firstSeat);
              await this.page.waitForTimeout(300);

              await this.selectSeat(secondSeat);
              await this.page.waitForTimeout(300);

              await this.selectSeat(thirdSeat);
              await this.page.waitForTimeout(300);

              return [firstSeat, secondSeat, thirdSeat];
            }
          }
        }

        throw new Error('No suitable seats found for the test');
      }
    );
  }

  /**
   * Selects seats by separating a group in different rows.
   * Finds two available seats in the backmost row (from last row to first row).
   * Then finds one available seat in the next rows.
   * Returns the list of chosen seats.
   */
  async selectSeatsSeparatingGroupInDifferentRows(): Promise<Seat[]> {
    return await allure.test.step(
      'Selecting seats separating group in different rows',
      async () => {
        await this.page.waitForResponse((response) =>
          response.url().includes('/seat-availability') && response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const seatsMatrix = await this.getAvailableSeatsMatrix();
        const selectedSeats: Seat[] = [];
        for (let rowIndex = seatsMatrix.length - 1; rowIndex >= 0; rowIndex--) {
          const row = seatsMatrix[rowIndex];
          const sortedRow = row.sort((a, b) => a.seatNumber - b.seatNumber);

          for (let i = 0; i < sortedRow.length - 1; i++) {
            const firstSeat = sortedRow[i];
            const secondSeat = sortedRow[i + 1];
            if (firstSeat.seatState === 'available' && secondSeat.seatState === 'available') {
              selectedSeats.push(firstSeat, secondSeat);
              rowIndex--;
              break;
            }
          }
          if (selectedSeats.length === 2) {
            for (; rowIndex >= 0; rowIndex--) {
              const nextRow = seatsMatrix[rowIndex];
              if (nextRow.length > 0) {
                const sortedNextRow = nextRow.sort((a, b) => a.seatNumber - b.seatNumber);
                selectedSeats.push(sortedNextRow[0]);
                break;
              }
            }
            break;
          }
        }
        if (selectedSeats.length < 3) {
          throw new Error('No suitable seats found for the group');
        }
        for (const seat of selectedSeats) {
          await this.selectSeat(seat);
          await this.page.waitForTimeout(300);
        }
        return selectedSeats;
      }
    );
  }

  /**
   * Selects more than the maximum allowed seats.
   * Returns the list of chosen seats.
   */
  async selectMoreThanMaxSeats(): Promise<Seat[]> {
    return await allure.test.step(
      `Selecting seats to exceed max capacity`,
      async () => {
        const extraSeatsToTest = 3; // Number of extra seats to test
        const seatCount = maxSeatSelection + extraSeatsToTest; // Total seats to select

        await this.page.waitForResponse((response) =>
          response.url().includes('/seat-availability') && response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const seatsMatrix = await this.getAvailableSeatsMatrix();
        const selectedSeats: Seat[] = [];
        let totalSelected = 0;

        for (let rowIndex = seatsMatrix.length - 1; rowIndex >= 0; rowIndex--) {
          const row = seatsMatrix[rowIndex];
          const sortedRow = row.sort((a, b) => a.seatNumber - b.seatNumber);

          for (const seat of sortedRow) {
            if (totalSelected >= seatCount) break;
            await this.selectSeat(seat);
            selectedSeats.push(seat);
            totalSelected++;
          }
          if (totalSelected >= seatCount) break;
        }
        if (selectedSeats.length !== seatCount) {
          throw new Error(`Expected to select ${seatCount} seats, but only selected ${selectedSeats.length}`);
        }
        await this.page.waitForTimeout(500);
        for (let i = 0; i < selectedSeats.length; i++) {
          selectedSeats[i].seatState = await this.getSeatState(
            selectedSeats[i].locator,
            await selectedSeats[i].locator.getAttribute('class') || '',
            await selectedSeats[i].locator.getAttribute('aria-pressed')
          );
        }
        return selectedSeats;
      }
    );
  }

  /**
   * Selects a companion seat.
   * Finds the first available companion seat and selects it.
   */
  async selectCompanionSeat(): Promise<void> {
    return await allure.test.step('Selecting a companion seat', async () => {
      await this.page.waitForResponse((response) =>
        response.url().includes('/seat-availability') && response.status() === 200
      );
      await this.waitForSeatsToBeReady();
      const allSeats = await this.getAllSeats();
      const companionSeat = allSeats.find((seat) => seat.seatType === 'companion' && seat.seatState === 'available');
      if (!companionSeat) {
        throw new Error('No available companion seat found');
      }
      await this.selectSeat(companionSeat);
    });
  }

  /**
   * Selects a wheelchair seat and handles the wheelchair modal if it appears.
   * @param wheelchairSeat The wheelchair seat to select.
   */
  async selectWheelchairSeat(wheelchairSeat: Seat): Promise<void> {
    await allure.test.step(
      `Selecting wheelchair seat [Row ${wheelchairSeat.row}, Seat ${wheelchairSeat.seatNumber}]`,
      async () => {
        await wheelchairSeat.locator.click();
        const elementHandle = await wheelchairSeat.locator.elementHandle();
        await this.acceptWheelchairMessage();
        await this.page.waitForFunction(
          (element) => element?.getAttribute('aria-pressed') === 'true',
          elementHandle
        );
      }
    );
  }

  /**
   * Selects a companion seat and a contiguous wheelchair seat.
   * Finds the first available companion seat and its contiguous wheelchair seat, then selects both.
   */
  async selectCompanionAndWheelchairSeats(): Promise<void> {
    return await allure.test.step('Selecting a companion seat and a contiguous wheelchair seat', async () => {
      await this.page.waitForResponse((response) =>
        response.url().includes('/seat-availability') && response.status() === 200
      );
      await this.waitForSeatsToBeReady();
      const allSeats = await this.getAllSeats();
      const companionSeat = allSeats.find((seat) => seat.seatType === 'companion' && seat.seatState === 'available');
      if (!companionSeat) {
        throw new Error('No available companion seat found');
      }
      const wheelchairSeat = allSeats.find(
        (seat) =>
          seat.seatType === 'wheelchair' &&
          seat.seatState === 'available' &&
          seat.row === companionSeat.row &&
          (seat.seatNumber === companionSeat.seatNumber - 1 || seat.seatNumber === companionSeat.seatNumber + 1)
      );
      if (!wheelchairSeat) {
        throw new Error('No contiguous wheelchair seat found for the companion seat');
      }
      await this.selectSeat(companionSeat);
      await this.selectWheelchairSeat(wheelchairSeat);
    });
  }

  /**
   * Selects a sofa seat within a specific section and returns the selected Seat object.
   */
  async selectSofaSeat(): Promise<Seat> {
    return await allure.test.step('Selecting a sofa seat within a specific section', async () => {
      const sofaSeatsMatrix = await this.getAllSofaSeats();
      for (const row of sofaSeatsMatrix) {
        for (const seat of row) {
          if (seat.seatState === 'available') {
            await this.selectSeat(seat);
            return seat;
          }
        }
      }
      throw new Error('No available sofa seat found in the specified section');
    });
  }

  /**
   * Finds three contiguous available seats in a row and selects the middle one.
   * Throws an error if no such seats are found.
   */
  async selectMiddleOfThreeContiguousSeats(): Promise<void> {
    await allure.test.step('Selecting the middle seat of three contiguous available seats', async () => {
      const availableSeatsMatrix = await this.getAvailableSeatsMatrix();
      for (const row of availableSeatsMatrix) {
        for (let i = 0; i < row.length - 2; i++) {
          const firstSeat = row[i];
          const secondSeat = row[i + 1];
          const thirdSeat = row[i + 2];

          if (
            firstSeat.seatState === 'available' &&
            secondSeat.seatState === 'available' &&
            thirdSeat.seatState === 'available'
          ) {
            await this.selectSeat(secondSeat);
            return;
          }
        }
      }

      throw new Error('No three contiguous available seats found in any row');
    });
  }

  /**
   * Handles the wheelchair modal by clicking the "Continue" button.
   */
  async acceptWheelchairMessage(): Promise<void> {
    return await allure.test.step('Handling the wheelchair modal', async () => {
      const modal = this.page.locator(SEAT_PICKER_SELECTORS.wheelchairModal);
      const continueButton = this.page.locator(SEAT_PICKER_SELECTORS.wheelchairModalAcceptButton);
      await modal.waitFor({ state: 'visible', timeout: 10000 });
      await continueButton.waitFor({ state: 'visible', timeout: 5000 });
      await continueButton.click();
      await modal.waitFor({ state: 'hidden', timeout: 5000 });
    });
  }

  /**
   * Accepts the D-BOX warning modal by clicking the continue/accept button.
   */
  async acceptDBoxMessage(): Promise<void> {
    await allure.test.step('Accepting the D-BOX warning modal', async () => {
      const modalSelector = SEAT_PICKER_SELECTORS.dboxModal;
      const modal = this.page.locator(modalSelector);
      await modal.waitFor({ state: 'visible', timeout: 5000 });

      const acceptButton = modal.locator('button').first();
      await acceptButton.click();
    });
  }

  /**
   * Handles the showtime attribute modal by dismissing it if it appears.
   */
  async handleShowtimeAttributeModal(): Promise<void> {
    await allure.test.step('Handling showtime attribute modal if present', async () => {
      try {
        const modal = this.page.locator(SEAT_PICKER_SELECTORS.showtimeAttributeModal);
        
        // Check if modal is visible with a short timeout
        await modal.waitFor({ state: 'visible', timeout: 1000 });
        
        // Try to find and click the accept button first (most common case)
        const acceptButton = this.page.locator(SEAT_PICKER_SELECTORS.showtimeAttributeModalAcceptButton).first();
        
        if (await acceptButton.isVisible()) {
          await acceptButton.click();
          console.log('Clicked accept button on showtime attribute modal');
        } else {
          // Try close button as fallback
          const closeButton = this.page.locator(SEAT_PICKER_SELECTORS.showtimeAttributeModalCloseButton);
          if (await closeButton.isVisible()) {
            await closeButton.click();
            console.log('Clicked close button on showtime attribute modal');
          }
        }
        
        // Wait for modal to disappear
        await modal.waitFor({ state: 'hidden', timeout: 5000 });
        
      } catch (error) {
        // Modal not present or already closed, continue
        console.log('Showtime attribute modal not present or already handled');
      }
    });
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

  /**
   * Validates that the red warning message is displayed.
   */
  async validateWarningMessage(): Promise<void> {
    await allure.test.step('Validating red warning message is displayed', async () => {
      const warningMessage = this.page.locator(SEAT_PICKER_SELECTORS.warningMessage);
      if (!(await warningMessage.isVisible())) {
        throw new Error('Red warning message is not displayed');
      }
    });
  }

  /**
   * Validates that the "Continuar" button is disabled.
   */
  async validateConfirmButtonDisabled(): Promise<void> {
    await allure.test.step('Validating "Continuar" button is disabled', async () => {
      const confirmButton = this.page.locator(SEAT_PICKER_SELECTORS.disabledConfirmButton);
      if (!(await confirmButton.isVisible())) {
        throw new Error('"Continuar" button is not disabled');
      }
    });
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
   * Determines the seat state from class names, aria-label, or the aria-pressed attribute.
   */
  private async getSeatState(seatLocator: Locator, className: string, pressed: string | null): Promise<SeatState> {
    const ariaLabel = (await seatLocator.getAttribute('aria-label')) || '';
    const useLocator = seatLocator.locator('use');

    // Check aria-label for "Unavailable"
    if (ariaLabel.toLowerCase().includes('unavailable')) {
      return 'unavailable';
    }

    // Check for specific icons or href attributes in <use> elements
    if (await useLocator.count() > 0) {
      const href = await useLocator.first().getAttribute('href');
      if (href?.includes('selected')) return 'selected';
      if (href?.includes('available')) return 'available';
      if (href?.includes('unavailable') || href?.includes('house')) return 'unavailable';
    }

    // Check for specific class names indicating state
    if (className.includes('--unavailable') || className.includes('--house')) return 'unavailable';
    if (className.includes('--selected')) return 'selected';
    if (className.includes('--available')) return 'available';

    // Check aria-pressed attribute as a fallback
    if (pressed === 'true') return 'selected';
    if (pressed === 'false') return 'available';

    // Default to unknown if no conditions match
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

  /**
   * Selecciona aleatoriamente una silla de ruedas disponible.
   * Lanza un error si no hay ninguna disponible.
   */
  async selectRandomAvailableWheelchairSeat(): Promise<void> {
    const availableSeats = await this.getAvailableSeats();
    const wheelchairSeats = availableSeats.filter(seat => seat.seatType === 'wheelchair');
    if (wheelchairSeats.length === 0) {
      throw new Error('No available wheelchair seats found');
    }
    const randomIndex = Math.floor(Math.random() * wheelchairSeats.length);
    const randomWheelchairSeat = wheelchairSeats[randomIndex];
    await this.selectWheelchairSeat(randomWheelchairSeat);
  }

  /**
   * Selecciona sofás dejando un espacio vacío entre ellos (en la misma fila de sofás).
   * Selecciona el primer y tercer sofá disponibles en una fila de sofás con al menos tres disponibles.
   */
  async selectSofaSeatsWithEmptySpaceBetween(): Promise<void> {
    const sofaMatrix = await this.getAllSofaSeats();
    for (const row of sofaMatrix) {
      const availableSofas = row.filter(seat => seat.seatState === 'available');
      if (availableSofas.length >= 3) {
        await this.selectSeat(availableSofas[0]);
        await this.selectSeat(availableSofas[2]);
        return;
      }
    }
    throw new Error('No sofa row with at least three available sofas found');
  }

  /**
   * Selecciona sofás separando un grupo en la misma fila (por ejemplo, selecciona el primero y el último de una fila de sofás con al menos tres disponibles).
   */
  async selectSofaSeatsSeparatingGroupInSameRow(): Promise<void> {
    const sofaMatrix = await this.getAllSofaSeats();
    for (const row of sofaMatrix) {
      const availableSofas = row.filter(seat => seat.seatState === 'available');
      if (availableSofas.length >= 3) {
        await this.selectSeat(availableSofas[0]);
        await this.selectSeat(availableSofas[availableSofas.length - 1]);
        return;
      }
    }
    throw new Error('No sofa row with at least three available sofas found');
  }

  /**
   * Selecciona sofás separando el grupo en diferentes filas (por ejemplo, uno en una fila y otro en otra).
   */
  async selectSofaSeatsSeparatingGroupInDifferentRows(): Promise<void> {
    const sofaMatrix = await this.getAllSofaSeats();
    const selected: Seat[] = [];
    for (const row of sofaMatrix) {
      const availableSofas = row.filter(seat => seat.seatState === 'available');
      if (availableSofas.length > 0 && selected.length < 2) {
        selected.push(availableSofas[0]);
      }
      if (selected.length === 2) break;
    }
    for (const row of sofaMatrix) {
      const availableSofas = row.filter(seat => seat.seatState === 'available');
      if (availableSofas.length > 0 && !selected.includes(availableSofas[0])) {
        selected.push(availableSofas[0]);
        break;
      }
    }
    if (selected.length < 3) {
      throw new Error('Not enough available sofas in different rows');
    }
    for (const seat of selected) {
      await this.selectSeat(seat);
    }
  }

  /**
   * Selecciona un asiento regular y un asiento sofa, y devuelve un array de los tipos de asiento únicos en texto plano (por ejemplo, ['regular', 'dbox']).
   */
  async getRegularAndSofaSeatTypes(): Promise<string[]> {
    await this.selectLastAvailableSeat();
    await this.selectLastAvailableSofaSeat();
    const allSeats = await this.getAllSeats();
    const selectedSeats = allSeats.filter(s => s.seatState === 'selected');
    const seatTypes: string[] = [];
    for (const seat of selectedSeats) {
      const aria = seat.ariaLabel.toLowerCase();
      const className = (await seat.locator.getAttribute('class'))?.toLowerCase() || '';
      let isDBox = aria.includes('d-box') || aria.includes('dbox') || className.includes('d-box') || className.includes('dbox');
      if (!isDBox) {
        const useLocator = seat.locator.locator('use');
        if (await useLocator.count() > 0) {
          const href = (await useLocator.first().getAttribute('href'))?.toLowerCase() || '';
          if (href.includes('d-box') || href.includes('dbox')) {
            isDBox = true;
          }
        }
      }
      if (isDBox) {
        seatTypes.push('dbox');
      } else {
        seatTypes.push('regular');
      }
    }
    return Array.from(new Set(seatTypes));
  }
}
