import { Locator, Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import {
  SEAT_PICKER_SELECTORS,
  SEAT_CATEGORY_PRIORITY,
} from './seatPicker.selectors';

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
  private readonly webActions: WebActions;
  public readonly page: Page; // Public for test access, following TicketPicker pattern

  constructor(webActions: WebActions) {
    this.webActions = webActions;
    this.page = webActions.page; // Direct page access for stability
  }

  /**
   * Waits for the seat picker container to be visible.
   */
  async waitForSeatPicker(): Promise<void> {
    await allure.step('Waiting for seat picker container', async () => {
      await this.page.waitForSelector(SEAT_PICKER_SELECTORS.container, {
        state: 'visible',
        timeout: 10000,
      });
    });
  }

  /**
   * Checks if tickets are sold out or no seats available
   * Returns true if sold out, false if seats are available
   */
  private async checkIfSoldOut(): Promise<boolean> {
    // Only check if we're in LAB environment - production shouldn't have this issue
    const currentUrl = this.page.url();
    if (!currentUrl.includes('lab-web.ocgtest.es')) {
      return false; // Never skip in production
    }

    // Check if seat map exists and has seats - if seats are visible, NOT sold out
    try {
      const seatLocators = this.page.locator(SEAT_PICKER_SELECTORS.seatGeneric);
      const seatCount = await seatLocators.count();
      if (seatCount > 0) {
        // If we can see seats, definitely not sold out
        return false;
      }
    } catch (error) {
      // Continue to check for sold out messages
    }

    // Only check for VERY specific sold out indicators
    const specificSoldOutSelectors = [
      '.sold-out-message',
      '.no-seats-available',
      '.session-sold-out',
      '.entradas-agotadas',
      '.tickets-sold-out',
    ];

    for (const selector of specificSoldOutSelectors) {
      try {
        const element = this.page.locator(selector);
        const isVisible = await element.isVisible({ timeout: 500 });
        if (isVisible) {
          return true;
        }
      } catch (error) {
        // Continue checking
      }
    }

    // Check for sold out messages ONLY in main content areas, not entire page
    const contentSelectors = [
      '.main-content',
      '.seat-picker-content',
      '.booking-content',
      'main',
    ];

    for (const contentSelector of contentSelectors) {
      try {
        const contentArea = this.page.locator(contentSelector);
        const exists = await contentArea.isVisible({ timeout: 500 });

        if (exists) {
          const soldOutInContent = contentArea
            .locator('text=/sold out|agotad|no disponible/i')
            .first();
          const isSoldOutVisible = await soldOutInContent.isVisible({
            timeout: 500,
          });
          if (isSoldOutVisible) {
            return true;
          }
        }
      } catch (error) {
        // Continue checking other content areas
      }
    }

    return false;
  }

  /**
   * Closes any blocking modals that might prevent seat interaction
   */
  private async closeBlockingModals(): Promise<void> {
    const modalSelectors = [
      // D-Box modal
      {
        modal: SEAT_PICKER_SELECTORS.dboxModal,
        accept: SEAT_PICKER_SELECTORS.modalAcceptButton,
        name: 'D-Box',
      },
      // Showtime attribute modal
      {
        modal: SEAT_PICKER_SELECTORS.showtimeAttributeModal,
        accept: SEAT_PICKER_SELECTORS.showtimeAttributeModalAcceptButton,
        name: 'Showtime',
      },
      // Generic modal fallback
      {
        modal: SEAT_PICKER_SELECTORS.modalGeneric,
        accept: SEAT_PICKER_SELECTORS.modalAcceptButton,
        name: 'Generic',
      },
    ];

    // Loop up to 3 times to handle stacked/sequential modals
    for (let attempt = 0; attempt < 3; attempt++) {
      let handledModal = false;

      for (const modalConfig of modalSelectors) {
        try {
          const modal = this.page.locator(modalConfig.modal);
          const isVisible = await modal.isVisible({ timeout: 2000 });

          if (isVisible) {
            // Try to click accept button first
            const acceptButton = this.page.locator(modalConfig.accept).first();
            const acceptExists = await acceptButton.isVisible({
              timeout: 1000,
            });

            if (acceptExists) {
              await acceptButton.click();
            } else {
              // Try to close the modal
              const closeButton = this.page.locator(
                SEAT_PICKER_SELECTORS.modalCloseButton
              );
              const closeExists = await closeButton.isVisible({
                timeout: 1000,
              });

              if (closeExists) {
                await closeButton.click();
              }
            }

            // Wait for modal to disappear
            await modal.waitFor({ state: 'hidden', timeout: 3000 });
            handledModal = true;
            break; // Restart outer loop to check for next modal
          }
        } catch (error) {
          // Continue to next modal type
        }
      }

      if (!handledModal) {
        break; // No more modals found
      }
    }
  }

  /**
   * Waits for the seats to load and ensures they are visible and interactable.
   */
  private async waitForSeatsToBeReady(): Promise<void> {
    await allure.step('Waiting for seats to be ready', async () => {
      // First, close any blocking modals
      await this.closeBlockingModals();

      const seatLocators = this.webActions.getLocator(
        SEAT_PICKER_SELECTORS.seatGeneric
      );

      // Try to wait for seats normally first
      try {
        await seatLocators
          .first()
          .waitFor({ state: 'visible', timeout: 20000 });

        // Ensure all seats have loaded by checking their count
        const count = await seatLocators.count();
        if (count === 0) {
          throw new Error('No seats found after waiting for them to load');
        }

        // If we reach here, seats loaded successfully
        return;
      } catch (seatLoadError) {
        // Only if seat loading fails, then check if it's because of sold-out
        const currentUrl = this.page.url();
        if (currentUrl.includes('lab-web.ocgtest.es')) {
          const isSoldOut = await this.checkIfSoldOut();
          if (isSoldOut) {
            throw new Error('SOLD_OUT_SKIP_TEST');
          }
        }

        // If not sold out, re-throw the original error
        throw seatLoadError;
      }

      // Wait for all seats to have their aria-pressed attribute set
      await this.page.waitForFunction((selector) => {
        const seats = Array.from(document.querySelectorAll(selector));
        return seats.every(
          (seat) => seat.getAttribute('aria-pressed') !== null
        );
      }, SEAT_PICKER_SELECTORS.seatGeneric);
    });
  }

  /**
   * Retrieves all seats from the DOM by parsing their aria-label.
   */
  async getAllSeats(): Promise<Seat[]> {
    return await allure.step('Retrieving all seats from the DOM', async () => {
      await this.waitForSeatPicker();

      const seatLocators = await this.webActions.getAllElements(
        SEAT_PICKER_SELECTORS.seatGeneric
      );
      const seats: Seat[] = [];

      for (let i = 0; i < seatLocators.length; i++) {
        const seatLocator = seatLocators[i];
        const ariaLabel = (await seatLocator.getAttribute('aria-label')) || '';
        const className = (await seatLocator.getAttribute('class')) || '';
        const pressed = await seatLocator.getAttribute('aria-pressed');

        const { row, seatNumber } = this.parseRowAndSeat(ariaLabel);

        const seatType = this.getSeatType(className, ariaLabel);
        const seatState = await this.getSeatState(
          seatLocator,
          className,
          pressed
        );

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
    });
  }

  /**
   * Detects all seat area category IDs present in the current seat map.
   * Extracts the category suffix from CSS classes like 'v-seat-picker-area--category-138-0000000005'.
   * Returns them sorted by priority (SEAT_CATEGORY_PRIORITY).
   */
  private async detectSeatCategories(): Promise<string[]> {
    const areas = this.page.locator(SEAT_PICKER_SELECTORS.seatArea);
    const areaCount = await areas.count();
    const categoryIds: string[] = [];

    for (let i = 0; i < areaCount; i++) {
      const classes = (await areas.nth(i).getAttribute('class')) || '';
      const match = classes.match(/v-seat-picker-area--category-([\w-]+)/);
      if (match) {
        categoryIds.push(match[1]);
      }
    }

    // Sort by priority (lower number = more premium)
    return categoryIds.sort((a, b) => {
      const prioA = SEAT_CATEGORY_PRIORITY[a] ?? 999;
      const prioB = SEAT_CATEGORY_PRIORITY[b] ?? 999;
      return prioA - prioB;
    });
  }

  /**
   * Retrieves all premium/sofa seats from the highest-priority seat area as a matrix.
   * Dynamically detects seat categories from the DOM and selects the most premium one.
   * Each sublist represents a row, and each element in the sublist is a seat.
   */
  async getAllSofaSeats(): Promise<Seat[][]> {
    return await allure.step(
      'Retrieving premium seats dynamically from seat picker',
      async () => {
        await this.waitForSeatsToBeReady();

        const categories = await this.detectSeatCategories();
        if (categories.length === 0) {
          throw new Error('No seat area categories found in the seat map');
        }

        // Pick the highest-priority category (first after sorting)
        const selectedCategory = categories[0];
        const sectionSelector = `.v-seat-picker-area--category-${selectedCategory}`;
        const sectionLocator = this.page.locator(sectionSelector);

        const seatLocators = sectionLocator.locator(
          SEAT_PICKER_SELECTORS.seatGeneric
        );

        const count = await seatLocators.count();
        if (count === 0) {
          throw new Error(
            `No seats found in premium section (category: ${selectedCategory})`
          );
        }

        const sofaSeats: Seat[] = [];

        for (let i = 0; i < count; i++) {
          const seatLocator = seatLocators.nth(i);
          await seatLocator.waitFor({ state: 'visible', timeout: 5000 });

          const ariaLabel =
            (await seatLocator.getAttribute('aria-label')) || '';
          const className = (await seatLocator.getAttribute('class')) || '';

          const { row, seatNumber } = this.parseRowAndSeat(ariaLabel);
          const seatType = this.getSeatType(className, ariaLabel);
          const seatState = await this.getSeatState(
            seatLocator,
            className,
            null
          );

          sofaSeats.push({
            row,
            seatNumber,
            seatType,
            seatState,
            ariaLabel,
            locator: seatLocator,
          });
        }

        // Group seats into a matrix by row
        const seatsMatrix: Seat[][] = [];
        let currentRow: number | null = null;
        let currentRowSeats: Seat[] = [];

        for (const seat of sofaSeats.sort(
          (a, b) => a.row - b.row || a.seatNumber - b.seatNumber
        )) {
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
   * Filters the seats to only those available.
   */
  async getAvailableSeats(): Promise<Seat[]> {
    await this.waitForSeatsToBeReady();
    const allSeats = await this.getAllSeats();
    return allSeats.filter(
      (s) =>
        s.seatState === 'available' &&
        s.seatType !== 'wheelchair' &&
        s.seatType !== 'companion'
    );
  }

  /**
   * Retrieves available seats organized as a matrix (list of lists).
   * Each sublist represents a row, and each element in the sublist is a seat.
   */
  async getAvailableSeatsMatrix(): Promise<Seat[][]> {
    return await allure.step(
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
    await allure.step(
      `Selecting seat [Row ${seat.row}, Seat ${seat.seatNumber}]`,
      async () => {
        // First attempt to click the seat
        try {
          await seat.locator.click({ timeout: 3000 });
        } catch (error) {
          // If click fails (likely due to modal), handle modal and try again
          try {
            await this.handleShowtimeAttributeModal();
            await seat.locator.click();
          } catch (pageClosedError) {
            throw new Error(
              `Unable to select seat [Row ${seat.row}, Seat ${seat.seatNumber}]: Page may have been closed or navigated away`
            );
          }
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
    await allure.step(`Selecting ${seats.length} seats`, async () => {
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
    return await allure.step('Selecting a random available seat', async () => {
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/seat-availability') &&
          response.status() === 200
      );

      const availableSeats = await this.getAvailableSeats();
      if (availableSeats.length === 0) {
        throw new Error('No available seats found');
      }
      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const chosenSeat = availableSeats[randomIndex];
      await this.selectSeat(chosenSeat);
      return chosenSeat;
    });
  }

  /**
   * Selects the last available seat (first available seat from the back).
   * Returns the chosen seat.
   */
  async selectLastAvailableSeat(): Promise<Seat> {
    return await allure.step(
      'Selecting last available seat from back',
      async () => {
        await this.webActions
          .getPage()
          .waitForResponse(
            (response) =>
              response.url().includes('/seat-availability') &&
              response.status() === 200
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
      }
    );
  }

  /**
   * Selecciona el último sofá disponible (de atrás hacia adelante) y devuelve el objeto Seat completo.
   */
  async selectLastAvailableSofaSeat(): Promise<Seat> {
    return await allure.step(
      'Selecting last available sofa seat from back',
      async () => {
        await this.waitForSeatsToBeReady();
        const sofaMatrix = await this.getAllSofaSeats();
        const allSofas = sofaMatrix.flat();
        const availableSofas = allSofas.filter(
          (seat) => seat.seatState === 'available'
        );
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
      }
    );
  }

  /**
   * Selects the specified number of available seats from the back to the front.
   * Skips unavailable seats. Maximum number of seats is capped at maxSeatSelection.
   * @param seatCount Number of seats to select.
   * Returns the list of chosen seats.
   */
  async selectLastAvailableSeats(seatCount: number): Promise<Seat[]> {
    return await allure.step(
      `Selecting ${seatCount} seats from back to front`,
      async () => {
        if (seatCount > maxSeatSelection) {
          throw new Error(`Cannot select more than ${maxSeatSelection} seats`);
        }

        await this.page.waitForResponse(
          (response) =>
            response.url().includes('/seat-availability') &&
            response.status() === 200
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
    return await allure.step(`Selecting ${count} random seats`, async () => {
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
    });
  }

  /**
   * Selects seats with an empty space between them.
   * Ensures there are three contiguous available seats in the same row.
   * Selects the first and third seats, leaving the second seat empty.
   * Returns the list of chosen seats.
   */
  async selectSeatsWithEmptySpaceBetween(): Promise<Seat[]> {
    return await allure.step(
      'Selecting seats with an empty space between them',
      async () => {
        await this.page.waitForResponse(
          (response) =>
            response.url().includes('/seat-availability') &&
            response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const availableSeats = await this.getAvailableSeats();

        const seatsByRow = availableSeats.reduce(
          (acc, seat) => {
            acc[seat.row] = acc[seat.row] || [];
            acc[seat.row].push(seat);
            return acc;
          },
          {} as Record<number, Seat[]>
        );

        for (const row in seatsByRow) {
          const rowSeats = seatsByRow[row].sort(
            (a, b) => a.seatNumber - b.seatNumber
          );

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

        throw new Error(
          'No suitable seats found with an empty space between them'
        );
      }
    );
  }

  /**
   * Selects seats by separating a group in the same row.
   * Starts searching from the back rows and the first available seat in each row.
   * Returns the list of chosen seats.
   */
  async selectSeatsSeparatingGroupInSameRow(): Promise<Seat[]> {
    return await allure.step(
      'Selecting seats separating group in the same row',
      async () => {
        await this.page.waitForResponse(
          (response) =>
            response.url().includes('/seat-availability') &&
            response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const availableSeats = await this.getAvailableSeats();

        const seatsByRow = availableSeats.reduce(
          (acc, seat) => {
            acc[seat.row] = acc[seat.row] || [];
            acc[seat.row].push(seat);
            return acc;
          },
          {} as Record<number, Seat[]>
        );

        const sortedRows = Object.keys(seatsByRow)
          .map(Number)
          .sort((a, b) => b - a);

        for (const row of sortedRows) {
          const rowSeats = seatsByRow[row].sort(
            (a, b) => a.seatNumber - b.seatNumber
          );

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
    return await allure.step(
      'Selecting seats separating group in different rows',
      async () => {
        await this.page.waitForResponse(
          (response) =>
            response.url().includes('/seat-availability') &&
            response.status() === 200
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
            if (
              firstSeat.seatState === 'available' &&
              secondSeat.seatState === 'available'
            ) {
              selectedSeats.push(firstSeat, secondSeat);
              rowIndex--;
              break;
            }
          }
          if (selectedSeats.length === 2) {
            for (; rowIndex >= 0; rowIndex--) {
              const nextRow = seatsMatrix[rowIndex];
              if (nextRow.length > 0) {
                const sortedNextRow = nextRow.sort(
                  (a, b) => a.seatNumber - b.seatNumber
                );
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
   * Selects more than the maximum allowed seats by dynamically detecting the max.
   * Selects seats one by one until FIFO deselection is detected (first seat loses
   * aria-pressed="true"), then selects extra seats to confirm FIFO behavior.
   * Returns the list of all attempted seats with their final states.
   */
  async selectMoreThanMaxSeats(): Promise<Seat[]> {
    return await allure.step(
      `Selecting seats to exceed max capacity`,
      async () => {
        const extraSeatsToTest = 3;

        await this.waitForSeatsToBeReady();
        const seatsMatrix = await this.getAvailableSeatsMatrix();
        const selectedSeats: Seat[] = [];

        // Flatten available seats (from last row, sorted by seat number)
        const allAvailable: Seat[] = [];
        for (
          let rowIndex = seatsMatrix.length - 1;
          rowIndex >= 0;
          rowIndex--
        ) {
          const sortedRow = seatsMatrix[rowIndex].sort(
            (a, b) => a.seatNumber - b.seatNumber
          );
          allAvailable.push(...sortedRow);
        }

        // Phase 1: Select seats until FIFO deselection is detected.
        // The SPA auto-deselects the first seat when the max+1 seat is clicked.
        // We detect this by checking aria-pressed on the first selected seat.
        let detectedMax = 0;

        for (const seat of allAvailable) {
          await this.selectSeat(seat);
          selectedSeats.push(seat);

          // After selecting at least 2 seats, check if the first seat was deselected
          if (selectedSeats.length >= 2) {
            const firstSeatPressed =
              await selectedSeats[0].locator.getAttribute('aria-pressed');
            if (firstSeatPressed !== 'true') {
              detectedMax = selectedSeats.length - 1;
              break;
            }
          }

          // Safety: don't select more than 25 seats
          if (selectedSeats.length >= 25) {
            throw new Error(
              'Selected 25 seats without detecting FIFO deselection. ' +
                'The room max seat limit may be higher than expected.'
            );
          }
        }

        if (detectedMax === 0) {
          throw new Error(
            'Could not detect max seat limit — FIFO deselection never triggered'
          );
        }

        // Phase 2: Select extra seats past the max to confirm FIFO continues.
        // We already have 1 extra (the one that triggered FIFO), need extraSeatsToTest - 1 more.
        const extraNeeded = extraSeatsToTest - 1;
        const startIdx = selectedSeats.length;
        let extraSelected = 0;

        for (
          let i = startIdx;
          i < allAvailable.length && extraSelected < extraNeeded;
          i++
        ) {
          await this.selectSeat(allAvailable[i]);
          selectedSeats.push(allAvailable[i]);
          extraSelected++;
        }

        // Allow DOM transitions to complete
        await this.webActions.wait(500);

        // Read final states of all attempted seats
        for (const seat of selectedSeats) {
          seat.seatState = await this.getSeatState(
            seat.locator,
            (await seat.locator.getAttribute('class')) || '',
            await seat.locator.getAttribute('aria-pressed')
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
    return await allure.step('Selecting a companion seat', async () => {
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/seat-availability') &&
          response.status() === 200
      );
      await this.waitForSeatsToBeReady();
      const allSeats = await this.getAllSeats();
      const companionSeat = allSeats.find(
        (seat) =>
          seat.seatType === 'companion' && seat.seatState === 'available'
      );
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
    await allure.step(
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
    return await allure.step(
      'Selecting a companion seat and a contiguous wheelchair seat',
      async () => {
        await this.page.waitForResponse(
          (response) =>
            response.url().includes('/seat-availability') &&
            response.status() === 200
        );
        await this.waitForSeatsToBeReady();
        const allSeats = await this.getAllSeats();
        const companionSeat = allSeats.find(
          (seat) =>
            seat.seatType === 'companion' && seat.seatState === 'available'
        );
        if (!companionSeat) {
          throw new Error('No available companion seat found');
        }
        const wheelchairSeat = allSeats.find(
          (seat) =>
            seat.seatType === 'wheelchair' &&
            seat.seatState === 'available' &&
            seat.row === companionSeat.row &&
            (seat.seatNumber === companionSeat.seatNumber - 1 ||
              seat.seatNumber === companionSeat.seatNumber + 1)
        );
        if (!wheelchairSeat) {
          throw new Error(
            'No contiguous wheelchair seat found for the companion seat'
          );
        }
        await this.selectSeat(companionSeat);
        await this.selectWheelchairSeat(wheelchairSeat);
      }
    );
  }

  /**
   * Selects a sofa seat within a specific section and returns the selected Seat object.
   */
  async selectSofaSeat(): Promise<Seat> {
    return await allure.step(
      'Selecting a sofa seat within a specific section',
      async () => {
        const sofaSeatsMatrix = await this.getAllSofaSeats();
        for (const row of sofaSeatsMatrix) {
          for (const seat of row) {
            if (seat.seatState === 'available') {
              await this.selectSeat(seat);
              return seat;
            }
          }
        }
        throw new Error(
          'No available sofa seat found in the specified section'
        );
      }
    );
  }

  /**
   * Finds three contiguous available seats in a row and selects the middle one.
   * Throws an error if no such seats are found.
   */
  async selectMiddleOfThreeContiguousSeats(): Promise<void> {
    await allure.step(
      'Selecting two premium seats leaving a 1-seat gap between them',
      async () => {
        const sofaMatrix = await this.getAllSofaSeats();
        for (const row of sofaMatrix) {
          const available = row.filter((s) => s.seatState === 'available');
          for (let i = 0; i < available.length - 2; i++) {
            // Ensure seats are truly contiguous by seat number
            if (
              available[i + 1].seatNumber === available[i].seatNumber + 1 &&
              available[i + 2].seatNumber === available[i + 1].seatNumber + 1
            ) {
              // Select first and third → orphan at middle → triggers warning
              await this.selectSeat(available[i]);
              await this.selectSeat(available[i + 2]);
              return;
            }
          }
        }

        throw new Error(
          'No three contiguous available premium seats found in any row'
        );
      }
    );
  }

  /**
   * Handles the wheelchair modal by clicking the "Continue" button.
   */
  async acceptWheelchairMessage(): Promise<void> {
    return await allure.step('Handling the wheelchair modal', async () => {
      const modal = this.page.locator(SEAT_PICKER_SELECTORS.wheelchairModal);
      const continueButton = this.page.locator(
        SEAT_PICKER_SELECTORS.wheelchairModalAcceptButton
      );
      await modal.waitFor({ state: 'visible', timeout: 10000 });
      await continueButton.waitFor({ state: 'visible', timeout: 5000 });
      await continueButton.click();
      await modal.waitFor({ state: 'hidden', timeout: 5000 });
    });
  }

  /**
   * Accepts the D-BOX warning modal by clicking the continue/accept button.
   * If the modal doesn't appear within timeout, continues without error.
   */
  async acceptDBoxMessage(): Promise<void> {
    await allure.step(
      'Accepting the D-BOX warning modal if present',
      async () => {
        try {
          const modalSelector = SEAT_PICKER_SELECTORS.dboxModal;
          const modal = this.page.locator(modalSelector);
          await modal.waitFor({ state: 'visible', timeout: 5000 });

          const acceptButton = modal.locator('button').first();
          await acceptButton.click();
          console.log('✅ D-BOX modal accepted');
        } catch (error) {
          console.log('ℹ️ D-BOX modal not present, continuing...');
          // Modal not present - this is acceptable, continue
        }
      }
    );
  }

  /**
   * Handles the showtime attribute modal by dismissing it if it appears.
   */
  async handleShowtimeAttributeModal(): Promise<void> {
    await allure.step(
      'Handling showtime attribute modal if present',
      async () => {
        try {
          const modal = this.page.locator(
            SEAT_PICKER_SELECTORS.showtimeAttributeModal
          );

          // Check if modal is visible with a short timeout
          await modal.waitFor({ state: 'visible', timeout: 1000 });

          // Try to find and click the accept button first (most common case)
          const acceptButton = this.page
            .locator(SEAT_PICKER_SELECTORS.showtimeAttributeModalAcceptButton)
            .first();

          if (await acceptButton.isVisible()) {
            await acceptButton.click();
          } else {
            // Try close button as fallback
            const closeButton = this.page.locator(
              SEAT_PICKER_SELECTORS.showtimeAttributeModalCloseButton
            );
            if (await closeButton.isVisible()) {
              await closeButton.click();
            }
          }

          // Wait for modal to disappear
          await modal.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
          // Modal not present or already closed, continue
        }
      }
    );
  }

  /**
   * Confirms the selected seats by clicking the confirm/continue button.
   */
  async confirmSeats(): Promise<void> {
    await allure.step('Confirming selected seats', async () => {
      await this.page.locator(SEAT_PICKER_SELECTORS.confirmSeatsButton).click();
    });
  }

  /**
   * Deselects a seat by clicking on it if it's selected.
   */
  async deselectSeat(seat: Seat): Promise<void> {
    await allure.step(
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
    await allure.step(
      'Validating red warning message is displayed',
      async () => {
        const warningMessage = this.page.locator(
          SEAT_PICKER_SELECTORS.warningMessage
        );
        if (!(await warningMessage.isVisible())) {
          throw new Error('Red warning message is not displayed');
        }
      }
    );
  }

  /**
   * Validates that the "Continuar" button is disabled.
   */
  async validateConfirmButtonDisabled(): Promise<void> {
    await allure.step('Validating "Continuar" button is disabled', async () => {
      const confirmButton = this.page.locator(
        SEAT_PICKER_SELECTORS.disabledConfirmButton
      );
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
    const label = ariaLabel.toLowerCase();

    if (className.includes('wheelchair') || label.includes('wheelchair')) {
      return 'wheelchair';
    }
    if (className.includes('companion') || label.includes('companion')) {
      return 'companion';
    }
    if (className.includes('vip') || label.includes('vip')) {
      return 'vip';
    }
    if (className.includes('recliner') || label.includes('recliner')) {
      return 'recliner';
    }

    return 'normal';
  }

  /**
   * Determines the seat state from class names, aria-label, or the aria-pressed attribute.
   */
  private async getSeatState(
    seatLocator: Locator,
    className: string,
    pressed: string | null
  ): Promise<SeatState> {
    const ariaLabel = (await seatLocator.getAttribute('aria-label')) || '';
    const useLocator = seatLocator.locator('use');

    // Check aria-label for "Unavailable"
    if (ariaLabel.toLowerCase().includes('unavailable')) {
      return 'unavailable';
    }

    // Check for specific icons or href attributes in <use> elements
    try {
      const useCount = await useLocator.count();
      if (useCount > 0) {
        const href = await useLocator.first().getAttribute('href');
        if (href?.includes('selected')) return 'selected';
        if (href?.includes('available')) return 'available';
        if (href?.includes('unavailable') || href?.includes('house'))
          return 'unavailable';
      }
    } catch (error) {
      // Handle page closure gracefully - common in production environment
      console.log(
        'Page closed during seat state check, treating as unavailable'
      );
      return 'unavailable';
    }

    // Check for specific class names indicating state
    if (className.includes('--unavailable') || className.includes('--house'))
      return 'unavailable';
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
   * Throws an error if no available wheelchair seat is found.
   */
  async selectRandomAvailableWheelchairSeat(): Promise<void> {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes('/seat-availability') &&
        response.status() === 200
    );
    await this.waitForSeatsToBeReady();
    const allSeats = await this.getAllSeats();
    const wheelchairSeats = allSeats.filter(
      (seat) => seat.seatType === 'wheelchair' && seat.seatState === 'available'
    );
    if (wheelchairSeats.length === 0) {
      const allWheelchair = allSeats.filter(
        (seat) => seat.seatType === 'wheelchair'
      );
      const debugInfo = allWheelchair.map(
        (s) => `[${s.ariaLabel} state=${s.seatState}]`
      );
      throw new Error(
        `No available wheelchair seats found. Total seats: ${allSeats.length}, ` +
          `wheelchair seats (any state): ${allWheelchair.length}${allWheelchair.length > 0 ? ` — ${debugInfo.join(', ')}` : ''}`
      );
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
      const availableSofas = row.filter(
        (seat) => seat.seatState === 'available'
      );
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
      const available = row.filter((seat) => seat.seatState === 'available');
      // Find 3 contiguous available seats and select first + third (1-seat orphan)
      // Start from the END of the row to differentiate from selectSofaSeatsWithEmptySpaceBetween
      for (let i = available.length - 3; i >= 0; i--) {
        if (
          available[i + 1].seatNumber === available[i].seatNumber + 1 &&
          available[i + 2].seatNumber === available[i + 1].seatNumber + 1
        ) {
          await this.selectSeat(available[i]);
          await this.selectSeat(available[i + 2]);
          return;
        }
      }
    }
    throw new Error('No sofa row with contiguous available seats to separate');
  }

  /**
   * Selecciona sofás separando el grupo en diferentes filas (por ejemplo, uno en una fila y otro en otra).
   */
  async selectSofaSeatsSeparatingGroupInDifferentRows(): Promise<void> {
    const sofaMatrix = await this.getAllSofaSeats();
    const selected: Seat[] = [];

    // Try to select one available seat from each distinct row
    for (const row of sofaMatrix) {
      const available = row.filter((seat) => seat.seatState === 'available');
      if (available.length > 0) {
        selected.push(available[0]);
      }
      if (selected.length >= 3) break;
    }

    if (selected.length >= 2) {
      // Multi-row: select seats from different rows
      for (const seat of selected) {
        await this.selectSeat(seat);
      }
      return;
    }

    // Single-row fallback: select 2 adjacent seats (no orphan created)
    for (const row of sofaMatrix) {
      const available = row.filter((seat) => seat.seatState === 'available');
      for (let i = 0; i < available.length - 1; i++) {
        if (available[i + 1].seatNumber === available[i].seatNumber + 1) {
          await this.selectSeat(available[i]);
          await this.selectSeat(available[i + 1]);
          return;
        }
      }
    }

    throw new Error('Not enough available premium seats to select');
  }

  /**
   * Selects a regular seat and a premium/sofa seat, returns unique seat type labels.
   * Detects type by checking which v-seat-picker-area the seat belongs to.
   */
  async getRegularAndSofaSeatTypes(): Promise<string[]> {
    await this.selectLastAvailableSeat();
    await this.selectLastAvailableSofaSeat();

    const categories = await this.detectSeatCategories();
    const premiumCategory = categories[0]; // Highest-priority = "premium" section

    const allSeats = await this.getAllSeats();
    const selectedSeats = allSeats.filter((s) => s.seatState === 'selected');
    const seatTypes: string[] = [];

    for (const seat of selectedSeats) {
      // Check the seat's parent area category via DOM traversal
      const isPremium = await seat.locator.evaluate((el, cat) => {
        const area = el.closest('.v-seat-picker-area');
        return (
          area?.classList.contains(`v-seat-picker-area--category-${cat}`) ??
          false
        );
      }, premiumCategory);

      seatTypes.push(isPremium ? 'premium' : 'regular');
    }

    return Array.from(new Set(seatTypes));
  }
}
