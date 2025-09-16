import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';
import { test, expect } from '../../../fixtures/cinesa/playwright.fixtures';

test.describe('Ticket Picker', () => {
  test.beforeEach(async ({ page, navbar }) => {
    await navbar.navigateToHome();
  });
});
