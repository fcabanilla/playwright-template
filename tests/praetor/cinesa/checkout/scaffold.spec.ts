import {
  test,
  expect,
} from '../../../../fixtures/praetor/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';

import { enrichTestMetadata } from '../../../../core/allure/allureMetadata';
test.describe('PRAETOR · Checkout · Scaffold Validation', () => {
  test.beforeEach(async ({}, testInfo) => {
    await allure.epic('PRAETOR');
    await allure.feature('Checkout - Scaffold');
    await enrichTestMetadata(testInfo);
  });

  test(
    'Scaffold · Fixtures · WebActions injection works',
    { tag: ['@praetor', '@smoke'] },
    async ({ webActions }) => {
      await allure.story('Scaffold Validation');

      await allure.step('Verify WebActions fixture is injected', async () => {
        expect(webActions).toBeDefined();
      });
    }
  );
});
