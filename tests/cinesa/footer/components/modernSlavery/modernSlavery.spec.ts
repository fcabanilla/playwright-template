import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { enrichTestMetadata } from '../../../../../core/allure/allureMetadata';
import {
  assertModernSlaveryNavigation,
  assertModernSlaveryPDFDownload,
  assertModernSlaveryPDFPopup,
} from './modernSlavery.assertions';
import { handlePDFInteraction } from './modernSlavery.helpers';
import { expectedUrl } from './modernSlavery.data';

test.describe('Modern Slavery Declaration Tests', () => {
  test.beforeEach(async ({ footer }, testInfo) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');
    await enrichTestMetadata(testInfo);

    await footer.navigateToHome();
  });

  test(
    'Footer · Modern Slavery Declaration · Display & Layout',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }, testInfo) => {
      await allure.story('Modern Slavery Declaration PDF display and layout');
      const { download, popup } = await handlePDFInteraction(
        webActions,
        async () => {
          await footer.clickEsclavitudModerna();
        }
      );

      if (download) {
        await assertModernSlaveryPDFDownload(download);
      } else if (popup) {
        await assertModernSlaveryPDFPopup(popup, testInfo);
        await popup.close();
      }
    }
  );

  test(
    'Footer · Modern Slavery Declaration · Navigate · Redirect',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }) => {
      await allure.story(
        'Modern Slavery Declaration PDF navigation and URL validation'
      );
      const { download, popup } = await handlePDFInteraction(
        webActions,
        async () => {
          await footer.clickEsclavitudModerna();
        }
      );

      if (download) {
        await assertModernSlaveryPDFDownload(download);
      } else if (popup) {
        await assertModernSlaveryNavigation(popup, expectedUrl);
        await popup.close();
      }
    }
  );
});
