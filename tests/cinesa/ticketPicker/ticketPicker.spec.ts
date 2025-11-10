import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

test.describe('Ticket Picker', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Ticket Picker - Entry Selection');

    await navbar.navigateToHome();
  });
});
