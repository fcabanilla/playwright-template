import { expect, Page } from '@playwright/test';
import { CINEMAS_URL } from './cinemas.data';

export function assertCinemasRedirection(page: Page): void {
	expect(page.url()).toBe(CINEMAS_URL);
}

/**
 * Asserts that the cinema schema data matches the selected cinema information.
 * @param cinemaSchema The cinema schema extracted from the page.
 * @param selectedCinemaName The cinema name selected.
 */
export function assertCinemaSchemaMatches(
  cinemaSchema: any,
  selectedCinemaName: string
): void {
  expect(cinemaSchema['@type'], 'Schema should be of type "MovieTheater"').toBe('MovieTheater');
  const schemaName = cinemaSchema.name?.toLowerCase() || '';
  const expectedName = selectedCinemaName.toLowerCase();
  expect(
    schemaName,
    `Cinema name in schema "${cinemaSchema.name}" should match selected cinema "${selectedCinemaName}"`
  ).toContain(expectedName);
  expect(cinemaSchema.name, 'Cinema name should be present in schema').toBeTruthy();
  expect(cinemaSchema.address, 'Cinema address should be present in schema').toBeTruthy();
  expect(cinemaSchema.geo, 'Cinema geo coordinates should be present in schema').toBeTruthy();
  expect(cinemaSchema.screenCount, 'Cinema screen count should be present in schema').toBeTruthy();
  expect(cinemaSchema.brand, 'Cinema brand should be present in schema').toBeTruthy();
  expect(cinemaSchema.url, 'Cinema URL should be present in schema').toBeTruthy();  
  if (cinemaSchema.address) {
    expect(cinemaSchema.address['@type'], 'Address should be of type "PostalAddress"').toBe('PostalAddress');
    expect(cinemaSchema.address.streetAddress, 'Street address should be present').toBeTruthy();
    expect(cinemaSchema.address.addressLocality, 'Address locality should be present').toBeTruthy();
    expect(cinemaSchema.address.addressCountry, 'Address country should be present').toBeTruthy();
  }  
  if (cinemaSchema.geo) {
    expect(cinemaSchema.geo['@type'], 'Geo should be of type "GeoCoordinates"').toBe('GeoCoordinates');
    expect(cinemaSchema.geo.latitude, 'Latitude should be present').toBeTruthy();
    expect(cinemaSchema.geo.longitude, 'Longitude should be present').toBeTruthy();
  }  
  expect(typeof cinemaSchema.screenCount, 'Screen count should be a number').toBe('number');
  expect(cinemaSchema.screenCount, 'Screen count should be greater than 0').toBeGreaterThan(0);
}
