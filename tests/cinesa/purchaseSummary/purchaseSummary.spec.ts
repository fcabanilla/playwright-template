import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

import { enrichTestMetadata } from '../../../core/allure/allureMetadata';
test.describe('Purchase Summary', () => {
  test.beforeEach(async ({ page, navbar }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Purchase Summary - Order Review');
    await enrichTestMetadata(testInfo);

    await navbar.navigateToHome();
  });
});
