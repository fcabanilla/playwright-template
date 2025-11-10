import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

test.describe('Purchase Summary', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Purchase Summary - Order Review');

    await navbar.navigateToHome();
  });
});
