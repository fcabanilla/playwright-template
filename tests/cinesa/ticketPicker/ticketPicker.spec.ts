import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
test.describe('Ticket Picker', () => {
  test.beforeEach(async ({ page, navbar }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Ticket Picker - Entry Selection');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
  });
});
