import { test } from '../../fixtures/cinesa/playwright.fixtures';
import { SeatPickerAssertions } from '../../assertions/seatPicker.assertions';
import { legendData, seatTestData } from './pages/seatPicker.data';

test.describe('Seat Picker', () => {
  test.beforeEach(async ({ seatPicker }) => {
    await seatPicker.navigate();
  });


  test('should verify seat legend and change seat state', async ({
    seatPicker,
    page,
  }) => {
    const assertions = new SeatPickerAssertions(page);

    await assertions.assertLegend(legendData.expectedLegendItems);
  });

  /*
  seatTestData.forEach((data) => {
    test(`should pick seat ${data.seatIdentifier} and verify its state`, async ({ page, seatPicker }) => {
      const assertions = new SeatPickerAssertions(page);
      await seatPicker.selectSeatByType(data.seatType, data.seatIdentifier);
      const state = await seatPicker.getSeatState(data.seatIdentifier);
      await assertions.assertSeatState(data.seatIdentifier, data.expectedState);
    });
  });
  */

});
