import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { SeatPickerAssertions } from '../../../assertions/seatPicker.assertions';
import { legendData, seatTestData } from './seatPicker.data';

test.describe('Seat Picker', () => {
  test.beforeEach(async ({ seatPicker }) => {
    await seatPicker.navigate();
  });

  // test('should verify seat legend and change seat state', async ({
  //   seatPicker,
  //   page,
  // }) => {
  //   const assertions = new SeatPickerAssertions(page);

  //   await assertions.assertLegend(legendData.expectedLegendItems);
  // });

  test('Simulate a Full Purchase', async ({
    page,
    navbar,
    cinema,
    cinemaDetail,
    cookieBanner,
    seatPicker,
  }) => {
    await navbar.navigateToCinemas();
    //todo validar si sale la ventana de cookies. Revisar como lo resolvio mati.
    await cookieBanner.acceptCookies();
    await cinema.selectRandomCinema();
    
    const { film, showtime } = await cinemaDetail.selectRandomFilmAndShowtime();

    // Aquí puedes agregar aserciones o continuar con el flujo de compra, por ejemplo:
    console.log(`Selected film: ${film} at showtime: ${showtime}`);
    const currentUrl = await page.url();
    console.log("Current URL is:", currentUrl);
  });

  // test('simulate a purchase ', async ({ page, seatPicker }) => {
  //   await page.goto('https://www.cinesa.es/');
  //   await page.getByRole('link', { name: 'Cines', exact: true }).click();
  //   await page
  //     .getByRole('button', { name: 'Aceptar todas las cookies' })
  //     .click();
  //   await page.getByRole('link', { name: 'As Cancelas Cinesa en' }).click();
  //   await page.getByRole('link', { name: ':45 Sala 6' }).click();
  //   await page.getByRole('button', { name: 'Normal seat 6-16' }).click();
  //   await page.getByRole('button', { name: 'Continuar' }).click();
  //   await page.getByRole('button', { name: 'Continuar como invitado' }).click();
  //   await page
  //     .locator('section')
  //     .filter({ hasText: '-Normal10,40 €0,00 €' })
  //     .getByLabel('Increase quantity')
  //     .click();
  //   await page.getByRole('button', { name: 'Continuar' }).nth(1).click();
  //   await page.getByRole('button', { name: 'Continuar con la compra' }).click();
  //   await page.getByRole('button', { name: 'Continuar' }).click();
  //   await page
  //     .locator('label')
  //     .filter({ hasText: 'Acepto la Política de' })
  //     .locator('div')
  //     .first()
  //     .click();
  //   await page.getByRole('button', { name: 'Continuar' }).click();
  //   await page.getByRole('textbox', { name: 'Nombre' }).click();
  //   await page.getByRole('textbox', { name: 'Nombre' }).fill('Federico');
  //   await page.getByRole('textbox', { name: 'Nombre' }).press('Tab');
  //   await page.getByRole('textbox', { name: 'Apellido' }).fill('Cabanilla');
  //   await page.getByRole('textbox', { name: 'Apellido' }).press('Tab');
  //   await page
  //     .getByRole('textbox', { name: 'Correo electrónico' })
  //     .fill('fcabanilla@cinesa.es');
  //   await page
  //     .getByRole('textbox', { name: 'Correo electrónico' })
  //     .press('Tab');
  //   await page.getByRole('textbox', { name: 'Teléfono' }).fill('123456789045');
  //   await page.getByRole('button', { name: 'Continuar' }).click();
  //   await page.getByRole('button', { name: 'Confirmar' }).click();
  //   await page.getByRole('button', { name: 'Pagar' }).nth(1).click();
  // });

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
