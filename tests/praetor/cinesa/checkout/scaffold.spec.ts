import { test, expect } from '../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

test.describe('PRAETOR · Checkout · Scaffold Validation', () => {
  test.beforeEach(async () => {
    await allure.epic('PRAETOR');
    await allure.feature('Checkout - Scaffold');
  });

  test('Scaffold · Fixtures · WebActions injection works', { tag: ['@praetor', '@smoke'] }, async ({ webActions }) => {
    await allure.story('Scaffold Validation');

    await allure.step('Verify WebActions fixture is injected', async () => {
      expect(webActions).toBeDefined();
    });
  });
});
